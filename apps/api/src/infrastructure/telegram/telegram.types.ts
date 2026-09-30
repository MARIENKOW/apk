// Доменно-нейтральные контракты между инфраструктурой (grammy) и бизнес-логикой.
// Модули не знают про grammy — только про эти типы.

/** Одна inline-кнопка: подпись + callback_data (кодируется в lead.callback). */
export interface InlineButton {
  text: string;
  data: string;
}

/** Матрица inline-кнопок (строки × кнопки). Пустая матрица убирает клавиатуру. */
export type InlineKeyboardModel = InlineButton[][];

/** Нажатие inline-кнопки, приведённое к плоскому виду. */
export interface IncomingCallback {
  /** id callback_query — обязателен для answerCallbackQuery. */
  id: string;
  data: string;
  fromId: string;
  fromName: string;
  chatId: string;
  /** id сообщения, под которым нажата кнопка (карточка или промпт). */
  messageId: number;
}

/** Ответ (reply) на сообщение бота — так холодка присылает дополнение. */
export interface IncomingReply {
  fromId: string;
  fromName: string;
  chatId: string;
  messageId: number;
  /** id сообщения, на которое ответили (наш промпт). */
  replyToMessageId: number;
  text: string;
}

/** Результат отправки — координаты сообщения для последующего editMessageText. */
export interface SentMessage {
  chatId: string;
  messageId: number;
}

export interface AnswerOptions {
  text?: string;
  /** true → всплывающий алерт вместо тоста. */
  alert?: boolean;
}
