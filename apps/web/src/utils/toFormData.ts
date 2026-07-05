export function toFormData(
    obj: Record<string, string | number | boolean | File | Blob | Date | string[] | null | undefined>,
): FormData {
    const formData = new FormData();
    for (const [key, value] of Object.entries(obj)) {
        if (value === null || value === undefined) {
            continue;
        } else if (value instanceof File || value instanceof Blob) {
            formData.append(key, value);
        } else if (Array.isArray(value)) {
            value.forEach((item) => formData.append(`${key}[]`, item));
        } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
        } else if (typeof value === "number" || typeof value === "boolean") {
            formData.append(key, String(value));
        } else {
            formData.append(key, value);
        }
    }
    return formData;
}
