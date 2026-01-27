import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().optional(),
  }),
});

const messages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/messages" }),
  schema: z.object({
    text: z.string(),
    timestamp: z.coerce.date(),
    sender: z.enum(["user", "other"]),
  }),
});

export const collections = { blog, messages };
