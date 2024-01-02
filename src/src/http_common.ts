// Коментуваня
import axios from "axios";
import {APP_ENV} from "./env"; // Імпортуємо BASE_URL із конфігурації середовища

//console.log("URL", APP_ENV.BASE_URL);

// Створюємо екземпляр Axios із базовою URL-адресою та заголовками за замовчуванням
// Базовий URL береться з конфігурації середовища
const http_common = axios.create({
    baseURL: APP_ENV.BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export default  http_common;