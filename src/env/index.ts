// Коментування
// Файл для експорту BASE_URL для запитів API
const BASE_URL: string = import.meta.env.VITE_API_URL as string;

// Змінні середовища
const APP_ENV = {
    BASE_URL: BASE_URL
};

export { APP_ENV };