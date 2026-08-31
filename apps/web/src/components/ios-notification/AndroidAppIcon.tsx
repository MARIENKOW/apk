// Иконка приложения для Android-уведомления (круглый значок с чат-пузырём).
// Нейтральная заглушка — конкретный бренд/иконку можно передать через prop `icon`.
export function AndroidAppIcon({ size = 38 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            role="img"
            aria-label="App"
        >
            <defs>
                <linearGradient id="android-app-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#4285F4" />
                    <stop offset="1" stopColor="#1A73E8" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="50" fill="url(#android-app-grad)" />
            <path
                fill="#fff"
                d="M31 32h38a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6H45l-12 10a1.5 1.5 0 0 1-2.4-1.2V68h-.6a6 6 0 0 1-6-6V38a6 6 0 0 1 6-6z"
            />
        </svg>
    );
}
