import { ContainerComponent } from "@/components/ui/Container";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { Box } from "@mui/material";
import { StyledButton } from "@/components/ui/StyledButton";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const t = await getTranslations("pages.continue");

  const blocks = [
    { icon: <VerifiedUserRoundedIcon />, text: "paragraph1" },
    { icon: <LocalShippingRoundedIcon />, text: "paragraph2" },
    { icon: <LoginRoundedIcon />, text: "paragraph3" },
  ] as const;

  return (
    <ContainerComponent maxWidth="md">
      <Box mt={3} flex={1} display={"flex"} flexDirection={"column"}>
        {/* Заголовок */}
        <StyledTypography
          variant="h1"
          fontSize={{ xs: 28, md: 34 }}
          fontWeight={700}
          color={"text.primary"}
          mb={4}
        >
          {t("title")}
        </StyledTypography>

        {/* Три блока */}
        <Box display={"flex"} flexDirection={"column"} gap={2}>
          {blocks.map(({ icon, text }, i) => (
            <Box
              key={i}
              display={"flex"}
              alignItems={"flex-start"}
              gap={2}
              p={{ xs: 2.5, md: 3 }}
              borderRadius={4}
              border={"1px solid"}
              borderColor={"divider"}
              bgcolor={"background.paper"}
              sx={{
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  bgcolor: "primary.main",
                },
              }}
            >
              <Box
                flexShrink={0}
                width={48}
                height={48}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                borderRadius={"50%"}
                color={"primary.main"}
                sx={{
                  bgcolor:
                    "color-mix(in srgb, var(--mui-palette-primary-main) 12%, transparent)",
                }}
              >
                {icon}
              </Box>
              <StyledTypography
                fontSize={{ xs: 15, md: 16 }}
                color={"text.secondary"}
                alignSelf={"center"}
                lineHeight={"140%"}
              >
                {t(text)}
              </StyledTypography>
            </Box>
          ))}
        </Box>

        {/* Кнопка «Продолжить» — прижата к низу */}
        <Box mt={5} pt={4}>
          <Link
            href={"/" + token + "/authorization"}
            style={{ display: "block" }}
          >
            <StyledButton
              variant="contained"
              color="primary"
              fullWidth
              disableElevation
              startIcon={<LoginRoundedIcon />}
              sx={{
                borderRadius: 3,
                py: 1.75,
                fontSize: 16,
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              {t("button")}
            </StyledButton>
          </Link>
        </Box>
      </Box>
    </ContainerComponent>
  );
}
