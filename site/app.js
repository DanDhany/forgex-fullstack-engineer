/**
 * ForgeX Full-Stack Engineer v1.1.8 — Client Interactions
 * Zero external dependencies. Fast, accessible, and lightweight.
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark / System)
  // -------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'forgex_theme';
  const htmlRoot = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
    htmlRoot.setAttribute('data-theme', effectiveTheme);
    if (themeMeta) {
      themeMeta.setAttribute('content', effectiveTheme === 'dark' ? '#0D1117' : '#F8F7F4');
    }
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
    applyTheme(saved);

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const current = localStorage.getItem(THEME_STORAGE_KEY);
        if (current === 'system') {
          applyTheme('system');
        }
      });
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = htmlRoot.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_STORAGE_KEY, next);
        applyTheme(next);
        showToast(`Theme switched to ${next} mode`);
      });
    }
  }

  // -------------------------------------------------------------------------
  // 2. Mobile Menu Navigation
  // -------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  function initMobileMenu() {
    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.hidden = isExpanded;
    });

    // Close when clicking any nav link
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.hidden = true;
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.hidden) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.hidden = true;
        mobileMenuBtn.focus();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 3. Hero Telemetry Tabs (Terminal, WORK-STATE.md, Contract Trace)
  // -------------------------------------------------------------------------
  function initTerminalTabs() {
    const tabButtons = document.querySelectorAll('.terminal-tabs .tab-btn');
    const panels = document.querySelectorAll('.terminal-body .tab-panel');

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        tabButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        panels.forEach((p) => {
          p.classList.remove('active');
          p.hidden = true;
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
          targetPanel.hidden = false;
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 4. 5-Step Workflow Stepper
  // -------------------------------------------------------------------------
  function initWorkflowStepper() {
    const stepButtons = document.querySelectorAll('.pipeline-station, .step-nav-btn');
    const stepPanels = document.querySelectorAll('.step-panel');

    stepButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const stepNum = btn.getAttribute('data-step');
        const targetPanel = document.getElementById(`step-panel-${stepNum}`);

        stepButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        stepPanels.forEach((p) => {
          p.classList.remove('active');
          p.hidden = true;
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        if (targetPanel) {
          targetPanel.classList.add('active');
          targetPanel.hidden = false;
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. Supported Agents Directory & Interactive Switcher
  // -------------------------------------------------------------------------
  const AGENT_DATA = {
    codex: {
      title: 'OpenAI Codex',
      invocation: 'Invocation: $forgex in prompt (use /skills to list)',
      notes: 'Configured with allow_implicit_invocation: false for explicit, deliberate control.',
      project: '.agents/skills/forgex',
      global: '~/.agents/skills/forgex',
      skillsCliGlobal: 'npx skills add DanDhany/forgex-fullstack-engineer --skill forgex --agent codex -g',
      skillsCliLocal: 'npx skills add DanDhany/forgex-fullstack-engineer --skill forgex --agent codex'
    },
    claude: {
      title: 'Claude Code',
      invocation: 'Invocation: /forgex (when host exposes slash commands)',
      notes: 'Mapped to canonical .claude/skills directory convention.',
      project: '.claude/skills/forgex',
      global: '~/.claude/skills/forgex',
      skillsCliGlobal: 'npx skills add DanDhany/forgex-fullstack-engineer --skill forgex --agent claude -g',
      skillsCliLocal: 'npx skills add DanDhany/forgex-fullstack-engineer --skill forgex --agent claude'
    },
    antigravity: {
      title: 'Antigravity',
      invocation: 'Invocation: /forgex or skill picker',
      notes: 'Antigravity now defaults to .agents/skills/ and ~/.gemini/config/skills/.',
      project: '.agents/skills/forgex',
      global: '~/.gemini/config/skills/forgex',
      skillsCliGlobal: 'npx skills add DanDhany/forgex-fullstack-engineer --skill forgex --agent antigravity -g',
      skillsCliLocal: 'npx skills add DanDhany/forgex-fullstack-engineer --skill forgex --agent antigravity'
    },
    cursor: {
      title: 'Cursor',
      invocation: 'Invocation: skill picker or prompt mention',
      notes: 'Uses standard .agents/skills project directory and ~/.cursor/skills global directory.',
      project: '.agents/skills/forgex',
      global: '~/.cursor/skills/forgex',
      skillsCliGlobal: 'npx skills add DanDhany/forgex-fullstack-engineer --skill forgex --agent cursor -g',
      skillsCliLocal: 'npx skills add DanDhany/forgex-fullstack-engineer --skill forgex --agent cursor'
    },
    copilot: {
      title: 'GitHub Copilot',
      invocation: 'Invocation: skill picker or prompt mention',
      notes: 'Mapped to standard .github/skills project path and ~/.copilot/skills global path.',
      project: '.github/skills/forgex',
      global: '~/.copilot/skills/forgex',
      skillsCliGlobal: 'npx skills add DanDhany/forgex-fullstack-engineer --skill forgex --agent copilot -g',
      skillsCliLocal: 'npx skills add DanDhany/forgex-fullstack-engineer --skill forgex --agent copilot'
    },
    gemini: {
      title: 'Gemini CLI',
      invocation: 'Invocation: skill picker or prompt mention',
      notes: 'Mapped to .agents/skills project directory and ~/.gemini/skills global directory.',
      project: '.agents/skills/forgex',
      global: '~/.gemini/skills/forgex',
      skillsCliGlobal: 'npx skills add DanDhany/forgex-fullstack-engineer --skill forgex --agent gemini -g',
      skillsCliLocal: 'npx skills add DanDhany/forgex-fullstack-engineer --skill forgex --agent gemini'
    },
    windsurf: {
      title: 'Windsurf',
      invocation: 'Invocation: skill picker or prompt mention',
      notes: 'Uses .windsurf/skills project directory and ~/.codeium/windsurf/skills global directory.',
      project: '.windsurf/skills/forgex',
      global: '~/.codeium/windsurf/skills/forgex',
      skillsCliGlobal: 'npx skills add DanDhany/forgex-fullstack-engineer --skill forgex --agent windsurf -g',
      skillsCliLocal: 'npx skills add DanDhany/forgex-fullstack-engineer --skill forgex --agent windsurf'
    },
    opencode: {
      title: 'OpenCode',
      invocation: 'Invocation: skill picker or prompt mention',
      notes: 'Uses standard .agents/skills project directory and ~/.agents/skills global directory.',
      project: '.agents/skills/forgex',
      global: '~/.agents/skills/forgex',
      skillsCliGlobal: 'npx skills add DanDhany/forgex-fullstack-engineer --skill forgex --agent opencode -g',
      skillsCliLocal: 'npx skills add DanDhany/forgex-fullstack-engineer --skill forgex --agent opencode'
    }
  };

  function initAgentHub() {
    const agentTabs = document.querySelectorAll('.agent-tab');
    const titleEl = document.getElementById('activeAgentTitle');
    const invocationEl = document.getElementById('activeAgentInvocation');
    const notesEl = document.getElementById('activeAgentNotes');
    const projectEl = document.getElementById('activeAgentProject');
    const globalEl = document.getElementById('activeAgentGlobal');
    const cmdGlobalEl = document.getElementById('cmdSkillsCliGlobal');
    const cmdLocalEl = document.getElementById('cmdSkillsCliLocal');

    if (!agentTabs.length || !titleEl) return;

    agentTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const agentKey = tab.getAttribute('data-agent');
        const data = AGENT_DATA[agentKey];
        if (!data) return;

        agentTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        titleEl.textContent = data.title;
        invocationEl.innerHTML = `<code>${data.invocation}</code>`;
        notesEl.textContent = data.notes;
        projectEl.textContent = data.project;
        globalEl.textContent = data.global;
        cmdGlobalEl.textContent = data.skillsCliGlobal;
        cmdLocalEl.textContent = data.skillsCliLocal;
      });
    });
  }

  // -------------------------------------------------------------------------
  // 6. Copy-to-Clipboard Functionality
  // -------------------------------------------------------------------------
  let toastTimer = null;
  const toastEl = document.getElementById('toastNotification');

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2500);
  }

  function initCopyButtons() {
    const copyButtons = document.querySelectorAll('[data-copy-target]');

    copyButtons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const targetId = btn.getAttribute('data-copy-target');
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        const textToCopy = targetEl.textContent.trim();

        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textToCopy);
          } else {
            // Fallback for older environments
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
          }

          const originalText = btn.innerHTML;
          btn.classList.add('copied');
          showToast(`Copied to clipboard: "${textToCopy.substring(0, 32)}..."`);

          setTimeout(() => {
            btn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          showToast('Failed to copy. Please select and copy manually.');
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 7. Initialization
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initTerminalTabs();
    initWorkflowStepper();
    initAgentHub();
    initCopyButtons();
  });
})();
