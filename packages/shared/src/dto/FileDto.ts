export interface FileDto {
    id: string;
    url: string; // публичный URL файла
    originalName: string; // исходное имя файла (как загрузил админ)
    mimeType: string;
    size: number; // байты
    createdAt: string;
}
