import HeaderDashboard from "@/components/layout/header/dashboard/HeaderDashboard";
import { Box } from "@mui/material";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box display={"flex"} flexDirection={"column"} minHeight={"100dvh"}>
            <HeaderDashboard />
            <Box
                component={"main"}
                display={"flex"}
                flexDirection={"column"}
                flex={1}
            >
                {children}
            </Box>
        </Box>
    );
}
