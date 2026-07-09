// Лёгкая обфускация значений, передаваемых через query-строку URL:
// XOR + URL-safe base64 поверх UTF-8.
// Это НЕ шифрование и не защита данных — цель лишь в том, чтобы значение
// не читалось глазами в адресной строке и не выдавало свою структуру.

// Произвольная строка-«ключ» для XOR. Меняется — старые ссылки станут нечитаемы.
const XOR_KEY = "a7f3c1e9";

function xor(input: string): string {
  let out = "";
  for (let i = 0; i < input.length; i++) {
    out += String.fromCharCode(
      input.charCodeAt(i) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length),
    );
  }
  return out;
}

// UTF-8-safe base64 (btoa не умеет символы вне Latin1, например кириллицу),
// приведённый к URL-safe виду: без +, / и хвостовых =.
function toBase64Url(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(str: string): string {
  const normalized = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad =
    normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return decodeURIComponent(escape(atob(normalized + pad)));
}

// Сериализует значение в непрозрачную строку, пригодную для query-параметра.
export function encodeUrlPayload(value: unknown): string {
  return toBase64Url(xor(JSON.stringify(value)));
}

// Восстанавливает значение; при любой ошибке разбора возвращает null.
export function decodeUrlPayload<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(xor(fromBase64Url(raw))) as T;
  } catch {
    return null;
  }
}
