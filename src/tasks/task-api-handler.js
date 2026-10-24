function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req, maxBytes = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let raw = "";
    let receivedBytes = 0;

    req.on("data", (chunk) => {
      receivedBytes += chunk.length;
      if (receivedBytes > maxBytes) {
        reject(new Error("Payload too large. Maximum allowed size is 1MB."));
        req.destroy();
        return;
      }
      raw += chunk;
    });

    req.on("end", () => {
      if (!raw || raw.trim().length === 0) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        resolve(parsed);
      } catch (err) {
        reject(new Error("Invalid JSON payload."));
      }
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}

export async function handleTaskApiRequest(req, res, taskService) {
  const urlObj = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = urlObj.pathname;

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  if (pathname === "/api/tasks" || pathname === "/api/tasks/") {
    if (req.method === "GET") {
      const result = taskService.listTasks();
      if (!result.success) {
        sendJson(res, 500, { success: false, error: result.error });
        return;
      }
      sendJson(res, 200, { success: true, data: result.data });
      return;
    }

    if (req.method === "POST") {
      let body;
      try {
        body = await parseJsonBody(req);
      } catch (err) {
        sendJson(res, 400, { success: false, error: err.message });
        return;
      }

      const result = taskService.createTask(body);
      if (!result.success) {
        sendJson(res, 422, {
          success: false,
          error: "Validation failed.",
          errors: result.errors
        });
        return;
      }

      sendJson(res, 201, { success: true, data: result.data });
      return;
    }

    sendJson(res, 405, {
      success: false,
      error: "Method not allowed. Supported methods: GET, POST"
    });
    return;
  }

  // Not an /api/tasks endpoint
  sendJson(res, 404, { success: false, error: "API endpoint not found." });
}
