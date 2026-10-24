import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TaskRepository } from "./tasks/task-repository.js";
import { TaskService } from "./tasks/task-service.js";
import { handleTaskApiRequest } from "./tasks/task-api-handler.js";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8"
};

export function createApplicationServer({
  dbPath = "data/tasks.db",
  staticDir = path.resolve("site")
} = {}) {
  const repository = new TaskRepository(dbPath);
  const taskService = new TaskService(repository);

  const server = http.createServer(async (req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pathname = urlObj.pathname;

    // Route API requests
    if (pathname.startsWith("/api/")) {
      await handleTaskApiRequest(req, res, taskService);
      return;
    }

    // Serve static files from site/
    let reqPath = pathname;
    if (reqPath === "/" || reqPath === "") {
      reqPath = "/index.html";
    }

    // Security check: prevent path traversal outside staticDir
    const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, "");
    const filePath = path.join(staticDir, safePath);

    if (!filePath.startsWith(staticDir) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  return {
    server,
    repository,
    taskService
  };
}

// Standalone runner
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) {
  const PORT = process.env.PORT || 3000;
  const { server } = createApplicationServer();
  server.listen(PORT, () => {
    console.log(`[ForgeX Server] Application running at http://localhost:${PORT}`);
    console.log(`- Frontend: http://localhost:${PORT}/index.html`);
    console.log(`- Task Manager: http://localhost:${PORT}/tasks.html`);
    console.log(`- Task API: http://localhost:${PORT}/api/tasks`);
  });
}
