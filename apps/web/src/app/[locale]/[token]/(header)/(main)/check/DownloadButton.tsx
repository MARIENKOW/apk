'use client'

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
    return (
        <StyledButton
            onClick={() => {
                if (disabled) return;
                const a = document.createElement("a");
                a.href = url;
                a.download = "";
                document.body.appendChild(a);
                a.click();
                a.remove();
            }}
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
