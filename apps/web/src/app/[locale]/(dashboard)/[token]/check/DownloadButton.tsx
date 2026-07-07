import { Button } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

export default function DownloadButton({
    url,
    label,
    disabled,
}: {
    url: string;
    label: string;
    disabled?: boolean;
}) {
    // Обычная ссылка на attachment-эндпоинт: браузер стримит файл на диск
    // (в память не грузит), имя берёт из Content-Disposition. Без JS.
    return (
        <Button
            component="a"
            href={disabled ? undefined : url}
            download
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
        </Button>
    );
}
