import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; // Missing piece for Astro

const homepageCollection = defineCollection({
  // This explicitly grabs your homepage.md file using the modern loader API
  loader: glob({ pattern: 'homepage.md', base: './src/content/homepage' }),
  schema: z.object({
    heroTitle: z.string(),
    heroTagline: z.string(),
    contactEmail: z.string(),
  }),
});

export const collections = {
  'homepage': homepageCollection,
};