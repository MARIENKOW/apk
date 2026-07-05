import TokenItem from "@/components/token/TokenItem";
import EmptyElement from "@/components/feedback/EmptyElement";
import ErrorHandlerElement from "@/components/feedback/error/ErrorHandlerElement";
import { tokenKeys } from "@/lib/tanstack/keys";
import { Box, Grid } from "@mui/material";
import { TokenDto } from "@myorg/shared/dto";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
    data?: TokenDto[];
    error: unknown;
}

export function TokenList({ data, error }: Props) {
    const queryClient = useQueryClient();

    if (error && (!data || data.length === 0))
        return (
            <ErrorHandlerElement
                reset={() => queryClient.invalidateQueries({ queryKey: tokenKeys.all })}
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
                {data?.map((token) => (
                    <Grid size={1} key={token.id}>
                        <TokenItem token={token} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
