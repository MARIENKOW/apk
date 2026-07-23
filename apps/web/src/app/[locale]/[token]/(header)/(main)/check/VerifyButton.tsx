"use client";

import { StyledButton } from "@/components/ui/StyledButton";

export default function VerifyButton({
  url,
  label,
}: {
  url: string;
  label: string;
}) {
  return (
    <StyledButton
      variant="outlined"
      color="primary"
      fullWidth
      disableElevation
      onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
      sx={{
        textTransform: "none",
      }}
    >
      {label}
    </StyledButton>
  );
}
