import LandingItem from "@/components/landing/item/LandingItem";
import EmptyElement from "@/components/feedback/EmptyElement";
import ErrorHandlerElement from "@/components/feedback/error/ErrorHandlerElement";
import { landingKeys } from "@/lib/tanstack/keys";
import { Box, Grid } from "@mui/material";
import { LandingDto } from "@myorg/shared/dto";
import { useQueryClient } from "@tanstack/react-query";

export function LandingList({
    data,
    error,
}: {
    data?: LandingDto[];
    error: unknown;
}) {
    const queryClient = useQueryClient();
    if (error && (!data || data.length === 0))
        return (
            <ErrorHandlerElement
                reset={() =>
                    queryClient.invalidateQueries({ queryKey: landingKeys.lists() })
                }
                error={error}
            />
        );
    if (data && data.length === 0)
        return (
            <Box display="flex" flexDirection="column" flex={1} py={10}>
                <EmptyElement />
            </Box>
        );
    return (
        <Box display="flex" flexDirection="column" flex={1}>
            <Grid container spacing={1.5} columns={{ xs: 1, md: 2, lg: 3 }}>
                {data?.map((e) => (
                    <Grid size={1} key={e.id}>
                        <LandingItem landing={e} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
