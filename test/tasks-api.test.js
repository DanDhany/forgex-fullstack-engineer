import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { TaskRepository } from "../src/tasks/task-repository.js";
import { TaskService } from "../src/tasks/task-service.js";
import { handleTaskApiRequest } from "../src/tasks/task-api-handler.js";

// Helper to make HTTP requests against a local test server
function makeRequest(server, options, body = null) {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const reqOptions = {
      hostname: "127.0.0.1",
      port,
      path: options.path,
      method: options.method || "GET",
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: parsed
        });
      });
    });

    req.on("error", reject);

    if (body) {
      req.write(typeof body === "string" ? body : JSON.stringify(body));
    }
    req.end();
  });
}

test("TaskRepository: creates table and inserts tasks into SQLite", () => {
  const repo = new TaskRepository(":memory:");
  const task = repo.createTask({
    title: "Implement contract tests",
    description: "Verify cross-stack API shape",
    priority: "high"
  });

  assert.ok(task.id > 0, "Task ID should be assigned");
  assert.equal(task.title, "Implement contract tests");
  assert.equal(task.description, "Verify cross-stack API shape");
  assert.equal(task.priority, "high");
  assert.equal(task.status, "todo");
  assert.ok(task.created_at, "created_at timestamp should exist");

  const fetched = repo.getTaskById(task.id);
  assert.equal(fetched.id, task.id);
  assert.equal(fetched.title, task.title);

  const all = repo.listTasks();
  assert.equal(all.length, 1);
  repo.close();
});

test("TaskService: validates inputs independently from frontend", () => {
  const repo = new TaskRepository(":memory:");
  const service = new TaskService(repo);

  // 1. Missing title
  const missingTitle = service.createTask({ description: "No title", priority: "low" });
  assert.equal(missingTitle.success, false);
  assert.match(missingTitle.errors.title, /required/i);

  // 2. Whitespace-only title
  const whitespaceTitle = service.createTask({ title: "   ", priority: "low" });
  assert.equal(whitespaceTitle.success, false);
  assert.match(whitespaceTitle.errors.title, /cannot be empty/i);

  // 3. Title exceeding 120 chars
  const longTitle = service.createTask({ title: "A".repeat(121), priority: "medium" });
  assert.equal(longTitle.success, false);
  assert.match(longTitle.errors.title, /120/);

  // 4. Invalid priority
  const invalidPriority = service.createTask({ title: "Valid title", priority: "urgent-now" });
  assert.equal(invalidPriority.success, false);
  assert.match(invalidPriority.errors.priority, /low, medium, high, urgent/);

  // 5. Description exceeding 1000 chars
  const longDesc = service.createTask({ title: "Valid title", description: "B".repeat(1001), priority: "low" });
  assert.equal(longDesc.success, false);
  assert.match(longDesc.errors.description, /1000/);

  // 6. Valid task creation
  const valid = service.createTask({
    title: "Valid Title",
    description: "Valid Description",
    priority: "urgent"
  });
  assert.equal(valid.success, true);
  assert.equal(valid.data.title, "Valid Title");
  assert.equal(valid.data.priority, "urgent");

  repo.close();
});

test("API Endpoint POST /api/tasks: creates task and returns 201 Created", async () => {
  const repo = new TaskRepository(":memory:");
  const service = new TaskService(repo);
  const server = http.createServer((req, res) => handleTaskApiRequest(req, res, service));
  await new Promise((resolve) => server.listen(0, resolve));

  try {
    const res = await makeRequest(
      server,
      { path: "/api/tasks", method: "POST" },
      {
        title: "Build SQLite Integration",
        description: "Zero external dependencies",
        priority: "high"
      }
    );

    assert.equal(res.statusCode, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.title, "Build SQLite Integration");
    assert.equal(res.body.data.priority, "high");
    assert.equal(res.body.data.status, "todo");
    assert.ok(res.body.data.id > 0);
  } finally {
    server.close();
    repo.close();
  }
});

test("API Endpoint POST /api/tasks: returns 422 for invalid priority", async () => {
  const repo = new TaskRepository(":memory:");
  const service = new TaskService(repo);
  const server = http.createServer((req, res) => handleTaskApiRequest(req, res, service));
  await new Promise((resolve) => server.listen(0, resolve));

  try {
    const res = await makeRequest(
      server,
      { path: "/api/tasks", method: "POST" },
      {
        title: "Test invalid priority",
        priority: "critical"
      }
    );

    assert.equal(res.statusCode, 422);
    assert.equal(res.body.success, false);
    assert.ok(res.body.errors);
    assert.match(res.body.errors.priority, /low, medium, high, urgent/);
  } finally {
    server.close();
    repo.close();
  }
});

test("API Endpoint POST /api/tasks: returns 400 for malformed JSON", async () => {
  const repo = new TaskRepository(":memory:");
  const service = new TaskService(repo);
  const server = http.createServer((req, res) => handleTaskApiRequest(req, res, service));
  await new Promise((resolve) => server.listen(0, resolve));

  try {
    const res = await makeRequest(
      server,
      { path: "/api/tasks", method: "POST" },
      "INVALID_JSON_STRING{{"
    );

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.success, false);
    assert.match(res.body.error, /invalid json/i);
  } finally {
    server.close();
    repo.close();
  }
});

test("API Endpoint GET /api/tasks: returns list of tasks", async () => {
  const repo = new TaskRepository(":memory:");
  const service = new TaskService(repo);
  service.createTask({ title: "Task 1", priority: "low" });
  service.createTask({ title: "Task 2", priority: "urgent" });

  const server = http.createServer((req, res) => handleTaskApiRequest(req, res, service));
  await new Promise((resolve) => server.listen(0, resolve));

  try {
    const res = await makeRequest(server, { path: "/api/tasks", method: "GET" });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.length, 2);
  } finally {
    server.close();
    repo.close();
  }
});

test("API Endpoint: returns 405 for unsupported method", async () => {
  const repo = new TaskRepository(":memory:");
  const service = new TaskService(repo);
  const server = http.createServer((req, res) => handleTaskApiRequest(req, res, service));
  await new Promise((resolve) => server.listen(0, resolve));

  try {
    const res = await makeRequest(server, { path: "/api/tasks", method: "DELETE" });
    assert.equal(res.statusCode, 405);
    assert.equal(res.body.success, false);
  } finally {
    server.close();
    repo.close();
  }
});
