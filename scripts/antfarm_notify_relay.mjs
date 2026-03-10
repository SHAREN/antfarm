#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const PORT = Number(process.env.ANTFARM_NOTIFY_PORT || 4317);
const TELEGRAM_TARGET = process.env.ANTFARM_NOTIFY_TARGET || '435497642';
const TELEGRAM_CHANNEL = process.env.ANTFARM_NOTIFY_CHANNEL || 'telegram';

function readGatewayConfig() {
  const p = path.join(os.homedir(), '.openclaw', 'openclaw.json');
  const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
  const port = cfg.gateway?.port || 18789;
  const auth = cfg.gateway?.auth || {};
  const secret = auth.mode === 'password' ? auth.password : auth.token;
  return { url: `http://127.0.0.1:${port}`, secret };
}

async function sendTelegram(text) {
  const gateway = readGatewayConfig();
  const headers = { 'Content-Type': 'application/json' };
  if (gateway.secret) headers['Authorization'] = `Bearer ${gateway.secret}`;
  const res = await fetch(`${gateway.url}/tools/invoke`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      tool: 'message',
      args: {
        action: 'send',
        channel: TELEGRAM_CHANNEL,
        target: TELEGRAM_TARGET,
        message: text,
      },
      sessionKey: 'agent:main:main',
    }),
  });
  if (!res.ok) throw new Error(`gateway returned ${res.status}: ${await res.text()}`);
  return await res.text();
}

function formatMessage(evt) {
  const runShort = String(evt.runId || '').slice(0, 8);
  const wf = evt.workflowId || 'unknown-workflow';
  const detail = evt.detail ? `\nДетали: ${evt.detail}` : '';
  if (evt.event === 'run.completed') return `Antfarm: run ${runShort} (${wf}) завершился ✅${detail}`;
  if (evt.event === 'run.failed') return `Antfarm: run ${runShort} (${wf}) упал ❌${detail}`;
  return `Antfarm event: ${evt.event} for ${runShort} (${wf})${detail}`;
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('method not allowed');
    return;
  }
  let raw = '';
  req.on('data', (chunk) => { raw += chunk; });
  req.on('end', async () => {
    try {
      const evt = JSON.parse(raw || '{}');
      if (evt.event !== 'run.completed' && evt.event !== 'run.failed') {
        res.writeHead(204).end();
        return;
      }
      await sendTelegram(formatMessage(evt));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: err instanceof Error ? err.message : String(err) }));
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Antfarm notify relay listening on http://127.0.0.1:${PORT}`);
});
