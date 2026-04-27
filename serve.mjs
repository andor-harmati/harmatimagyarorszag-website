import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

// Load environment variables
const loadEnv = () => {
  const envFile = path.join(__dirname, '.env');
  if (!fs.existsSync(envFile)) return {};
  const content = fs.readFileSync(envFile, 'utf-8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim();
  });
  return env;
};

const ENV = loadEnv();

// Email sending function using SMTP or webhooks
const sendEmail = async (to, subject, html, text) => {
  // Try using curl + sendmail command (Linux/Mac)
  if (process.platform !== 'win32' && ENV.SMTP_HOST === 'sendmail') {
    try {
      const { execSync } = await import('child_process');
      const mailContent = `To: ${to}\nSubject: ${subject}\nContent-Type: text/html; charset=utf-8\n\n${html}`;
      execSync('sendmail', { input: mailContent });
      return true;
    } catch (err) {
      console.error('Sendmail failed:', err.message);
    }
  }

  // Try Formspree webhook (free service, requires form setup)
  // Alternative: use Basin.cool or similar webhook services
  try {
    const formspreeUrl = ENV.FORMSPREE_ENDPOINT;
    if (formspreeUrl) {
      const response = await fetch(formspreeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _replyto: to, email: to, message: html }),
      });
      return response.ok;
    }
  } catch (err) {
    console.error('Webhook email failed:', err.message);
  }

  return false;
};

const handleContactForm = (req, res, body) => {
  try {
    const data = JSON.parse(body);
    const timestamp = new Date().toISOString();
    const submission = { timestamp, ...data };

    // Store submission locally
    const submissionsFile = path.join(__dirname, 'submissions.json');
    let submissions = [];
    if (fs.existsSync(submissionsFile)) {
      submissions = JSON.parse(fs.readFileSync(submissionsFile, 'utf-8'));
    }
    submissions.push(submission);
    fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));

    // Attempt to send email
    const emailText = `
Név: ${data.name}
Cégnév: ${data.company || '—'}
Email: ${data.email}
Szolgáltatások: ${data.services.length > 0 ? data.services.join(', ') : '—'}

Projekt:
${data.project}
    `.trim();

    sendEmail(
      'andor@harmatimagyarorszag.com',
      `Új kontakt forma: ${data.name}`,
      emailText.replace(/\n/g, '<br>'),
      emailText
    ).catch(() => {});

    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ success: true }));
  } catch (err) {
    console.error('Form error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ error: 'Failed to process form' }));
  }
};

http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  // Handle POST for contact form
  if (req.method === 'POST' && req.url === '/api/contact') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => handleContactForm(req, res, body));
    return;
  }

  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  let filePath = path.join(__dirname, urlPath === "/" ? "/index.html" : urlPath);
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403); return res.end("Forbidden");
  }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("Not found");
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  });
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
