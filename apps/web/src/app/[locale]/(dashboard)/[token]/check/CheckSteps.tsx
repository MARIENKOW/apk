"use client";

import { StyledDialog } from "@/components/ui/StyledDialog";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { useState } from "react";

export type CheckStep = {
    /** URL скриншота. Пока не задан — показываем пустой плейсхолдер. */
    src: string;
    /** Подпись/alt для картинки (напр. «Шаг 1»). */
    alt: string;
};

export default function CheckSteps({
    steps,
    closeLabel,
}: {
    steps: CheckStep[];
    closeLabel: string;
}) {
    const [active, setActive] = useState<number | null>(null);
    const activeStep = active !== null ? steps[active] : null;

    return (
        <>
            <Box
                display={"grid"}
                gridTemplateColumns={`repeat(${steps.length}, 1fr)`}
                gap={{ xs: 1.5, md: 2 }}
            >
                {steps.map((step, index) => (
                    <Box key={index} position={"relative"}>
                        {/* Номер шага */}
                        <Box
                            position={"absolute"}
                            top={-10}
                            left={-10}
                            zIndex={1}
                            width={28}
                            height={28}
                            borderRadius={"50%"}
                            bgcolor={"primary.main"}
                            color={"primary.contrastText"}
                            border={"2px solid"}
                            borderColor={"background.paper"}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            fontSize={14}
                            fontWeight={700}
                        >
                            {index + 1}
                        </Box>

                        {/* Слот под скриншот */}
                        <Box
                            component={step.src ? "button" : "div"}
                            onClick={step.src ? () => setActive(index) : undefined}
                            aria-label={step.src ? step.alt : undefined}
                            sx={{
                                p: 0,
                                m: 0,
                                width: "100%",
                                aspectRatio: "1 / 2",
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor: "divider",
                                bgcolor: "background.default",
                                overflow: "hidden",
                                position: "relative",
                                display: "block",
                                cursor: step.src ? "pointer" : "default",
                                transition: "border-color .15s ease",
                                "&:hover": step.src
                                    ? {
                                          borderColor: "primary.main",
                                          "& .zoom-badge": {
                                              bgcolor: "primary.main",
                                          },
                                          "& .zoom-scrim": { opacity: 1 },
                                      }
                                    : undefined,
                            }}
                        >
                            {step.src ? (
                                <>
                                    <Box
                                        component={"img"}
                                        src={step.src}
                                        alt={step.alt}
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                    />
                                    {/* Затемнение при наведении (десктоп) */}
                                    <Box
                                        className="zoom-scrim"
                                        sx={{
                                            position: "absolute",
                                            inset: 0,
                                            bgcolor: "rgba(0,0,0,0.15)",
                                            opacity: 0,
                                            transition: "opacity .15s ease",
                                            pointerEvents: "none",
                                        }}
                                    />
                                    {/* Иконка «увеличить» — постоянно видна (важно для тача) */}
                                    <Box
                                        className="zoom-badge"
                                        sx={{
                                            position: "absolute",
                                            bottom: 8,
                                            right: 8,
                                            width: 30,
                                            height: 30,
                                            borderRadius: "50%",
                                            bgcolor: "rgba(0,0,0,0.55)",
                                            color: "#fff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "background-color .15s ease",
                                            pointerEvents: "none",
                                        }}
                                    >
                                        <ZoomInIcon sx={{ fontSize: 20 }} />
                                    </Box>
                                </>
                            ) : null}
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* Полноэкранный просмотр */}
            <StyledDialog
                fullScreen
                open={active !== null}
                onClose={() => setActive(null)}
                slotProps={{
                    paper: { sx: { bgcolor: "rgba(0,0,0,0.92)" } },
                }}
            >
                <IconButton
                    onClick={() => setActive(null)}
                    aria-label={closeLabel}
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        color: "#fff",
                        bgcolor: "primary.main",
                        zIndex: 1,
                        "&:hover": { bgcolor: "primary.dark" },
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Box
                    height={"100%"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    p={2}
                    onClick={() => setActive(null)}
                >
                    {activeStep?.src ? (
                        <Box
                            component={"img"}
                            src={activeStep.src}
                            alt={activeStep.alt}
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                            }}
                        />
                    ) : null}
                </Box>
            </StyledDialog>
        </>
    );
}
