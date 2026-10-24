/**
 * ForgeX Full-Stack Engineer — Landing Page Interaction Engine
 * Features:
 * - Theme Switcher (System Preference + LocalStorage)
 * - Interactive Contract Tracer Step Engine
 * - Interactive Installation Studio Tab Switcher
 * - Copy-to-Clipboard with visual & ARIA feedback
 * - Mobile Navigation Drawer with focus trap & Esc handler
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initContractTracer();
  initInstallStudio();
  initCopyButtons();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Light / Dark)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('forgex-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Determine initial theme
  let currentTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('forgex-theme', newTheme);
    });
  }

  // Listen for system theme changes if user hasn't explicitly set preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('forgex-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const drawer = document.getElementById('mobile-drawer');

  if (!toggleBtn || !drawer) return;

  function toggleDrawer(open) {
    const isOpen = open !== undefined ? open : !drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen) {
      const firstLink = drawer.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  }

  toggleBtn.addEventListener('click', () => toggleDrawer());

  // Close drawer when clicking any link inside it
  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      toggleDrawer(false);
      toggleBtn.focus();
    }
  });
}

/* --------------------------------------------------------------------------
   3. Interactive Full-Stack Contract Tracer
   -------------------------------------------------------------------------- */
const TRACER_DATA = [
  {
    step: '01',
    label: 'UI Event',
    badge: 'LAYER 1 · CLIENT DISPATCH',
    title: 'User Action & Client State Dispatch',
    desc: 'The user triggers an action (e.g. submitting a form or invoking an agent command). ForgeX ensures client state, loading indicators, and input payloads match the required API schema.',
    fileName: 'client-state.ts',
    code: `// UI Event: Dispatch with typed validation payload
async function submitHandoffCheck(payload: HandoffRequest) {
  setUIState({ status: 'loading', error: null });
  
  // Guard client-side invariants before dispatch
  if (!payload.sessionId || !payload.targetModule) {
    throw new ValidationError('Missing required handoff identifiers');
  }

  return apiClient.post('/api/handoff/checkpoint', payload);
}`
  },
  {
    step: '02',
    label: 'API & Auth',
    badge: 'LAYER 2 · ROUTE & PERMISSION',
    title: 'Route Definition & Server Authentication',
    desc: 'The incoming HTTP request is caught by the routing layer. Server-side middleware verifies authentication, authorization tokens, and request rate-limiting before processing.',
    fileName: 'routes/api.php',
    code: `// Route definition with strict auth & rate-limiting gates
Route::middleware(['auth:sanctum', 'throttle:60,1'])
    ->prefix('v1/handoff')
    ->group(function () {
        Route::post('/checkpoint', [HandoffController::class, 'store'])
            ->can('create', HandoffCheckpoint::class);
    });`
  },
  {
    step: '03',
    label: 'Validation',
    badge: 'LAYER 3 · DOMAIN INVARIANTS',
    title: 'Server-Side Schema Validation',
    desc: 'Never trust frontend input alone. ForgeX requires rigorous server-side validation against domain invariants, ensuring malformed payloads fail closed with clean RFC-7807 error responses.',
    fileName: 'HandoffRequestValidator.php',
    code: `public function rules(): array
{
    return [
        'session_id'    => ['required', 'string', 'uuid'],
        'module'        => ['required', 'string', 'max:120'],
        'git_status'    => ['required', 'array'],
        'git_status.dirty' => ['required', 'boolean'],
        'diff_summary'  => ['nullable', 'string', 'max:5000'],
        'next_actions'  => ['required', 'array', 'min:1'],
    ];
}`
  },
  {
    step: '04',
    label: 'Persistence',
    badge: 'LAYER 4 · TRANSACTION & DB',
    title: 'Atomic Database Persistence',
    desc: 'The service executes within an explicit database transaction. State is persisted, audit logs are created, and rollback guarantees prevent partial failure corruption.',
    fileName: 'HandoffPersistenceService.ts',
    code: `// Atomic database transaction with rollback guarantees
await db.transaction(async (trx) => {
  const checkpoint = await trx('handoff_checkpoints').insert({
    session_id: payload.sessionId,
    module: payload.module,
    status: 'persisted',
    updated_at: new Date()
  }).returning('*');

  await trx('audit_logs').insert({
    action: 'CHECKPOINT_RECORDED',
    entity_id: checkpoint[0].id
  });
});`
  },
  {
    step: '05',
    label: 'UI Reaction',
    badge: 'LAYER 5 · RESPONSE & REACTION',
    title: 'Typed Response Contract & UI Render',
    desc: 'The response payload returns with explicit status codes. The client transitions seamlessly out of loading into verified success or structured error recovery.',
    fileName: 'UIResponseHandler.tsx',
    code: `// Client receives contract-compliant response
const { data, error } = await response;

if (error) {
  // Graceful RFC-7807 problem recovery
  renderErrorBanner(error.detail, { retry: () => submitHandoffCheck(payload) });
  return;
}

// Immediate state reconciliation & visual confirmation
setUIState({ status: 'verified', checkpointId: data.id });
notifyHandoffSuccess('Checkpoint recorded in WORK-STATE.md');`
  }
];

