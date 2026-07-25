// Иконка приложения «Сообщения» (зелёный градиент + белый пузырь).
export function MessagesIcon({ size = 38 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            role="img"
            aria-label="Messages"
        >
            <defs>
                <linearGradient id="ios-msg-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#5BF675" />
                    <stop offset="1" stopColor="#00B92E" />
                </linearGradient>
            </defs>
            <rect width="100" height="100" rx="23" fill="url(#ios-msg-grad)" />
            <path
                fill="#fff"
                d="M50 25c-15.7 0-28.5 10.2-28.5 22.8 0 7.1 4.1 13.4 10.5 17.5-.5 3.4-2.1 7-4.8 9.9-.7.7-.2 1.9.8 1.8 5.6-.5 10.1-2.5 13.4-4.9 2.8.7 5.9 1.1 9 1.1C65.7 73.4 78.5 63.2 78.5 47.8 78.5 35.2 65.7 25 50 25z"
            />
        </svg>
    );
}
