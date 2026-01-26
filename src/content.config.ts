import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { REVIEW_MEDIA } from "./lib/reviews";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().optional(),
  }),
});

const reviews = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/reviews" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    medium: z.enum(REVIEW_MEDIA),
  }),
});

const photography = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/photography" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    image: z.string(),
    alt: z.string().optional(),
    caption: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { blog, reviews, photography, pages };
