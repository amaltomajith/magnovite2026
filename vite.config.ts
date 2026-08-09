import { resolve } from 'path';
import { defineConfig } from 'vite';
import fs from 'fs';

const eventEntries: Record<string, string> = {};
const eventsDir = resolve(__dirname, 'events');

if (fs.existsSync(eventsDir)) {
  fs.readdirSync(eventsDir).forEach((file) => {
    if (file.endsWith('.html')) {
      const key = `event-${file.replace('.html', '')}`;
      eventEntries[key] = resolve(eventsDir, file);
    }
  });
}

export default defineConfig({
  publicDir: 'public',
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        events: resolve(__dirname, 'events.html'),
        about: resolve(__dirname, 'about.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        ...eventEntries
      }
    }
  }
});
