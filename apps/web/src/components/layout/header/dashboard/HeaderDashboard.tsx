import { ContainerComponent } from "@/components/ui/Container";
import { Box } from "@mui/material";
import GoogleTranslate from "@/components/features/GoogleTranslate";

export default function HeaderDashboard() {
    return (
        <Box borderBottom={"1px solid"} borderColor={"divider"}>
            <ContainerComponent py={false}>
                <Box
                    py={1}
                    minHeight={54}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                >
                    <GoogleTranslate />
                </Box>
            </ContainerComponent>
        </Box>
    );
}
