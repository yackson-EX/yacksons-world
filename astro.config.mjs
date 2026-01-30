// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// Netlify server output so /api/send-drawing runs as a function
export default defineConfig({
  output: 'server',
  adapter: netlify(),
});
