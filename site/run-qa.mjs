import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const PORT = 9182;
const SITE_ROOT = path.resolve('site');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  const safePath = path.normalize(decodeURI(req.url.split('?')[0])).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(SITE_ROOT, safePath === '/' ? 'index.html' : safePath);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 Not Found');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

await new Promise((resolve) => server.listen(PORT, resolve));
console.log(`[QA Server] Running on http://localhost:${PORT}`);

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome",
].filter(Boolean);
const CHROME_PATH = chromeCandidates.find((candidate) => fs.existsSync(candidate));
if (!CHROME_PATH) {
  throw new Error("Chrome/Chromium not found. Set CHROME_PATH to the browser executable.");
}
const DEBUG_PORT = 9225;
const tempUserData = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-qa-'));

const chromeProc = spawn(CHROME_PATH, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-extensions',
  `--user-data-dir=${tempUserData}`,
  `--remote-debugging-port=${DEBUG_PORT}`,
  '--remote-allow-origins=*',
  `http://localhost:${PORT}/index.html`
], { stdio: 'ignore' });

async function waitForChrome(port, retries = 25) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (res.ok) {
        const list = await res.json();
        const pageTab = list.find((t) => t.type === 'page');
        if (pageTab) return pageTab;
      }
    } catch (e) {
      // wait
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('Chrome remote debugging target did not become ready');
}

try {
  const pageTab = await waitForChrome(DEBUG_PORT);
  console.log('[Chrome] Target found:', pageTab.title, pageTab.url);

  const wsUrl = pageTab.webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);

  let messageId = 1;
  const pending = new Map();

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  });

  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', reject);
  });

  console.log('[CDP] WebSocket connected successfully');

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = messageId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');
  await sendCommand('DOM.enable');

  // Wait for initial render
  await new Promise((r) => setTimeout(r, 1000));

  const screenshotDir = path.resolve('site', 'qa-artifacts');
  fs.mkdirSync(screenshotDir, { recursive: true });

  const viewports = [
    { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
    { name: 'tablet', width: 768, height: 1024, deviceScaleFactor: 2, mobile: false },
    { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
  ];

  const results = [];

  for (const vp of viewports) {
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.deviceScaleFactor,
      mobile: vp.mobile
    });
    await new Promise((r) => setTimeout(r, 400));

    // Dark Mode
    await sendCommand('Runtime.evaluate', {
      expression: `document.documentElement.setAttribute('data-theme', 'dark');`
    });
    await new Promise((r) => setTimeout(r, 200));

    const darkMetrics = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const docW = document.documentElement.clientWidth;
        const overflowing = [];
        for (const el of document.querySelectorAll('*')) {
          const rect = el.getBoundingClientRect();
          if (rect.right > docW + 1.5 || el.scrollWidth > docW + 1.5) {
            overflowing.push({
              tag: el.tagName,
              cls: typeof el.className === 'string' ? el.className : '',
              id: el.id,
              rectRight: Math.round(rect.right),
              rectWidth: Math.round(rect.width),
              scrollWidth: el.scrollWidth
            });
          }
        }
        overflowing.sort((a, b) => (b.scrollWidth || b.rectRight) - (a.scrollWidth || a.rectRight));
        return JSON.stringify({
          innerWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
          activeTheme: document.documentElement.getAttribute('data-theme'),
          bodyFont: window.getComputedStyle(document.body).fontFamily,
          topOverflowing: overflowing.slice(0, 10)
        });
      })()`,
      returnByValue: true
    });

    const darkParsed = JSON.parse(darkMetrics.result.value);

    // Capture screenshot dark
    const ssDark = await sendCommand('Page.captureScreenshot', { format: 'png' });
    const darkPath = path.join(screenshotDir, `${vp.name}-dark.png`);
    fs.writeFileSync(darkPath, Buffer.from(ssDark.data, 'base64'));

    // Light Mode
    await sendCommand('Runtime.evaluate', {
      expression: `document.documentElement.setAttribute('data-theme', 'light');`
    });
    await new Promise((r) => setTimeout(r, 200));

    const lightMetrics = await sendCommand('Runtime.evaluate', {
      expression: `JSON.stringify({
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        activeTheme: document.documentElement.getAttribute('data-theme')
      })`,
      returnByValue: true
    });

    const lightParsed = JSON.parse(lightMetrics.result.value);

    // Capture screenshot light
    const ssLight = await sendCommand('Page.captureScreenshot', { format: 'png' });
    const lightPath = path.join(screenshotDir, `${vp.name}-light.png`);
    fs.writeFileSync(lightPath, Buffer.from(ssLight.data, 'base64'));

    results.push({
      viewport: vp.name,
      width: vp.width,
      height: vp.height,
      dark: darkParsed,
      light: lightParsed,
      screenshots: {
        dark: darkPath,
        light: lightPath
      }
    });
  }

  // Test interactive widgets
  // 1. Tracer Tab Click (step 2)
  await sendCommand('Runtime.evaluate', {
    expression: `
      const tab2 = document.querySelectorAll('.tracer-tab')[1];
      if (tab2) tab2.click();
    `
  });
  await new Promise((r) => setTimeout(r, 250));
  const tracerTest = await sendCommand('Runtime.evaluate', {
    expression: `JSON.stringify({
      activeBadge: document.getElementById('tracer-badge')?.textContent,
      activeTitle: document.getElementById('tracer-title')?.textContent,
      fileName: document.getElementById('tracer-file-name')?.textContent
    })`,
    returnByValue: true
  });
  const tracerResult = JSON.parse(tracerTest.result.value);

  // 2. Install Studio Tab Click (Codex)
  await sendCommand('Runtime.evaluate', {
    expression: `
      const btnCodex = document.querySelector('[data-target="tab-codex"]');
      if (btnCodex) btnCodex.click();
    `
  });
  await new Promise((r) => setTimeout(r, 250));
  const installTest = await sendCommand('Runtime.evaluate', {
    expression: `JSON.stringify({
      codexPaneActive: document.getElementById('tab-codex')?.classList.contains('active'),
      commandText: document.querySelector('#tab-codex .terminal-command')?.textContent
    })`,
    returnByValue: true
  });
  const installResult = JSON.parse(installTest.result.value);

  // 3. Theme Toggle Click
  await sendCommand('Runtime.evaluate', {
    expression: `
      const themeToggle = document.getElementById('theme-toggle');
      if (themeToggle) themeToggle.click();
    `
  });
  await new Promise((r) => setTimeout(r, 200));
  const themeToggleTest = await sendCommand('Runtime.evaluate', {
    expression: `document.documentElement.getAttribute('data-theme')`,
    returnByValue: true
  });
  const toggledTheme = themeToggleTest.result.value;

  console.log('\n=== REAL BROWSER QA TEST REPORT ===');
  console.log(JSON.stringify({
    viewports: results,
    interactions: {
      contractTracer: tracerResult,
      installStudio: installResult,
      themeToggleSwitchedTo: toggledTheme
    }
  }, null, 2));

  ws.close();
} finally {
  chromeProc.kill();
  server.close();
  try {
    fs.rmSync(tempUserData, { recursive: true, force: true });
  } catch (e) {}
}
