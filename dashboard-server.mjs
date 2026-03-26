import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const PORT = 3333;

const API_USAGE = 'https://humanoid-atlas-api.vercel.app/v1/admin/usage?admin_key=atlas_admin_9xK4mQ7vR2wP';

const server = createServer(async (req, res) => {
  // Proxy endpoint — fetch API usage server-side to avoid CORS
  if (req.url === '/api/usage') {
    try {
      const r = await fetch(API_USAGE);
      const body = await r.text();
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(body);
    } catch (e) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // Serve dashboard.html
  if (req.url === '/' || req.url === '/dashboard.html') {
    const html = await readFile(join(__dir, 'dashboard.html'), 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => console.log(`Dashboard → http://localhost:${PORT}`));
