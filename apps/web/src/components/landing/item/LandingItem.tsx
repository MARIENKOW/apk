import { Box, Card } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { StyledIconButton } from "@/components/ui/StyledIconButton";
import { useConfirm } from "@/hooks/useConfirm";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import { Link } from "@/i18n/navigation";
import { useDeleteLanding } from "@/hooks/tanstack/useLandingMutations";
import CardContent from "@mui/material/CardContent";
import { LandingDto } from "@myorg/shared/dto";
import LandingPage from "@/app/[locale]/(dashboard)/[token]/[landing]/LandingPage";
import { StyledDivider } from "@/components/ui/StyledDivider";

const LandingItem = ({ landing }: { landing: LandingDto }) => {
  const { confirm, confirmDialog } = useConfirm();
  const deleteLanding = useDeleteLanding();

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    deleteLanding.mutate(landing.id);
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
        <LandingPage admin={true} landing={landing} />
        <StyledDivider />
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          p={1}
          justifyContent="flex-end"
        >
          <Box display="flex" gap={0.5}>
            <Link
              href={`${FULL_PATH_ROUTE.admin.landing.update.path}/${landing.id}`}
            >
              <StyledIconButton>
                <EditIcon fontSize="small" />
              </StyledIconButton>
            </Link>
            <StyledIconButton
              loading={deleteLanding.isPending}
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

export default LandingItem;