function initContractTracer() {
  const navContainer = document.getElementById('tracer-nav');
  const badgeEl = document.getElementById('tracer-badge');
  const titleEl = document.getElementById('tracer-title');
  const descEl = document.getElementById('tracer-desc');
  const fileNameEl = document.getElementById('tracer-file-name');
  const codePreEl = document.getElementById('tracer-code');

  if (!navContainer || !badgeEl || !titleEl || !descEl || !codePreEl) return;

  function renderStep(index) {
    const data = TRACER_DATA[index];
    if (!data) return;

    // Update active tab buttons
    const buttons = navContainer.querySelectorAll('.tracer-tab');
    buttons.forEach((btn, i) => {
      const isActive = i === index;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update content with subtle smooth fade
    badgeEl.textContent = data.badge;
    titleEl.textContent = data.title;
    descEl.textContent = data.desc;
    if (fileNameEl) fileNameEl.textContent = data.fileName;
    codePreEl.textContent = data.code;
  }

  // Bind click handlers to existing tracer tabs
  const tabs = navContainer.querySelectorAll('.tracer-tab');
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => renderStep(index));
  });

  // Initial render
  renderStep(0);
}

/* --------------------------------------------------------------------------
   4. Installation Studio Tab Switcher
   -------------------------------------------------------------------------- */
function initInstallStudio() {
  const tabButtons = document.querySelectorAll('.install-tab-btn');
  const panes = document.querySelectorAll('.install-pane');

  if (!tabButtons.length || !panes.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      tabButtons.forEach((b) => {
        const isSelected = b === btn;
        b.classList.toggle('active', isSelected);
        b.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      });

      panes.forEach((pane) => {
        const isTarget = pane.id === targetId;
        pane.classList.toggle('active', isTarget);
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Copy to Clipboard Utility
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy') ||
                         btn.closest('.quick-install-box, .terminal-block-body')?.querySelector('code')?.textContent?.trim();

      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        handleCopySuccess(btn);
      } catch (err) {
        // Fallback for older browsers or restricted permissions
        fallbackCopy(textToCopy);
        handleCopySuccess(btn);
      }
    });
  });
}

function handleCopySuccess(btn) {
  const originalTitle = btn.getAttribute('title') || 'Copy command';
  btn.classList.add('copied');
  btn.setAttribute('title', 'Copied to clipboard!');
  btn.setAttribute('aria-label', 'Copied to clipboard!');

  // Show visual SVG tick if available
  const originalHTML = btn.innerHTML;
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `;

  setTimeout(() => {
    btn.classList.remove('copied');
    btn.setAttribute('title', originalTitle);
    btn.setAttribute('aria-label', originalTitle);
    btn.innerHTML = originalHTML;
  }, 2200);
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (e) {
    console.error('Copy fallback failed', e);
  }
  document.body.removeChild(textArea);
}
