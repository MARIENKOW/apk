"use server";

import axios from "axios";
import { axiosServerConfig, applyCookieInterceptor } from "@/utils/api/axios.server";

// Публичный axios-инстанс для серверных компонентов (без x-type ADMIN).
export const $apiAxiosServer = axios.create({
    ...axiosServerConfig,
});

applyCookieInterceptor($apiAxiosServer);
