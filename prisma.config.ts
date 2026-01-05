import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        url: (process.env.DATABASE_URL || "").replace("localhost", "127.0.0.1"),
    },
});
