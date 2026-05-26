import dotenv from "dotenv"
import { z } from "zod"
import path from "path"

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") })
dotenv.config()

const envSchema = z.object({
    PORT: z.coerce.number().default(5001),
    MONGO_URI: z.string().min(1, "MONGO_URI is required"),
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
    JWT_EXPIRES_IN: z.string().default("7d"),
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.format())
    process.exit(1)
}

export const env = parsed.data
