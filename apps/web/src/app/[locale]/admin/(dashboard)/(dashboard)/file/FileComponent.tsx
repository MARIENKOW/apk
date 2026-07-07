"use client";

import { useCallback, useRef, useState } from "react";
import { Box, Card, CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import * as uuid from "uuid";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AndroidIcon from "@mui/icons-material/Android";

import { StyledTypography } from "@/components/ui/StyledTypography";
import { StyledButton } from "@/components/ui/StyledButton";
import { DropZone } from "@/components/features/form/fields/uncontrolled/DropZone";
import { UploadItemRow } from "@/components/features/Uploader/UploadItemRow";
import { UploadItem } from "@/components/features/Uploader/types";
import { useAppFile } from "@/hooks/tanstack/useAppFile";
import { useDeleteAppFile } from "@/hooks/tanstack/useAppFileMutations";
import { useConfirm } from "@/hooks/useConfirm";
import { errorHandler } from "@/helpers/error/error.handler.helper";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";
import { snackbarError } from "@/utils/snackbar/snackbar.error";
import { appFileKeys } from "@/lib/tanstack/keys";
import { formatBytes } from "@myorg/shared/utils";
import { DOWNLOAD_FILE_CONFIG } from "@myorg/shared/form";
import FileService from "@/services/file/file.service";
import { $apiAdminAxiosClient } from "@/utils/api/admin/axios.admin.client";
import { FileDto } from "@myorg/shared/dto";
import { normalizeError } from "@/helpers/error/error.type.helper";

const { upload } = new FileService($apiAdminAxiosClient);

export default function FileComponent() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const { data, isLoading } = useAppFile();
  const remove = useDeleteAppFile();
  const { confirm, confirmDialog } = useConfirm();

  // Одиночный элемент загрузки (нет очереди — только один файл).
  const [item, setItem] = useState<UploadItem | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const smoothedSpeed = useRef(0);
  // Скрытый input для «Заменить» (у карточки файла нет дропзоны).
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const patch = useCallback((partial: Partial<UploadItem>) => {
    setItem((prev) => (prev ? { ...prev, ...partial } : prev));
  }, []);

  const uploadOne = useCallback(
    async (file: File) => {
      const controller = new AbortController();
      abortRef.current = controller;
      smoothedSpeed.current = 0;
      let lastLoaded = 0;
      let lastTime = Date.now();

      try {
        const res = await upload(
          { file },
          {
            signal: controller.signal,
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (e) => {
              const loaded = e.loaded;
              const total = e.total ?? 0;
              const now = Date.now();
              const dt = (now - lastTime) / 1000;
              if (dt > 0.1) {
                const instant = (loaded - lastLoaded) / dt;
                smoothedSpeed.current =
                  0.3 * instant + 0.7 * smoothedSpeed.current;
                lastLoaded = loaded;
                lastTime = now;
              }
              patch({
                progress:
                  total > 0
                    ? Math.min(Math.round((loaded / total) * 100), 100)
                    : 0,
                speed: smoothedSpeed.current,
              });
            },
          },
        );

        patch({ status: "done", progress: 100, speed: 0 });
        queryClient.setQueryData<FileDto | null>(appFileKeys.all, res.data);
        snackbarSuccess(t("pages.admin.file.feedback.uploaded"));
        // Готово — прячем строку, показываем карточку файла
        setItem(null);
      } catch (err) {
        let cancelled = false;
        errorHandler({
          error: err,
          t,
          fallback: {
            cancel: {
              hideMessage: true,
              callback: () => {
                cancelled = true;
              },
            },
            "axios-validation": {
              hideMessage: true,
              callback: () => {
                const { fields } = normalizeError<{ file: string }>({
                  error: err,
                  t,
                });
                const msg = fields?.file?.[0];
                if (msg) snackbarError(t(msg));
              },
            },
          },
        });
        if (cancelled) {
          setItem(null);
        } else {
          patch({ status: "error", speed: 0 });
        }
      } finally {
        abortRef.current = null;
      }
    },
    [patch, queryClient, t],
  );

  const startUpload = useCallback(
    (file: File) => {
      if (file.size > DOWNLOAD_FILE_CONFIG.maxFileSizeBytes) {
        snackbarError(t("form.file.download.tooLarge"));
        return;
      }
      setItem({
        id: uuid.v4(),
        file,
        status: "uploading",
        progress: 0,
        speed: 0,
      });
      void uploadOne(file);
    },
    [t, uploadOne],
  );

  const handleReplacePick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (file) startUpload(file);
    },
    [startUpload],
  );

  const handleDelete = useCallback(async () => {
    const ok = await confirm();
    if (!ok) return;
    remove.mutate();
  }, [confirm, remove]);

  const uploading = item?.status === "uploading";
  const busy = uploading || isLoading || remove.isPending;

  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={3}
      py={6}
    >
      {confirmDialog}
      <input
        ref={replaceInputRef}
        type="file"
        hidden
        onChange={handleReplacePick}
      />

      {/* Заголовок */}
      <Box
        textAlign="center"
        maxWidth={520}
        display="flex"
        flexDirection="column"
        gap={1}
      >
        <StyledTypography variant="h5" fontWeight={700}>
          {t("pages.admin.file.title")}
        </StyledTypography>
        <StyledTypography color="text.secondary" fontSize={14}>
          {t("pages.admin.file.description")}
        </StyledTypography>
      </Box>

      {/* Виджет */}
      <Box
        width="100%"
        maxWidth={480}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        {/* Дропзона — видна всегда, КРОМЕ случая когда файл уже загружен.
            При замене (идёт item) снова появляется. При загрузке затемняется
            одинаково с первичной. */}
        {(!data || item) && (
          <Box position="relative">
            <DropZone
              accept={[]}
              disabled={busy}
              onFiles={(files) => {
                if (files[0]) startUpload(files[0]);
              }}
              labelIdle={t("pages.admin.file.actions.upload")}
              sublabel={t("pages.admin.file.dropHint")}
            />
            {busy && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(0,0,0,0.35)",
                  pointerEvents: "none",
                }}
              >
                <CircularProgress size={32} />
              </Box>
            )}
          </Box>
        )}

        {/* Под дропзоной: строка прогресса (загрузка/ошибка) или карточка файла */}
        {item ? (
          <UploadItemRow
            item={item}
            fileIcon={(color) => <AndroidIcon sx={{ fontSize: 18, color }} />}
            onCancel={() => abortRef.current?.abort()}
            onRemove={() => setItem(null)}
          />
        ) : data ? (
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "action.hover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InsertDriveFileOutlinedIcon
                color="primary"
                sx={{ fontSize: 32 }}
              />
            </Box>
            <Box minWidth={0} width="100%">
              <StyledTypography
                fontWeight={600}
                sx={{ wordBreak: "break-word" }}
              >
                {data.originalName}
              </StyledTypography>
              <StyledTypography color="text.secondary" fontSize={13}>
                {formatBytes(data.size)}
              </StyledTypography>
            </Box>
            <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
              <StyledButton
                variant="contained"
                onClick={() => replaceInputRef.current?.click()}
                disabled={busy}
              >
                {t("pages.admin.file.actions.replace")}
              </StyledButton>
              <StyledButton
                variant="outlined"
                color="error"
                onClick={handleDelete}
                disabled={busy}
                startIcon={<DeleteOutlineIcon />}
              >
                {t("pages.admin.file.actions.delete")}
              </StyledButton>
            </Box>
          </Card>
        ) : null}
      </Box>
    </Box>
  );
}
