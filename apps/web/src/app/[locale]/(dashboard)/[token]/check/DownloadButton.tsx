import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { StyledButton } from "@/components/ui/StyledButton";

export default function DownloadButton({
    url,
    label,
    disabled,
}: {
    url: string;
    label: string;
    disabled?: boolean;
}) {
    // Button с href рендерится как <a> и ведёт на attachment-эндпоинт:
    // браузер стримит файл на диск (в память не грузит), имя берёт из
    // Content-Disposition. Без JS.
    return (
        <StyledButton
            href={disabled ? undefined : url}
            disabled={disabled}
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<FileDownloadOutlinedIcon />}
            sx={{
                borderRadius: 3,
                py: 1.75,
                fontSize: 16,
                fontWeight: 700,
                textTransform: "none",
            }}
        >
            {label}
        </StyledButton>
    );
}
