import { ContainerComponent } from "@/components/ui/Container";
import { Box } from "@mui/material";
import GoogleTranslate from "@/components/features/GoogleTranslate";
import Image from "next/image";

export default function HeaderDashboard() {
    return (
        <Box borderBottom={"1px solid"} borderColor={"divider"}>
            <ContainerComponent py={false}>
                <Box
                    py={1}
                    minHeight={54}
                    display={"grid"}
                    gridTemplateColumns={"1fr auto 1fr"}
                    alignItems={"center"}
                >
                    <Box />
                    <Box display={"flex"} justifyContent={"center"}>
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={150}
                            height={45}
                            priority
                        />
                    </Box>
                    <Box display={"flex"} justifyContent={"flex-end"}>
                        <GoogleTranslate />
                    </Box>
                </Box>
            </ContainerComponent>
        </Box>
    );
}
