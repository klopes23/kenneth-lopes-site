/* mobile.js — DROP-IN REPLACEMENT for the existing file.
   Adds: (a) deck-aware sheet items, (b) page-titlebar back-button, (c) keeps
   the existing Linear/Notion sheet pattern, swipe-down dismiss, edge-back. */

(function () {
  if (window.__mobileShellInit) return;
  window.__mobileShellInit = true;

  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
  const onDeck = () => document.body.dataset.deck === 'true';

  /* slide list for the deck — keep in sync with cases/deck.html SLIDE_COMPONENTS order */
  const DECK_SLIDES = [
    ['#/0', 'Profile'],
    ['#/1', 'Multi-Site Governance'],
    ['#/2', 'RAG + HITL'],
    ['#/3', 'GenAI Enablement'],
    ['#/4', 'Customer Experience Center'],
    ['#/5', 'Mexico Launch'],
    ['#/6', 'Creator · The Nesi Family'],
  ];

  function buildSheet() {
    if (!isMobile()) return;
    const topnav = document.querySelector('.topnav .topnav-inner');
    if (!topnav || topnav.querySelector('.m-menu-btn')) return;

    const items = [];

    if (onDeck()) {
      // Deck context: 7 slides instead of nav links
      DECK_SLIDES.forEach(([href, label], i) => {
        items.push({
          href,
          label: `${String(i + 1).padStart(2, '0')} · ${label}`,
          deck: true,
        });
      });
      items.push({ href: '../portfolio.html', label: '← Back to Portfolio', meta: true });
    } else {
      // Site context: only collect subnav (page-section) links + Email.
      // The .topnav-link items (Home/Portfolio/Creator) are already visible inline
      // in the topnav row 2, so we don't duplicate them in the sheet.
      const subnav = document.querySelector('.subnav');
      if (subnav) {
        subnav.querySelectorAll('.subnav-link').forEach(a => {
          items.push({ href: a.getAttribute('href'), label: a.textContent.trim(), section: true });
        });
      }
      if (!items.find(i => /contact|email/i.test(i.label))) {
        items.push({ href: 'mailto:klopes23@gmail.com', label: 'Email' });
      }
    }

    // Hamburger
    const cta = topnav.querySelector('.topnav-cta');
    const btn = document.createElement('button');
    btn.className = 'm-menu-btn';
    btn.setAttribute('aria-label', 'Open menu');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    if (cta && cta.parentElement === topnav) topnav.insertBefore(btn, cta);
    else topnav.appendChild(btn);

    // Backdrop + sheet
    const backdrop = document.createElement('div');
    backdrop.className = 'm-sheet-backdrop';
    const sheet = document.createElement('div');
    sheet.className = 'm-sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.innerHTML = '<div class="m-sheet-handle" aria-hidden="true"></div>' +
      `<div class="m-sheet-title">${onDeck() ? 'Slides · 7 total' : 'Navigate'}</div>` +
      items.map(i => `<a href="${i.href}"${i.deck ? ' data-deck-slide="true"' : ''}>${i.label}</a>`).join('');
    document.body.appendChild(backdrop);
    document.body.appendChild(sheet);

    const open = () => {
      backdrop.classList.add('is-open'); sheet.classList.add('is-open');
      document.body.classList.add('m-sheet-open');
    };
    const close = () => {
      backdrop.classList.remove('is-open'); sheet.classList.remove('is-open');
      document.body.classList.remove('m-sheet-open');
    };
    btn.addEventListener('click', open);
    backdrop.addEventListener('click', close);
    sheet.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

    // Swipe-down to dismiss
    const handle = sheet.querySelector('.m-sheet-handle');
    let startY = null;
    handle.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
    handle.addEventListener('touchmove', e => {
      if (startY == null) return;
      const dy = e.touches[0].clientY - startY;
      if (dy > 0) sheet.style.transform = `translateY(${dy}px)`;
    }, { passive: true });
    handle.addEventListener('touchend', e => {
      const dy = (e.changedTouches[0].clientY - startY);
      sheet.style.transform = '';
      if (dy > 80) close();
      startY = null;
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && sheet.classList.contains('is-open')) close();
    });
  }

  function wireSwipeBack() {
    if (!isMobile() || !history.length || history.length < 2) return;
    let sx = null;
    document.addEventListener('touchstart', e => {
      const t = e.touches[0];
      if (t.clientX < 24) sx = t.clientX;
    }, { passive: true });
    document.addEventListener('touchend', e => {
      if (sx == null) return;
      const ex = e.changedTouches[0].clientX;
      if (ex - sx > 80) history.back();
      sx = null;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { buildSheet(); wireSwipeBack(); });
  } else {
    buildSheet(); wireSwipeBack();
  }

  let wasMobile = isMobile();
  window.addEventListener('resize', () => {
    const now = isMobile();
    if (now && !wasMobile) buildSheet();
    wasMobile = now;
  });
})();
