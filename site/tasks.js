/**
 * ForgeX Task Workbench — Client Interaction & Contract Verification Script
 */
(function() {
  "use strict";

  const THEME_STORAGE_KEY = "forgex_theme";
  const SUPPORTED_PRIORITIES = ["low", "medium", "high", "urgent"];
  const MAX_TITLE_LENGTH = 120;
  const MAX_DESC_LENGTH = 1000;

  // State
  let isSubmitting = false;
  let tasks = [];

  // DOM Elements
  const themeToggle = document.getElementById("themeToggle");
  const taskForm = document.getElementById("taskForm");
  const taskTitle = document.getElementById("taskTitle");
  const taskPriority = document.getElementById("taskPriority");
  const taskDescription = document.getElementById("taskDescription");
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");
  const btnSpinner = document.getElementById("btnSpinner");
  const btnText = document.getElementById("btnText");
  const titleCounter = document.getElementById("titleCounter");
  const descriptionCounter = document.getElementById("descriptionCounter");

  // Error containers
  const titleError = document.getElementById("titleError");
  const priorityError = document.getElementById("priorityError");
  const descriptionError = document.getElementById("descriptionError");
  const globalError = document.getElementById("globalError");
  const errorMessage = document.getElementById("errorMessage");

  // Success container
  const successBanner = document.getElementById("successBanner");
  const successMessage = document.getElementById("successMessage");

  // Ledger elements
  const tasksList = document.getElementById("tasksList");
  const emptyLedger = document.getElementById("emptyLedger");
  const ledgerLoading = document.getElementById("ledgerLoading");
  const taskCountBadge = document.getElementById("taskCountBadge");
  const refreshBtn = document.getElementById("refreshBtn");
  const toast = document.getElementById("toast");

  // --- Theme Management ---
  function initTheme() {
    if (!themeToggle) return;
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_STORAGE_KEY, next);
      showToast(`Theme switched to ${next} mode`);
    });
  }

  // --- Toast Notification ---
  function showToast(msg, duration = 3000) {
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = "block";
    toast.classList.add("visible");
    setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => {
        toast.style.display = "none";
      }, 300);
    }, duration);
  }

  // --- Counters ---
  function updateCounters() {
    if (taskTitle && titleCounter) {
      const len = taskTitle.value.length;
      titleCounter.textContent = `${len} / ${MAX_TITLE_LENGTH}`;
      titleCounter.classList.toggle("text-danger", len > MAX_TITLE_LENGTH);
    }
    if (taskDescription && descriptionCounter) {
      const len = taskDescription.value.length;
      descriptionCounter.textContent = `${len} / ${MAX_DESC_LENGTH}`;
      descriptionCounter.classList.toggle("text-danger", len > MAX_DESC_LENGTH);
    }
  }

  // --- Validation Helpers ---
  function clearErrors() {
    [titleError, priorityError, descriptionError].forEach(el => {
      if (el) {
        el.textContent = "";
        el.style.display = "none";
      }
    });

    [taskTitle, taskPriority, taskDescription].forEach(input => {
      if (input) {
        input.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");
      }
    });

    if (globalError) {
      globalError.style.display = "none";
      if (errorMessage) errorMessage.textContent = "";
    }
  }

  function setFieldError(field, errorElement, msg) {
    if (field) {
      field.classList.add("is-invalid");
      field.setAttribute("aria-invalid", "true");
    }
    if (errorElement) {
      errorElement.textContent = msg;
      errorElement.style.display = "block";
    }
  }

  function validateClientForm() {
    clearErrors();
    let isValid = true;
    let firstInvalidField = null;

    // Title validation
    const rawTitle = taskTitle ? taskTitle.value : "";
    const trimmedTitle = rawTitle.trim();
    if (!trimmedTitle) {
      setFieldError(taskTitle, titleError, "Title is required and cannot be empty.");
      isValid = false;
      if (!firstInvalidField) firstInvalidField = taskTitle;
    } else if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      setFieldError(taskTitle, titleError, `Title cannot exceed ${MAX_TITLE_LENGTH} characters.`);
      isValid = false;
      if (!firstInvalidField) firstInvalidField = taskTitle;
    }

    // Priority validation
    const rawPriority = taskPriority ? taskPriority.value.trim().toLowerCase() : "";
    if (!rawPriority) {
      setFieldError(taskPriority, priorityError, "Please select a valid priority level.");
      isValid = false;
      if (!firstInvalidField) firstInvalidField = taskPriority;
    } else if (!SUPPORTED_PRIORITIES.includes(rawPriority)) {
      setFieldError(taskPriority, priorityError, `Priority must be one of: ${SUPPORTED_PRIORITIES.join(", ")}.`);
      isValid = false;
      if (!firstInvalidField) firstInvalidField = taskPriority;
    }

    // Description validation
    const rawDesc = taskDescription ? taskDescription.value : "";
    if (rawDesc.length > MAX_DESC_LENGTH) {
      setFieldError(taskDescription, descriptionError, `Description cannot exceed ${MAX_DESC_LENGTH} characters.`);
      isValid = false;
      if (!firstInvalidField) firstInvalidField = taskDescription;
    }

    if (!isValid && firstInvalidField) {
      firstInvalidField.focus();
    }

    return isValid;
  }

  // --- Submission Loading State ---
  function setLoading(loading) {
    isSubmitting = loading;

    if (submitBtn) {
      submitBtn.disabled = loading;
      submitBtn.setAttribute("aria-busy", loading ? "true" : "false");
    }
    if (resetBtn) {
      resetBtn.disabled = loading;
    }
    if (btnSpinner) {
      btnSpinner.style.display = loading ? "inline-block" : "none";
    }
    if (btnText) {
      btnText.textContent = loading ? "Saving to Database..." : "Save Task to Database";
    }

    [taskTitle, taskPriority, taskDescription].forEach(input => {
      if (input) input.disabled = loading;
    });
  }

  // --- Form Submission Handler ---
  async function handleSubmit(event) {
    if (event) event.preventDefault();

    // Guard against duplicate / rapid in-flight clicks
    if (isSubmitting) {
      console.warn("[ForgeX Task] Submission already in flight. Ignoring duplicate trigger.");
      return;
    }

    // Client-side pre-flight validation
    if (!validateClientForm()) {
      return;
    }

    // Hide any previous success banner
    if (successBanner) {
      successBanner.style.display = "none";
    }

    setLoading(true);

    const payload = {
      title: taskTitle.value.trim(),
      priority: taskPriority.value.trim().toLowerCase(),
      description: taskDescription.value.trim()
    };

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      let resData;
      try {
        resData = await response.json();
      } catch (parseErr) {
        throw new Error(`Invalid response format from server (HTTP ${response.status}).`);
      }

      // Check HTTP status & response data
      if (response.status === 201 && resData.success) {
        // Success feedback
        handleSuccess(resData.data);
      } else if (response.status === 422 && resData.errors) {
        // Server-side validation errors returned
        handleServerValidationErrors(resData.errors);
      } else {
        // Other API errors (400, 500, etc.)
        handleGlobalError(resData.error || `Server responded with HTTP ${response.status}.`);
      }
    } catch (networkErr) {
      console.error("[ForgeX Task] Network or fetch error:", networkErr);
      handleGlobalError(
        networkErr.message.includes("Failed to fetch")
          ? "Cannot connect to server. Please ensure the backend server is running (`node src/server.js`)."
          : networkErr.message
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSuccess(task) {
    clearErrors();

    // Reset form fields
    if (taskForm) taskForm.reset();
    updateCounters();

    // Show success alert
    if (successBanner && successMessage) {
      successMessage.textContent = `Task #${task.id} [${task.priority.toUpperCase()}] "${task.title}" has been verified and stored in SQLite.`;
      successBanner.style.display = "flex";
      successBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    showToast(`Task #${task.id} created!`);

    // Prepend to tasks list
    tasks.unshift(task);
    renderTasks();
  }

  function handleServerValidationErrors(errors) {
    if (errors.title) {
      setFieldError(taskTitle, titleError, errors.title);
    }
    if (errors.priority) {
      setFieldError(taskPriority, priorityError, errors.priority);
    }
    if (errors.description) {
      setFieldError(taskDescription, descriptionError, errors.description);
    }
    if (errors._general || errors._database) {
      handleGlobalError(errors._general || errors._database);
    }
  }

  function handleGlobalError(msg) {
    if (globalError && errorMessage) {
      errorMessage.textContent = msg;
      globalError.style.display = "flex";
      globalError.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    showToast(`Error: ${msg}`);
  }

  // --- Task Ledger Fetch & Render ---
  async function fetchTasks() {
    if (ledgerLoading) ledgerLoading.style.display = "block";
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        tasks = data.data;
        renderTasks();
      }
    } catch (err) {
      console.info("[ForgeX Task] Could not load initial tasks from API:", err.message);
    } finally {
      if (ledgerLoading) ledgerLoading.style.display = "none";
    }
  }

  function renderTasks() {
    if (taskCountBadge) {
      taskCountBadge.textContent = `${tasks.length} task${tasks.length === 1 ? "" : "s"}`;
    }

    if (!tasksList || !emptyLedger) return;

    if (tasks.length === 0) {
      emptyLedger.style.display = "block";
      tasksList.style.display = "none";
      tasksList.innerHTML = "";
      return;
    }

    emptyLedger.style.display = "none";
    tasksList.style.display = "flex";

    tasksList.innerHTML = tasks.map(t => {
      const priorityClass = `badge-priority-${t.priority}`;
      const formattedDate = t.created_at ? new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

      return `
        <article class="task-card" data-id="${t.id}">
          <div class="task-card-header">
            <span class="task-card-id">#${t.id}</span>
            <span class="badge ${priorityClass}">${escapeHtml(t.priority.toUpperCase())}</span>
            <span class="task-card-status">${escapeHtml(t.status || "todo")}</span>
            <time class="task-card-time">${escapeHtml(formattedDate)}</time>
          </div>
          <h3 class="task-card-title">${escapeHtml(t.title)}</h3>
          ${t.description ? `<p class="task-card-desc">${escapeHtml(t.description)}</p>` : ""}
        </article>
      `;
    }).join("");
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // --- Initialize Event Listeners ---
  function init() {
    initTheme();

    if (taskTitle) {
      taskTitle.addEventListener("input", () => {
        updateCounters();
        if (taskTitle.classList.contains("is-invalid")) {
          validateClientForm();
        }
      });
      taskTitle.addEventListener("blur", () => {
        if (taskTitle.value.trim().length > 0) {
          validateClientForm();
        }
      });
    }

    if (taskPriority) {
      taskPriority.addEventListener("change", () => {
        if (taskPriority.classList.contains("is-invalid")) {
          validateClientForm();
        }
      });
    }

    if (taskDescription) {
      taskDescription.addEventListener("input", updateCounters);
    }

    if (taskForm) {
      taskForm.addEventListener("submit", handleSubmit);
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        clearErrors();
        if (taskForm) taskForm.reset();
        updateCounters();
        if (taskTitle) taskTitle.focus();
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        fetchTasks();
        showToast("Task registry synced");
      });
    }

    updateCounters();
    fetchTasks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
