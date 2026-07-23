import type { MetadataRoute } from "next";

// Полностью закрываем сайт от индексации поисковыми роботами.
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            disallow: "/",
        },
    };
}
