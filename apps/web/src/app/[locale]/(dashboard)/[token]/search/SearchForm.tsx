"use client";

import { Box, InputBase, CircularProgress, Collapse } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { StyledButton } from "@/components/ui/StyledButton";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { StyledAlert } from "@/components/ui/StyledAlert";
import { Link } from "@/i18n/navigation";
import { useState } from "react";

type Props = {
  checkHref: string;
  placeholder: string;
  button: string;
  noNumber: string;
};

export default function SearchForm({
  checkHref,
  placeholder,
  button,
  noNumber,
}: Props) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Уже идёт загрузка — повторные нажатия игнорируем.
    if (loading) return;
    // Пустой ввод — не отправляем.
    if (!value.trim()) {
      setError("Введите номер накладной");
      return;
    }
    // Заглушка: крутим загрузку, затем показываем результат.
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setError("Номер накладной не найден");
    }, 2000);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display={"flex"}
      flexDirection={"column"}
      gap={1.25}
      width={"100%"}
      maxWidth={520}
      mx={"auto"}
    >
      {/* Единая строка поиска: поле + кнопка встык */}
      <Box
        display={"flex"}
        alignItems={"stretch"}
        sx={{
          bgcolor: "background.paper",
          border: "1.5px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
          transition: "border-color .15s ease, box-shadow .15s ease",
          "&:focus-within": {
            borderColor: "primary.main",
            boxShadow: "0 0 0 4px rgba(0,0,0,0.06)",
          },
        }}
      >
        <InputBase
          fullWidth
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError("");
          }}
          placeholder={placeholder}
          sx={{
            flex: 1,
            px: 2.5,
            "& input": { py: 1.75, fontSize: 16 },
          }}
        />
        <StyledButton
          type="submit"
          disableElevation
          variant="contained"
          disabled={loading}
          aria-label={button}
          sx={{
            minWidth: 64,
            px: 3,
            borderRadius: 0,
          }}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            <SearchRoundedIcon />
          )}
        </StyledButton>
      </Box>

      {/* Сообщение об ошибке */}
      <Collapse in={!!error} unmountOnExit>
        <StyledAlert
          severity="error"
          variant="filled"
          onClose={() => setError("")}
          sx={{ borderRadius: 3 }}
        >
          {error}
        </StyledAlert>
      </Collapse>

      {/* Ссылка «Нет номера накладной?» — синим */}
      <Box mt={1} display={"flex"} justifyContent={"flex-start"}>
        <Link href={checkHref}>
          <StyledTypography
            sx={{ color: "#1976d2", fontWeight: 500, fontSize: 13 }}
          >
            {noNumber}
          </StyledTypography>
        </Link>
      </Box>
    </Box>
  );
}
