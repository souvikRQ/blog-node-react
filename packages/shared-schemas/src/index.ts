import { z } from "zod"

// Helper regexes
export const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/
export const SLUG_REGEX = /^[a-z0-9-]+$/

// ==========================================
// 1. User Validation Rules
// ==========================================
export const nameSchema = z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")

export const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address format")

export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters")

export const roleSchema = z.enum(["author", "admin", "guest"])

export const avatarUrlSchema = z
    .string()
    .trim()
    .url("Invalid URL format")
    .optional()
    .or(z.literal(""))

// ==========================================
// 2. Blog Validation Rules
// ==========================================
export const blogTitleSchema = z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title cannot exceed 150 characters")

export const blogSlugSchema = z
    .string()
    .trim()
    .toLowerCase()
    .regex(
        SLUG_REGEX,
        "Slug must contain only lowercase letters, numbers, and hyphens",
    )

export const blogExcerptSchema = z
    .string()
    .trim()
    .min(10, "Excerpt must be at least 10 characters")
    .max(300, "Excerpt cannot exceed 300 characters")

export const blogContentSchema = z
    .string()
    .trim()
    .min(10, "Content must be at least 10 characters")

export const blogCoverImageSchema = z
    .string()
    .trim()
    .url("Invalid cover image URL format")
    .optional()
    .or(z.literal(""))

export const blogTagsSchema = z
    .array(
        z
            .string()
            .trim()
            .min(1, "Tag cannot be empty")
            .max(20, "Tag name cannot exceed 20 characters"),
    )
    .max(10, "A blog can have at most 10 tags")

export const blogStatusSchema = z.enum(["draft", "published"])

export const objectIdSchema = z
    .string()
    .regex(OBJECT_ID_REGEX, "Invalid database identifier format")

// ==========================================
// 3. Comment Validation Rules
// ==========================================
export const commentContentSchema = z
    .string()
    .trim()
    .min(3, "Comment content must be at least 3 characters")
    .max(1000, "Comment content cannot exceed 1000 characters")

export const commentStatusSchema = z.enum(["approved", "pending", "hidden"])

// ==========================================
// 4. Route Params validation
// ==========================================
export const idParamSchema = z.object({
    id: objectIdSchema,
})

export const blogIdParamSchema = z.object({
    blogId: objectIdSchema,
})

export const slugParamSchema = z.object({
    slug: blogSlugSchema,
})

// ==========================================
// 5. Query Params validation
// ==========================================
export const blogQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().optional(),
    tag: z.string().trim().optional(),
    status: blogStatusSchema.optional(),
    sort: z.enum(["newest", "oldest", "popular"]).default("newest"),
})

// ==========================================
// 6. Auth Payloads schemas
// ==========================================
export const registerSchema = z
    .object({
        name: nameSchema,
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"],
    })

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
})

// ==========================================
// 7. Blog Payloads schemas
// ==========================================
export const createBlogSchema = z.object({
    title: blogTitleSchema,
    excerpt: blogExcerptSchema.optional().or(z.literal("")),
    content: blogContentSchema.optional().or(z.literal("")),
    coverImage: blogCoverImageSchema,
    tags: blogTagsSchema.default([]),
    status: blogStatusSchema.default("draft"),
})

export const updateBlogSchema = z.object({
    title: blogTitleSchema.optional(),
    excerpt: blogExcerptSchema.optional().or(z.literal("")),
    content: blogContentSchema.optional().or(z.literal("")),
    coverImage: blogCoverImageSchema,
    tags: blogTagsSchema.optional(),
    status: blogStatusSchema.optional(),
})

// Used specifically when publishing a blog (runs strict validation)
export const publishBlogSchema = z.object({
    title: blogTitleSchema,
    excerpt: blogExcerptSchema,
    content: blogContentSchema,
    coverImage: blogCoverImageSchema,
    tags: blogTagsSchema,
    status: z.literal("published"),
})

// ==========================================
// 8. Comment Payloads schemas
// ==========================================
export const createCommentSchema = z
    .object({
        content: commentContentSchema,
        guestName: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name cannot exceed 50 characters")
            .optional()
            .or(z.literal("")),
        guestEmail: z
            .string()
            .trim()
            .toLowerCase()
            .email("Invalid email address format")
            .optional()
            .or(z.literal("")),
    })
    .refine(
        (data) => {
            // Either both or neither are provided. The actual service logic checks for authentication.
            // If they are empty strings, treat them as not provided.
            const name = data.guestName?.trim() || "";
            const email = data.guestEmail?.trim() || "";
            if (name || email) {
                return !!name && !!email;
            }
            return true
        },
        {
            message:
                "Both guest name and email are required for public comments",
            path: ["guestName"],
        },
    )

export const updateCommentStatusSchema = z.object({
    status: commentStatusSchema,
})
