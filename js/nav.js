/* =========================
   NAV & MOBILE / SUBSCRIBE LOGIC
   - Fully optimized version (no features removed)
   - Fixed arrow/dopdown sync
   - Fixed duplicate conditions
   - Improved panel reset stability
========================= */

(() => {
  // ---- Helpers ----
  const qs = sel => document.querySelector(sel);
  const qsa = sel => Array.from(document.querySelectorAll(sel));
  const body = document.body;

  function preventScroll(toggle) {
    body.classList.toggle('no-scroll', toggle);
  }

  function setAria(el, name, value) {
    if (!el) return;
    el.setAttribute(name, value);
  }

  // ---- SELECTORS ----
  const modal = qs('#subscribeModal');
  const openBtns = qsa('.subscribeBtn');
  const closeModalBtn = modal?.querySelector('.modal-close');
  const submitBtn = qs('#subscribeSubmit');
  const emailInput = qs('#subscriberEmail');
  const message = qs('#subscribeMessage');

  const hamburger = qs('#hamburger');
  const mobileClose = qs('#mobileClose');
  const mobileMenu = qs('#mobileMenu');
  const mainPanel = qs('.main-panel');
  const nestedPanels = qsa('.nested-panel');
  const mobileLinks = qsa('.mobile-link');
  const backButtons = qsa('.back-btn');
  const panelCloseBtns = qsa('.panel-close');

  const navItems = qsa('.nav-item');

  // Small helper to fully reset dropdowns inside a given container
  function resetDropdowns(container) {
    container.querySelectorAll('.dropdown').forEach(d => {
      d.classList.remove('open');

      const header = d.querySelector('.dropdown-header');
      if (header) header.classList.remove('active');

      const arr = d.querySelector('.arrow-btn');
      if (arr) arr.textContent = '▶';

      const content = d.querySelector('.dropdown-content');
      if (content) content.style.display = 'none';
    });
  }

  // -----------------------------
  // SUBSCRIBE MODAL
  // -----------------------------
  if (modal) {
    modal.setAttribute('aria-hidden', 'true');

    let lastFocusedBeforeModal = null;

    function openModal() {
      lastFocusedBeforeModal = document.activeElement;

      modal.setAttribute('aria-hidden', 'false');
      preventScroll(true);

      setTimeout(() => emailInput?.focus(), 150);
    }

    function closeModal() {
      modal.setAttribute('aria-hidden', 'true');
      preventScroll(false);

      if (message) message.textContent = '';

      // Restore focus back to the opener
      if (lastFocusedBeforeModal) {
        lastFocusedBeforeModal.focus();
      }
    }

    openBtns.forEach(btn =>
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      })
    );

    closeModalBtn?.addEventListener('click', closeModal);

    submitBtn?.addEventListener('click', () => {
      const email = (emailInput?.value || '').trim();

      if (!email || !email.includes('@')) {
        if (message) {
          message.style.display = 'block';
          message.textContent = 'Please enter a valid email!';
        }
        return;
      }

      if (message) {
        message.style.display = 'block';
        message.textContent = "Thanks! You're now subscribed.";
      }

      if (emailInput) emailInput.value = '';

      setTimeout(closeModal, 1400);
    });
  }

  // -----------------------------
  // MOBILE MENU OPEN/CLOSE
  // -----------------------------
  function openMobileMenu() {
    mobileMenu?.setAttribute('aria-hidden', 'false');
    hamburger?.setAttribute('aria-expanded', 'true');

    mobileMenu?.classList.add('open');
    preventScroll(true);

    mainPanel?.classList.add('active');

    nestedPanels.forEach(p => {
      p.classList.remove('active');
      p.setAttribute('aria-hidden', 'true');
      resetDropdowns(p);
    });
  }

  function closeMobileMenu() {
    mobileMenu?.setAttribute('aria-hidden', 'true');
    hamburger?.setAttribute('aria-expanded', 'false');

    mobileMenu?.classList.remove('open');
    preventScroll(false);

    mainPanel?.classList.remove('active');

    nestedPanels.forEach(p => {
      p.classList.remove('active');
      p.setAttribute('aria-hidden', 'true');
      resetDropdowns(p);
    });
  }

  hamburger?.addEventListener('click', openMobileMenu);
  mobileClose?.addEventListener('click', closeMobileMenu);

  mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMobileMenu();
  });

  // -----------------------------
  // NESTED PANELS (MOBILE)
  // -----------------------------
  mobileLinks.forEach(link => {
    const targetId = link.dataset.target;
    if (!targetId) return;

    const panel = qs(`#${targetId}`);

    link.addEventListener('click', (e) => {
      e.preventDefault();

      mainPanel?.classList.remove('active');

      panel?.classList.add('active');
      panel?.setAttribute('aria-hidden', 'false');

      if (panel) resetDropdowns(panel);
    });

    const arrowBtn = link.querySelector('.arrow-btn');
    arrowBtn?.addEventListener('click', (ev) => {
      ev.preventDefault();
      link.click();
    });
  });

  backButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.nested-panel');
      if (!panel) return;

      resetDropdowns(panel);

      panel.classList.remove('active');
      panel.setAttribute('aria-hidden', 'true');

      mainPanel?.classList.add('active');
    });
  });

  // --- FULL RESET FOR ALL PANELS ---
  function resetAllPanels() {
    mobileMenu?.setAttribute('aria-hidden', 'true');
    mobileMenu?.classList.remove('open');

    hamburger?.setAttribute('aria-expanded', 'false');

    preventScroll(false);

    mainPanel?.classList.remove('active');

    nestedPanels.forEach(p => {
      p.classList.remove('active');
      p.setAttribute('aria-hidden', 'true');
      resetDropdowns(p);
    });
  }

  panelCloseBtns.forEach(btn =>
    btn.addEventListener('click', resetAllPanels)
  );

  // Dropdowns inside nested panels
  nestedPanels.forEach(panel => {
    panel.querySelectorAll('.dropdown-header').forEach(header => {
      const dropdown = header.closest('.dropdown');
      const arrow = header.querySelector('.arrow-btn');

      header.addEventListener('click', () => {
        const isOpen = dropdown.classList.contains('open');

        resetDropdowns(panel);

        if (!isOpen) {
          dropdown.classList.add('open');
          header.classList.add('active');
          if (arrow) arrow.textContent = '▼';

          const content = dropdown.querySelector('.dropdown-content');
          if (content) content.style.display = 'flex';
        }
      });
    });
  });

  let lastIsMobile = window.innerWidth < 900;

  window.addEventListener("resize", () => {
    const isMobile = window.innerWidth < 900;

    if (lastIsMobile && !isMobile) {
      resetAllPanels();
    }

    lastIsMobile = isMobile;
  });

  // -----------------------------
  // DESKTOP NAV: MEGA PANELS
  // -----------------------------
  navItems.forEach(item => {
    item.setAttribute('aria-expanded', 'false');

    const label = item.querySelector('.nav-label');
    const arrow = item.querySelector('.arrow');
    const panelId = item.dataset.panel;
    const panel = panelId ? qs(`#${panelId}`) : item.querySelector('.mega-panel');

    function closePanel() {
      item.classList.remove('active');
      item.setAttribute('aria-expanded', 'false');
      panel?.setAttribute('aria-hidden', 'true');
    }

    function openPanel() {
      navItems.forEach(n => {
        n.classList.remove('active');
        n.setAttribute('aria-expanded', 'false');

        const pid = n.dataset.panel;
        const p = pid ? qs(`#${pid}`) : n.querySelector('.mega-panel');
        p?.setAttribute('aria-hidden', 'true');
      });

      item.classList.add('active');
      item.setAttribute('aria-expanded', 'true');
      panel?.setAttribute('aria-hidden', 'false');
    }

    label?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const isOpen = item.classList.contains('active');
      isOpen ? closePanel() : openPanel();
    });

    arrow?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const isOpen = item.classList.contains('active');
      isOpen ? closePanel() : openPanel();
    });
  });

  // Click outside closes desktop panels
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-glass')) {
      navItems.forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-expanded', 'false');

        const pid = item.dataset.panel;
        const p = pid ? qs(`#${pid}`) : item.querySelector('.mega-panel');
        p?.setAttribute('aria-hidden', 'true');
      });
    }
  });

  // -----------------------------
  // DARK/LIGHT MODE SWITCH
  // -----------------------------
  qsa('#darkLightToggle').forEach(toggle => {
    toggle.checked = body.classList.contains('light-mode');

    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        setAria(toggle, 'aria-checked', 'true');
      } else {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        setAria(toggle, 'aria-checked', 'false');
      }
    });
  });

  // -----------------------------
  // GLOBAL: ESC CLOSES OVERLAYS
  // -----------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {

      if (modal && modal.getAttribute('aria-hidden') === 'false') {
        modal.setAttribute('aria-hidden', 'true');
        preventScroll(false);
      }

      if (mobileMenu && mobileMenu.getAttribute('aria-hidden') === 'false') {
        closeMobileMenu();
      }

      navItems.forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-expanded', 'false');

        const pid = item.dataset.panel;
        const p = pid ? qs(`#${pid}`) : item.querySelector('.mega-panel');
        p?.setAttribute('aria-hidden', 'true');
      });
    }
  });

  // -----------------------------
  // ACCESSIBILITY: FOCUS TRAP
  // -----------------------------
  if (modal) {
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const focusable = Array.from(
          modal.querySelectorAll(
            'a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => !el.hasAttribute('disabled'));

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

})();
