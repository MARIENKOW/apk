import { ContainerComponent } from "@/components/ui/Container";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { Box } from "@mui/material";
import { getTranslations } from "next-intl/server";
import AcceptForm from "@/components/form/AcceptForm";

export default async function Page() {
    const t = await getTranslations("pages.accept");

    return (
        <ContainerComponent maxWidth="md">
            <Box mt={3} flex={1} display="flex" flexDirection="column" gap={4}>
                {/* Заголовок + описание */}
                <Box display="flex" flexDirection="column" gap={2}>
                    <StyledTypography
                        variant="h1"
                        fontSize={{ xs: 28, md: 34 }}
                        fontWeight={700}
                        color="text.primary"
                    >
                        {t("title")}
                    </StyledTypography>
                    <StyledTypography
                        fontSize={{ xs: 15, md: 16 }}
                        color="text.secondary"
                    >
                        {t("description")}
                    </StyledTypography>
                </Box>

                {/* Форма получения */}
                <Box display="flex" flexDirection="column" gap={2}>
                    <StyledTypography
                        variant="h2"
                        fontSize={{ xs: 18, md: 20 }}
                        fontWeight={700}
                        color="text.primary"
                    >
                        {t("formTitle")}
                    </StyledTypography>
                    <AcceptForm />
                </Box>
            </Box>
        </ContainerComponent>
    );
}
