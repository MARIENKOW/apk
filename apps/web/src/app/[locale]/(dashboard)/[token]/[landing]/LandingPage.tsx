import { ContainerComponent } from "@/components/ui/Container";
import { StyledDivider } from "@/components/ui/StyledDivider";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { Box, Toolbar } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { LandingDto } from "@myorg/shared/dto";
import HeaderUser from "@/components/layout/header/user/HeaderUser";
import InterpreterModeOutlinedIcon from "@mui/icons-material/InterpreterModeOutlined";

export default function LandingPage({
    landing,
    admin = false,
}: {
    landing: LandingDto;
    admin?: boolean;
}) {
    const {
        title,
        subtitle,
        phone,
        background,
        logo,
        color,
        logoHeight,
        btnName,
    } = landing;
    return (
        <Box display={"flex"} flexDirection={"column"} flex={1}>
            <HeaderUser>
                <Box component={"img"} height={logoHeight} src={logo.url} />
            </HeaderUser>
            <Box
                sx={{
                    backgroundImage: `url('${background.url}')`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                minHeight={150}
                flex={1}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Box
                    textAlign={"center"}
                    display={"flex"}
                    maxWidth={700}
                    flexDirection={"column"}
                    gap={2}
                    margin={"0 auto"}
                    width={"100%"}
                    p={2}
                >
                    <StyledTypography
                        fontSize={admin ? 20 : 30}
                        color="#fff"
                        variant="h1"
                    >
                        {title}
                    </StyledTypography>
                    {subtitle ? (
                        <StyledTypography
                            fontSize={admin ? 12 : 14}
                            color="#fff"
                        >
                            {subtitle}
                        </StyledTypography>
                    ) : (
                        ""
                    )}
                </Box>
            </Box>
            <Box>
                {/* <Box
                    component={"a"}
                    href="mailto:den.marienkow@gmail.com"
                    alignItems={"center"}
                    display={"flex"}
                >
                    <Box p={2}>
                        <Box
                            component={"img"}
                            width={28}
                            height={28}
                            src={"/assistent.svg"}
                        />
                    </Box>
                    <Box
                        py={2}
                        pr={2}
                        display={"flex"}
                        flexDirection={"column"}
                    >
                        <Box display={"flex"} alignItems={"center"} gap={1}>
                            <StyledTypography
                                fontSize={17}
                                fontWeight={500}
                                display={"inline-flex"}
                            >
                                Contact a banker
                            </StyledTypography>
                            <ArrowForwardIosIcon sx={{ color, fill: color }} />
                        </Box>
                        <StyledTypography fontSize={12}>
                            Email a banker at our call center (after log in)
                        </StyledTypography>
                    </Box>
                </Box> */}
                <StyledDivider />
                <Box
                    component={"a"}
                    href={`tel:${phone}`}
                    alignItems={"center"}
                    display={"flex"}
                >
                    <Box p={admin ? 1 : 2}>
                        {/* <Box
                            component={"img"}
                            width={28}
                            height={28}
                            sx={{ fill: color, color }}
                            src={"/Globe.svg"}
                        /> */}
                        <InterpreterModeOutlinedIcon
                            sx={{ width: 28, height: 28, fill: color, color }}
                        />
                    </Box>
                    <Box
                        py={admin ? 1 : 2}
                        pr={admin ? 1 : 2}
                        display={"flex"}
                        flexDirection={"column"}
                    >
                        <Box
                            display={"flex"}
                            alignItems={"center"}
                            gap={admin ? 0.5 : 1}
                        >
                            <StyledTypography
                                fontSize={admin ? 14 : 17}
                                fontWeight={500}
                                display={"inline-flex"}
                            >
                                {btnName}
                            </StyledTypography>
                            <ArrowForwardIosIcon sx={{ color, fill: color }} />
                        </Box>
                        <StyledTypography fontSize={admin ? 10 : 12}>
                            {phone}
                        </StyledTypography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
