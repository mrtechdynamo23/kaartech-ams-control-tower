import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-pdf-endpoint',
      configureServer(server) {
        server.middlewares.use('/api/save-pdf', (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const { filename, base64 } = JSON.parse(body);
                fs.writeFileSync(path.resolve(filename), Buffer.from(base64, 'base64'));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true, filename }));
              } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
              }
            });
          } else {
            res.writeHead(404);
            res.end();
          }
        });
      },
    },
  ],
})
