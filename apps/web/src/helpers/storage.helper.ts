// Лёгкая обфускация значений в localStorage: XOR + base64 поверх UTF-8.
// Это НЕ шифрование и не защита данных — цель лишь в том, чтобы значение
// не читалось глазами в DevTools и не выдавало свою структуру.

// Произвольная строка-«ключ» для XOR. Меняется — старые записи станут нечитаемы.
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

// UTF-8-safe base64 (btoa не умеет символы вне Latin1, например кириллицу).
function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function fromBase64(str: string): string {
  return decodeURIComponent(escape(atob(str)));
}

// Сериализует значение в непрозрачную строку для localStorage.
export function encodeStorageValue(value: unknown): string {
  return toBase64(xor(JSON.stringify(value)));
}

// Восстанавливает значение; при любой ошибке разбора возвращает null.
export function decodeStorageValue<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(xor(fromBase64(raw))) as T;
  } catch {
    return null;
  }
}
