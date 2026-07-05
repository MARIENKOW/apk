import { ContainerComponent } from "@/components/ui/Container";
import { Box } from "@mui/material";

export default function HeaderUser({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box borderBottom={"1px solid"} borderColor={"divider"}>
            <ContainerComponent py={false}>
                <Box
                    py={1}
                    display={"flex"}
                    alignItems={"center"}
                    minHeight={54}
                    justifyContent={"center"}
                >
                    {children}
                </Box>
            </ContainerComponent>
        </Box>
    );
}
