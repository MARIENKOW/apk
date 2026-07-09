import { Box, Card } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { StyledIconButton } from "@/components/ui/StyledIconButton";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { useConfirm } from "@/hooks/useConfirm";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import { Link } from "@/i18n/navigation";
import { useDeleteBank } from "@/hooks/tanstack/useBankMutations";
import CardContent from "@mui/material/CardContent";
import { BankDto } from "@myorg/shared/dto";
import { StyledDivider } from "@/components/ui/StyledDivider";

const BankItem = ({ bank }: { bank: BankDto }) => {
    const { confirm, confirmDialog } = useConfirm();
    const deleteBank = useDeleteBank();

    const handleDelete = async () => {
        const ok = await confirm();
        if (!ok) return;
        deleteBank.mutate(bank.id);
    };

    return (
        <Card
            component="div"
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "none",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            {confirmDialog}
            <CardContent
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 0,
                    pb: "0 !important",
                    minWidth: 0,
                }}
            >
                {/* Логотип */}
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={1}
                    minHeight={120}
                    sx={{ bgcolor: "action.hover" }}
                >
                    <Box
                        component="img"
                        src={bank.logo.url}
                        alt={bank.name}
                        sx={{
                            maxHeight: 80,
                            maxWidth: "100%",
                            objectFit: "contain",
                        }}
                    />
                </Box>

                <StyledDivider />

                {/* Название + цвет */}
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    p={2}
                    flex={1}
                    minWidth={0}
                >
                    <Box
                        sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            bgcolor: bank.color,
                            border: "1px solid",
                            borderColor: "divider",
                            flexShrink: 0,
                        }}
                    />
                    <StyledTypography
                        variant="subtitle1"
                        fontWeight={600}
                        noWrap
                        sx={{ minWidth: 0 }}
                    >
                        {bank.name}
                    </StyledTypography>
                </Box>

                <StyledDivider />

                {/* Действия */}
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    p={1}
                    justifyContent="flex-end"
                >
                    <Box display="flex" gap={0.5}>
                        <Link
                            href={`${FULL_PATH_ROUTE.admin.bank.update.path}/${bank.id}`}
                        >
                            <StyledIconButton>
                                <EditIcon fontSize="small" />
                            </StyledIconButton>
                        </Link>
                        <StyledIconButton
                            loading={deleteBank.isPending}
                            onClick={handleDelete}
                        >
                            <DeleteForeverIcon fontSize="small" color="error" />
                        </StyledIconButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default BankItem;
