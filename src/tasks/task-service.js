export const SUPPORTED_PRIORITIES = Object.freeze(["low", "medium", "high", "urgent"]);
export const MAX_TITLE_LENGTH = 120;
export const MAX_DESCRIPTION_LENGTH = 1000;

export class TaskService {
  constructor(repository) {
    this.repository = repository;
  }

  validateTaskInput(input) {
    const errors = {};

    if (!input || typeof input !== "object") {
      return {
        valid: false,
        errors: { _general: "Invalid input payload: expected an object." }
      };
    }

    // Title validation
    if (input.title === undefined || input.title === null) {
      errors.title = "Title is required.";
    } else if (typeof input.title !== "string") {
      errors.title = "Title must be a text string.";
    } else {
      const trimmedTitle = input.title.trim();
      if (trimmedTitle.length === 0) {
        errors.title = "Title cannot be empty.";
      } else if (trimmedTitle.length > MAX_TITLE_LENGTH) {
        errors.title = `Title cannot exceed ${MAX_TITLE_LENGTH} characters (received ${trimmedTitle.length}).`;
      }
    }

    // Priority validation
    if (!input.priority) {
      errors.priority = `Priority is required. Must be one of: ${SUPPORTED_PRIORITIES.join(", ")}.`;
    } else if (typeof input.priority !== "string") {
      errors.priority = `Priority must be a string. Must be one of: ${SUPPORTED_PRIORITIES.join(", ")}.`;
    } else {
      const normalizedPriority = input.priority.trim().toLowerCase();
      if (!SUPPORTED_PRIORITIES.includes(normalizedPriority)) {
        errors.priority = `Invalid priority. Must be one of: ${SUPPORTED_PRIORITIES.join(", ")}.`;
      }
    }

    // Description validation (optional)
    if (input.description !== undefined && input.description !== null) {
      if (typeof input.description !== "string") {
        errors.description = "Description must be a text string.";
      } else if (input.description.trim().length > MAX_DESCRIPTION_LENGTH) {
        errors.description = `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`;
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  createTask(input) {
    const validation = this.validateTaskInput(input);
    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    const cleanTask = {
      title: input.title.trim(),
      description: input.description ? input.description.trim() : "",
      priority: input.priority.trim().toLowerCase()
    };

    try {
      const task = this.repository.createTask(cleanTask);
      return {
        success: true,
        data: task
      };
    } catch (err) {
      return {
        success: false,
        errors: { _database: `Database transaction error: ${err.message}` }
      };
    }
  }

  listTasks() {
    try {
      const tasks = this.repository.listTasks();
      return {
        success: true,
        data: tasks
      };
    } catch (err) {
      return {
        success: false,
        error: `Failed to retrieve tasks: ${err.message}`
      };
    }
  }

  getTaskById(id) {
    try {
      const task = this.repository.getTaskById(Number(id));
      if (!task) {
        return {
          success: false,
          error: "Task not found."
        };
      }
      return {
        success: true,
        data: task
      };
    } catch (err) {
      return {
        success: false,
        error: `Database query error: ${err.message}`
      };
    }
  }
}
