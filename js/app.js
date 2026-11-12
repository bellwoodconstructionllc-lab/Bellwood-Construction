/* ==========================================================================
   BELLWOOD CONSTRUCTION — APP
   --------------------------------------------------------------------------
   Vanilla JS, no framework. Everything reads from BELLWOOD in js/config.js —
   don't hard-code business details in here.

   Modules, in order:
     A. Helpers
     B. Theme (light / dark)
     C. Header + mobile nav + scroll spy
     D. Scroll reveal
     E. Identity (phone / email / license / hours everywhere)
     F. Hero + placeholder imagery
     G. Services
     H. Gallery + lightbox + before/after slider
     I. Process timeline
     J. Service area map + "do we serve your area?"
     K. Booking calendar + .ics
     L. Quote wizard
     M. Contact form
     N. Footer
   ========================================================================== */
(function () {
'use strict';

const CFG = window.BELLWOOD || BELLWOOD;
const B   = CFG.business;


/* ==========================================================================
   A. HELPERS
   ========================================================================== */
const $  = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Create an element with attributes and children in one call. */
function el(tag, attrs, children) {
  const node = document.createElement(tag);
  if (attrs) {
    for (const k in attrs) {
      const v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'text') node.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') {
        node.addEventListener(k.slice(2).toLowerCase(), v);
      } else node.setAttribute(k, v === true ? '' : v);
    }
  }
  (Array.isArray(children) ? children : children ? [children] : [])
    .forEach(c => node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return node;
}

/** True when a config value is still an unfilled [PLACEHOLDER]. */
const isPlaceholder = v =>
  typeof v === 'string' && /^\s*\[.*\]\s*$/.test(v);

/** Escape text before it goes anywhere near innerHTML. */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** The temporary stand-in images. Accepts the older `stockPhotos` key too,
    so a config.js written before the rename still works. */
const placeholderSet = () => CFG.placeholderImages || CFG.stockPhotos || {};

/** Responsive srcset for a project photo (we ship 480w / 800w / full). */
function projectSrcset(file) {
  const base = file.replace(/\.jpg$/i, '');
  return `assets/projects/${base}-480w.jpg 480w, ` +
         `assets/projects/${base}-800w.jpg 800w, ` +
         `assets/projects/${file} 1200w`;
}

/** Smooth-scroll to a section, allowing for the sticky header. */
function scrollToId(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY -
              ($('#siteHeader')?.offsetHeight || 68) - 12;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

/* --- simple line-art icons, drawn not imported ------------------------- */
const ICONS = {
  kitchen: '<path d="M4 9h24M4 9v18a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V9M4 9V5a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v4M11 15v8M21 15v8"/>',
  bath:    '<path d="M4 17h24v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-3zM7 17V7a3 3 0 0 1 6 0M10 25l-2 4M22 25l2 4"/>',
  addition:'<path d="M3 16 13 8l10 8M6 15v12h14V15M25 6h5M27.5 3.5v5M24 21h6M27 18v6"/>',
  home:    '<path d="M4 15 16 5l12 10M7 14v13h18V14M13 27v-8h6v8"/>',
  basement:'<path d="M4 11 16 4l12 7M6 11v16h20V11M6 19h20M11 27v-8M21 27v-8"/>',
  finish:  '<path d="M3 24h26M3 24v4h26v-4M6 24V12h8v12M18 24V8h8v16M6 18h8M18 16h8"/>',
  commercial:'<path d="M5 28V6h13v22M18 28V13h9v15M9 11h5M9 16h5M9 21h5M22 18h2M22 23h2M3 28h26"/>'
};
function iconSvg(name, cls) {
  const d = ICONS[name] || ICONS.home;
  return `<svg class="${cls || ''}" viewBox="0 0 32 32" aria-hidden="true" focusable="false"
            fill="none" stroke="currentColor" stroke-width="1.7"
            stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
}


/* ==========================================================================
   B. THEME
   ========================================================================== */
const Theme = (() => {
  const KEY = 'bellwood-theme';
  const root = document.documentElement;
  const btn  = $('#themeToggle');

  function apply(mode) {
    root.setAttribute('data-theme', mode);
    if (btn) {
      const dark = mode === 'dark';
      btn.setAttribute('aria-pressed', String(dark));
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    // keep the mobile browser chrome in step with the page
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#191512' : '#FAF7F2');
  }

  function init() {
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    apply(saved || system);

    btn?.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
    });

    // Follow the system only while the visitor hasn't chosen for themselves
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      let chosen = null;
      try { chosen = localStorage.getItem(KEY); } catch (err) { /* ignore */ }
      if (!chosen) apply(e.matches ? 'dark' : 'light');
    });
  }
  return { init };
})();


/* ==========================================================================
   C. HEADER, MOBILE NAV, SCROLL SPY
   ========================================================================== */
const Header = (() => {
  const header = $('#siteHeader');
  const nav    = $('#primaryNav');
  const toggle = $('#navToggle');
  const scrim  = $('#navScrim');

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    scrim.hidden = !open;
    document.body.classList.toggle('is-locked', open);
  }

  function init() {
    toggle?.addEventListener('click', () =>
      setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    scrim?.addEventListener('click', () => setOpen(false));

    // Close the drawer after tapping a link, and hand focus to the section
    $$('#primaryNav a').forEach(a => a.addEventListener('click', () => setOpen(false)));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Drop the drawer state if the viewport grows back to desktop
    window.matchMedia('(min-width: 961px)').addEventListener('change', e => {
      if (e.matches) setOpen(false);
    });

    // Shadow under the header once we leave the top
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // --- scroll spy: highlight the section you're looking at -------------
    const links = $$('#primaryNav a[href^="#"]');
    const sections = links
      .map(a => document.getElementById(a.getAttribute('href').slice(1)))
      .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
      const seen = new Map();
      const spy = new IntersectionObserver(entries => {
        entries.forEach(en => seen.set(en.target.id, en.intersectionRatio));
        let best = null, bestRatio = 0;
        seen.forEach((ratio, id) => { if (ratio > bestRatio) { bestRatio = ratio; best = id; } });
        links.forEach(a =>
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + best && bestRatio > 0));
      }, { rootMargin: '-45% 0px -50% 0px', threshold: [0, .25, .5, 1] });
      sections.forEach(s => spy.observe(s));
    }
  }
  return { init };
})();


/* ==========================================================================
   D. SCROLL REVEAL
   ========================================================================== */
const Reveal = (() => {
  function init() {
    const items = $$('[data-reveal]');
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      items.forEach(i => i.classList.add('is-in'));
      $('#timeline')?.classList.add('is-in');
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        obs.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: .08 });

    items.forEach(i => io.observe(i));
    return io;
  }
  /** Newly created elements (gallery tiles, service cards) opt in here. */
  function watch(nodes) {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      nodes.forEach(n => n.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        obs.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: .08 });
    nodes.forEach(n => io.observe(n));
  }
  return { init, watch };
})();


/* ==========================================================================
   E. IDENTITY — phone, email, licence, hours, everywhere at once
   ========================================================================== */
const Identity = (() => {
  function phoneInto(node, withText) {
    if (!node) return;
    node.setAttribute('href', B.phoneHref);
    if (withText) node.textContent = B.phone;
  }

  function init() {
    // --- phone links ---
    phoneInto($('#callFab'), false);
    phoneInto($('#checkerPhone'), true);
    phoneInto($('#contactPhone'), true);
    phoneInto($('#footerPhone'), true);
    phoneInto($('#quoteSuccessCall'), false);

    const hp = $('#headerPhone');
    if (hp) {
      hp.setAttribute('href', B.phoneHref);
      hp.setAttribute('aria-label', `Call Bellwood Construction at ${B.phone}`);
      $('.header-phone__num', hp).textContent = B.phone;
    }

    // --- email links ---
    [['#contactEmail', true], ['#footerEmail', true]].forEach(([sel, withText]) => {
      const n = $(sel);
      if (!n) return;
      n.setAttribute('href', B.emailHref);
      if (withText) n.textContent = B.email;
    });

    // --- trust strip ---
    const years = $('#trustYears');
    const yearsLabel = $('#trustYearsLabel');
    if (years && B.experience) {
      years.textContent = isPlaceholder(B.experience.value)
        ? B.experience.value           // shows the placeholder until it's filled in
        : `${B.experience.value} ${B.experience.unit}`;
      if (yearsLabel) yearsLabel.textContent = B.experience.label;
    }
    const lic = $('#trustLicense');
    if (lic) lic.textContent = B.licenseNumber;

    // --- contact block ---
    const addr = $('#contactAddress');
    if (addr) {
      addr.textContent = isPlaceholder(B.streetAddress)
        ? `${B.streetAddress} — ${B.city}, ${B.state} ${B.postalCode}`
        : `${B.streetAddress}, ${B.city}, ${B.state} ${B.postalCode}`;
    }

    const licLine = $('#contactLicense');
    if (licLine) licLine.textContent = `WA Contractor License #${B.licenseNumber} · Licensed, bonded & insured`;

    // --- hours ---
    const hours = $('#contactHours');
    if (hours) {
      B.hours.forEach(h => {
        hours.appendChild(el('li', null, [
          el('span', { class: 'hours__day', text: h.day }),
          h.closed
            ? el('span', { class: 'hours__closed', text: 'Closed' })
            : el('span', { text: `${h.open} – ${h.close}` })
        ]));
      });
    }
  }
  return { init };
})();


/* ==========================================================================
   F. HERO + PLACEHOLDER IMAGERY
   ========================================================================== */
const Placeholders = (() => {

  function init() {
    const S = placeholderSet();

    // --- hero (NOT lazy — it's the largest paint on the page) ---
    const hero = $('#heroImage');
    if (hero && S.hero) {
      hero.src = S.hero.url;
      if (S.hero.urlSmall) {
        hero.srcset = `${S.hero.urlSmall} 1000w, ${S.hero.url} 2000w`;
        hero.sizes = '100vw';
      }
      // The hero is decorative: the headline over it carries the meaning,
      // so an empty alt keeps screen readers from reading a placeholder
      // as though it were one of our projects.
      hero.alt = '';
      hero.setAttribute('role', 'presentation');
    }

    // --- process figure ---
    const proc = $('#processImage');
    if (proc && S.process) {
      proc.src = S.process.url;
      proc.alt = S.process.alt;
    }

    // --- service area banner ---
    const area = $('#areaImage');
    if (area && S.serviceArea) {
      area.src = S.serviceArea.url;
      area.alt = '';
      area.setAttribute('role', 'presentation');
    }
  }
  return { init };
})();


/* ==========================================================================
   G. SERVICES
   ========================================================================== */
const Services = (() => {
  /** Resolve a service `photo` string into an <img> or a drawn panel. */
  function media(svc) {
    const wrap = el('div', { class: 'svc__media' });

    if (svc.photo && svc.photo.startsWith('project:')) {
      const file = svc.photo.slice('project:'.length);
      const project = CFG.projects.find(p => p.file === file);
      wrap.appendChild(el('img', {
        src: `assets/projects/${file.replace(/\.jpg$/i, '-800w.jpg')}`,
        srcset: projectSrcset(file),
        sizes: '(max-width: 700px) 92vw, 33vw',
        alt: project ? project.alt : svc.title,
        loading: 'lazy',
        decoding: 'async'
      }));
      wrap.appendChild(el('span', { class: 'svc__badge', text: 'Our work' }));

    } else if (svc.photo && /^(placeholder|stock):/.test(svc.photo)) {
      const key = svc.photo.replace(/^(placeholder|stock):/, '');
      const photo = placeholderSet()[key];
      if (photo) {
        wrap.appendChild(el('img', {
          src: photo.url, alt: photo.alt, loading: 'lazy', decoding: 'async'
        }));
      }

    } else {
      // No photo yet — draw a panel rather than borrow someone else's project
      wrap.appendChild(el('div', { class: 'svc__panel', html: iconSvg(svc.icon) }));
    }
    return wrap;
  }

  function card(svc, index) {
    const bodyId = `svc-body-${svc.id}`;

    const toggle = el('button', {
      class: 'svc__toggle',
      type: 'button',
      'aria-expanded': 'false',
      'aria-controls': bodyId,
      html: `<span>Details</span>
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
               <path d="M6 9l6 6 6-6"/></svg>`
    });

    const cta = el('button', {
      class: 'btn btn--primary btn--sm svc__cta',
      type: 'button',
      text: 'Request a quote for this',
      onclick: () => Quote.openWith(svc.id)
    });

    const more = el('div', { class: 'svc__more', id: bodyId }, [
      el('div', null, [
        el('p', { class: 'svc__desc', text: svc.description }),
        cta
      ])
    ]);

    const article = el('article', {
      class: 'svc', 'data-reveal': '',
      style: `--reveal-delay:${Math.min(index * 70, 350)}ms`
    }, [
      media(svc),
      el('div', { class: 'svc__body' }, [
        el('h3', { class: 'svc__title', text: svc.title }),
        el('p',  { class: 'svc__blurb', text: svc.blurb }),
        toggle,
        more
      ])
    ]);

    toggle.addEventListener('click', () => {
      const open = article.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      $('span', toggle).textContent = open ? 'Close' : 'Details';
    });

    return article;
  }

  function init() {
    const grid = $('#servicesGrid');
    if (!grid) return;
    const cards = CFG.services.map(card);
    cards.forEach(c => grid.appendChild(c));
    Reveal.watch(cards);
  }
  return { init };
})();


/* ==========================================================================
   H. GALLERY + LIGHTBOX + BEFORE/AFTER SLIDER
   ========================================================================== */

/* --- the reusable before/after component ------------------------------ */
function BeforeAfter(item) {
  const node = el('div', {
    class: 'ba',
    tabindex: '0',
    role: 'slider',
    'aria-label': `Before and after comparison: ${item.caption}. Use the left and right arrow keys to wipe between the two photos.`,
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    'aria-valuenow': '50',
    'aria-valuetext': 'Half before, half after'
  });

  // `before` sets the intrinsic size; `after` is clipped on top of it.
  const beforeImg = el('img', {
    class: 'ba__img', src: `assets/projects/${item.before}`,
    alt: `Before: ${item.alt}`, decoding: 'async'
  });
  const afterImg = el('img', {
    src: `assets/projects/${item.file}`, alt: `After: ${item.alt}`, decoding: 'async'
  });

  const after  = el('div', { class: 'ba__after' }, [afterImg]);
  const handle = el('div', { class: 'ba__handle' }, [
    el('div', { class: 'ba__grip', html:
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
         <path d="M9 6L4 12l5 6M15 6l5 6-5 6"/></svg>` })
  ]);

  node.append(
    beforeImg, after,
    el('span', { class: 'ba__label ba__label--before', text: 'Before' }),
    el('span', { class: 'ba__label ba__label--after',  text: 'After'  }),
    handle
  );

  let pos = 50;
  function set(next) {
    pos = Math.max(0, Math.min(100, next));
    node.style.setProperty('--pos', pos);
    node.setAttribute('aria-valuenow', String(Math.round(pos)));
    node.setAttribute('aria-valuetext',
      pos <= 2  ? 'Showing the after photo' :
      pos >= 98 ? 'Showing the before photo' :
      `${Math.round(pos)}% before`);
  }
  set(50);

  function fromEvent(e) {
    const rect = node.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    set((x / rect.width) * 100);
  }

  // --- pointer + touch drag ---
  let dragging = false;
  const start = e => {
    dragging = true;
    node.setPointerCapture?.(e.pointerId);
    fromEvent(e);
    e.preventDefault();
  };
  const move = e => { if (dragging) { fromEvent(e); e.preventDefault(); } };
  const end  = () => { dragging = false; };

  if (window.PointerEvent) {
    node.addEventListener('pointerdown', start);
    node.addEventListener('pointermove', move);
    node.addEventListener('pointerup', end);
    node.addEventListener('pointercancel', end);
  } else {
    node.addEventListener('mousedown', start);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    node.addEventListener('touchstart', start, { passive: false });
    node.addEventListener('touchmove', move,  { passive: false });
    node.addEventListener('touchend', end);
  }

  // --- keyboard ---
  node.addEventListener('keydown', e => {
    const step = e.shiftKey ? 10 : 4;
    switch (e.key) {
      case 'ArrowLeft':  case 'ArrowDown':  set(pos - step); break;
      case 'ArrowRight': case 'ArrowUp':    set(pos + step); break;
      case 'Home': set(0);   break;
      case 'End':  set(100); break;
      default: return;
    }
    e.preventDefault();
    e.stopPropagation();   // don't let the lightbox treat this as next/prev
  });

  return node;
}

const Gallery = (() => {
  const grid    = $('#galleryGrid');
  const filters = $('#galleryFilters');
  let visible   = [];          // indices currently shown, in display order
  let current   = 0;           // position within `visible`

  /* ---------- grid ---------- */
  function tile(item, index) {
    const hasBefore = !!(item.before && item.before.trim());

    const frame = el('div', { class: 'tile__frame' }, [
      el('img', {
        src: `assets/projects/${item.file.replace(/\.jpg$/i, '-800w.jpg')}`,
        srcset: projectSrcset(item.file),
        sizes: '(max-width: 560px) 92vw, (max-width: 900px) 46vw, 24vw',
        alt: item.alt,
        loading: 'lazy',
        decoding: 'async',
        width: '1200', height: '1600'
      })
    ]);

    const btn = el('button', {
      class: 'tile',
      type: 'button',
      'data-index': String(index),
      'data-category': item.category,
      'aria-label': `${item.caption}. Open larger view.`
    }, [
      frame,
      el('span', { class: 'tile__tag', text: item.category }),
      hasBefore ? el('span', { class: 'tile__ba', text: 'Before / After' }) : null,
      el('span', { class: 'tile__cap', text: item.caption })
    ].filter(Boolean));

    btn.addEventListener('click', () => Lightbox.open(index));
    return btn;
  }

  /* ---------- filter chips ---------- */
  function buildFilters() {
    const cats = ['All', ...Array.from(new Set(CFG.projects.map(p => p.category)))];
    cats.forEach((cat, i) => {
      const chip = el('button', {
        class: 'chip', type: 'button',
        'aria-pressed': String(i === 0),
        text: cat,
        onclick: () => applyFilter(cat, chip)
      });
      filters.appendChild(chip);
    });
  }

  /** Label the open button with what the current filter actually shows. */
  function syncOpenButton() {
    const label = $('#galleryOpenLabel');
    if (!label) return;
    const n = visible.length;
    const chip = $$('.chip', filters).find(c => c.getAttribute('aria-pressed') === 'true');
    const cat = chip ? chip.textContent : 'All';
    label.textContent = cat === 'All'
      ? `Browse all ${n} photos`
      : `Browse ${n} ${cat.toLowerCase()}`;
    $('#galleryOpen').disabled = n === 0;
  }

  function applyFilter(cat, chip) {
    $$('.chip', filters).forEach(c => c.setAttribute('aria-pressed', String(c === chip)));

    const tiles = $$('.tile', grid);
    visible = [];
    tiles.forEach(t => {
      const show = cat === 'All' || t.dataset.category === cat;
      t.classList.toggle('is-hidden', !show);
      if (show) {
        visible.push(Number(t.dataset.index));
        if (!prefersReducedMotion()) {
          t.classList.remove('is-entering');
          // reflow so the animation restarts on every filter change
          void t.offsetWidth;
          t.classList.add('is-entering');
        }
      }
    });

    syncOpenButton();
    // a filtered strip should start from its first photo
    grid.scrollTo({ left: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }

  function init() {
    if (!grid) return;
    buildFilters();
    const tiles = CFG.projects.map(tile);
    tiles.forEach(t => grid.appendChild(t));
    visible = CFG.projects.map((_, i) => i);

    const note = $('#galleryNote');
    if (note) note.textContent = CFG.galleryNote;

    // The button opens the lightbox at whatever is first in the current filter
    const openBtn = $('#galleryOpen');
    openBtn?.addEventListener('click', () => {
      if (visible.length) Lightbox.open(visible[0]);
    });
    syncOpenButton();

    Reveal.watch([note, $('.gallery__open')].filter(Boolean));
  }

  return {
    init,
    getVisible: () => visible,
    setCurrent: i => { current = i; },
    getCurrent: () => current
  };
})();

const Lightbox = (() => {
  const box     = $('#lightbox');
  const stage   = $('#lbStage');
  const caption = $('#lbCaption');
  const count   = $('#lbCount');
  let order = [];     // project indices in the order shown
  let at    = 0;
  let lastFocus = null;

  function render() {
    const item = CFG.projects[order[at]];
    stage.replaceChildren();

    if (item.before && item.before.trim()) {
      // A `before` photo exists → show the draggable comparison slider
      stage.appendChild(BeforeAfter(item));
    } else {
      stage.appendChild(el('img', {
        src: `assets/projects/${item.file}`,
        srcset: projectSrcset(item.file),
        sizes: '(max-width: 720px) 94vw, 80vw',
        alt: item.alt,
        decoding: 'async'
      }));
    }

    caption.textContent = item.caption;
    count.textContent = `${at + 1} of ${order.length} · ${item.category}`;
  }

  function open(projectIndex) {
    order = Gallery.getVisible();
    at = Math.max(0, order.indexOf(projectIndex));
    lastFocus = document.activeElement;

    box.hidden = false;
    document.body.classList.add('is-locked');
    render();
    $('#lbClose').focus();

    const only = order.length < 2;
    $('#lbPrev').hidden = only;
    $('#lbNext').hidden = only;
  }

  function close() {
    box.hidden = true;
    document.body.classList.remove('is-locked');
    stage.replaceChildren();
    lastFocus?.focus();
  }

  function step(delta) {
    if (order.length < 2) return;
    at = (at + delta + order.length) % order.length;
    render();
  }

  function init() {
    $('#lbClose').addEventListener('click', close);
    $('#lbPrev').addEventListener('click', () => step(-1));
    $('#lbNext').addEventListener('click', () => step(1));

    // click the backdrop (but not the photo) to dismiss
    box.addEventListener('click', e => { if (e.target === box) close(); });

    document.addEventListener('keydown', e => {
      if (box.hidden) return;
      if (e.key === 'Escape')     { close(); }
      else if (e.key === 'ArrowLeft')  { step(-1); }
      else if (e.key === 'ArrowRight') { step(1); }
      else if (e.key === 'Tab')   { trapFocus(e); }
    });

    // --- swipe on touch ---
    let x0 = null, y0 = null;
    box.addEventListener('touchstart', e => {
      if (e.target.closest('.ba')) return;      // the slider owns its own drag
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });

    box.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
      x0 = y0 = null;
    }, { passive: true });
  }

  /** Keep Tab inside the dialog while it's open. */
  function trapFocus(e) {
    const focusable = $$('button, [href], [tabindex]:not([tabindex="-1"])', box)
      .filter(n => !n.hidden && n.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  return { init, open, close };
})();


/* ==========================================================================
   I. PROCESS TIMELINE
   ========================================================================== */
const Process = (() => {
  function init() {
    const list = $('#timeline');
    if (!list) return;

    CFG.process.forEach((step, i) => {
      list.appendChild(el('li', {
        class: 'tl-step', 'data-reveal': '',
        style: `--reveal-delay:${i * 110}ms`
      }, [
        el('span', { class: 'tl-step__dot', text: String(i + 1), 'aria-hidden': 'true' }),
        el('h3', { class: 'tl-step__title', text: step.title }),
        el('p',  { class: 'tl-step__body',  text: step.body })
      ]));
    });

    Reveal.watch($$('.tl-step', list));

    // draw the connecting line once the list scrolls into view
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      list.classList.add('is-in');
    } else {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          list.classList.add('is-in');
          obs.disconnect();
        });
      }, { threshold: .12 });
      io.observe(list);
    }
  }
  return { init };
})();


/* ==========================================================================
   J. SERVICE AREA — map + "do we serve your area?"
   ========================================================================== */
const ServiceArea = (() => {
  const SA = CFG.serviceArea;

  /* ---------- Leaflet map ---------- */
  function buildMap() {
    if (typeof L === 'undefined') return;          // CDN blocked — fail quietly
    const holder = $('#areaMap');
    if (!holder) return;

    const map = L.map(holder, {
      center: [SA.mapCenter.lat, SA.mapCenter.lng],
      zoom: SA.mapZoom,
      scrollWheelZoom: false,                       // don't hijack page scroll
      attributionControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Shaded coverage circle, centred on where we're based rather than on
    // the map's centre (the map sits south of Everett to fit the whole area).
    const hub = SA.radiusCenter || SA.mapCenter;
    L.circle([hub.lat, hub.lng], {
      radius: SA.radiusMiles * 1609.34,
      color: '#6B4423', weight: 1.5, opacity: .5,
      fillColor: '#B8893B', fillOpacity: .09
    }).addTo(map);

    const pin = (cls, size) => L.divIcon({
      className: '', html: `<div class="marker-pin ${cls}"></div>`,
      iconSize: [size, size], iconAnchor: [size / 2, size / 2]
    });

    SA.cities.forEach(city => {
      const home = city.name === B.city;
      const marker = L.marker([city.lat, city.lng], {
        icon: home ? pin('marker-pin--home', 18)
                   : pin(city.primary ? '' : 'marker-pin--small', city.primary ? 14 : 10),
        title: city.name,
        keyboard: false,
        alt: `${city.name}, WA`
      }).addTo(map);

      marker.bindPopup(home
        ? `<strong>${esc(city.name)}, WA</strong><br>Where we're based`
        : `<strong>${esc(city.name)}, WA</strong><br>In our service area`);
    });

    // scroll wheel zoom only once the visitor commits by clicking the map
    map.on('click', () => map.scrollWheelZoom.enable());
    map.on('mouseout', () => map.scrollWheelZoom.disable());

    // Leaflet needs a nudge when it's laid out inside a just-revealed panel
    setTimeout(() => map.invalidateSize(), 250);
  }

  /* ---------- contact-section mini map ---------- */
  function buildContactMap() {
    if (typeof L === 'undefined') return;
    const holder = $('#contactMap');
    if (!holder) return;

    // This one pins the office, so it always sits on the home city.
    const hub = SA.radiusCenter || SA.mapCenter;

    const map = L.map(holder, {
      center: [hub.lat, hub.lng],
      zoom: 12,
      scrollWheelZoom: false, dragging: false,
      zoomControl: false, attributionControl: true
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.marker([hub.lat, hub.lng], {
      icon: L.divIcon({
        className: '', html: '<div class="marker-pin marker-pin--home"></div>',
        iconSize: [18, 18], iconAnchor: [9, 9]
      }),
      alt: `Bellwood Construction, ${B.city}, ${B.state}`
    }).addTo(map).bindPopup(`<strong>${esc(B.legalName)}</strong><br>${esc(B.city)}, ${esc(B.state)}`);

    setTimeout(() => map.invalidateSize(), 250);
  }

  /* ---------- the checker ---------- */
  const normalise = s => String(s).toLowerCase()
    .replace(/[.,]/g, ' ')
    .replace(/\b(wa|washington|usa|us)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  function check(raw) {
    const q = normalise(raw);
    if (!q) return { ok: null, message: 'Type a city or ZIP code and we\'ll tell you.' };

    // ZIP first — five digits anywhere in the string
    const zip = (q.match(/\b(\d{5})\b/) || [])[1];
    if (zip) {
      if (SA.zips.includes(zip)) {
        // If they typed "Everett 98201" we can name the city back to them;
        // a bare ZIP gets its own phrasing so the sentence still reads right.
        const city = SA.cities.find(c => normalise(c.name) === q.replace(zip, '').trim());
        return city
          ? { ok: true, place: city.name }
          : { ok: true, place: zip, isZip: true };
      }
      return { ok: false, place: zip };
    }

    // then city name, including the alias list
    const alias = SA.aliases[q];
    const match = SA.cities.find(c => normalise(c.name) === q || (alias && c.name === alias));
    if (match) return { ok: true, place: match.name };

    // last chance: a partial match, so "mill" finds "Mill Creek"
    const partial = SA.cities.find(c => normalise(c.name).startsWith(q) && q.length >= 3);
    if (partial) return { ok: true, place: partial.name };

    return { ok: false, place: raw.trim() };
  }

  function init() {
    buildMap();
    buildContactMap();

    // city chips
    const list = $('#areaCityList');
    if (list) {
      SA.cities.filter(c => c.primary)
        .forEach(c => list.appendChild(el('li', { text: c.name })));
      list.appendChild(el('li', { text: '+ surrounding areas' }));
    }

    // the form
    const form   = $('#areaChecker');
    const input  = $('#areaInput');
    const result = $('#areaResult');

    form?.addEventListener('submit', e => {
      e.preventDefault();
      const r = check(input.value);
      result.classList.remove('is-yes', 'is-no');

      if (r.ok === null) { result.textContent = r.message; return; }

      if (r.ok) {
        result.classList.add('is-yes');
        const template = r.isZip ? (SA.hitMessageZip || SA.hitMessage) : SA.hitMessage;
        result.textContent = template.replace('{place}', r.place);
      } else {
        result.classList.add('is-no');
        result.textContent = SA.missMessage;
      }
    });

    // clear the old answer as soon as they start retyping
    input?.addEventListener('input', () => {
      if (result.textContent) {
        result.textContent = '';
        result.classList.remove('is-yes', 'is-no');
      }
    });
  }
  return { init, check };
})();


/* ==========================================================================
   K. BOOKING — calendar, slots, confirmation, .ics
   ========================================================================== */
const Booking = (() => {
  const BK = CFG.booking;

  let viewYear, viewMonth;          // month currently drawn
  let chosenDate = null;            // 'YYYY-MM-DD'
  let chosenSlot = null;            // hour, 24h

  /* ---------- date helpers ---------- */
  const pad = n => String(n).padStart(2, '0');
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseYmd = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };

  const today = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };

  function firstBookable() {
    const d = today();
    d.setDate(d.getDate() + BK.leadTimeDays);
    return d;
  }
  function lastBookable() {
    const d = today();
    d.setDate(d.getDate() + BK.bookingWindowDays);
    return d;
  }

  /** Slot hours available on a given Date, or [] if we're closed. */
  function slotsFor(date) {
    const rule = BK.weekly[date.getDay()];
    if (!rule) return [];
    if (BK.blackoutDates.includes(ymd(date))) return [];
    const out = [];
    for (let h = rule.start; h < rule.end; h += BK.slotMinutes / 60) out.push(h);
    return out;
  }

  function isBookable(date) {
    if (date < firstBookable() || date > lastBookable()) return false;
    return slotsFor(date).length > 0;
  }

  const hourLabel = h => {
    const ampm = h >= 12 ? 'pm' : 'am';
    const hr = h % 12 === 0 ? 12 : h % 12;
    return `${hr}:00 ${ampm}`;
  };

  /* ---------- calendar ---------- */
  function drawMonth() {
    const grid  = $('#calGrid');
    const title = $('#calTitle');
    grid.replaceChildren();

    const first = new Date(viewYear, viewMonth, 1);
    title.textContent = first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // leading blanks so the 1st lands on the right weekday
    for (let i = 0; i < first.getDay(); i++) {
      grid.appendChild(el('div', { class: 'cal__cell', 'aria-hidden': 'true' }));
    }

    const days = new Date(viewYear, viewMonth + 1, 0).getDate();
    const todayStr = ymd(today());

    for (let d = 1; d <= days; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const key  = ymd(date);
      const open = isBookable(date);

      const btn = el('button', {
        class: 'cal__day' + (key === todayStr ? ' is-today' : ''),
        type: 'button',
        disabled: !open,
        'aria-pressed': String(chosenDate === key),
        'aria-label': date.toLocaleDateString('en-US',
          { weekday: 'long', month: 'long', day: 'numeric' }) +
          (open ? '' : ' — unavailable'),
        text: String(d)
      });

      if (open) btn.addEventListener('click', () => selectDate(key));
      grid.appendChild(el('div', { class: 'cal__cell' }, [btn]));
    }

    // month nav limits
    const minMonth = new Date(firstBookable().getFullYear(), firstBookable().getMonth(), 1);
    const maxMonth = new Date(lastBookable().getFullYear(), lastBookable().getMonth(), 1);
    const viewed   = new Date(viewYear, viewMonth, 1);
    $('#calPrev').disabled = viewed <= minMonth;
    $('#calNext').disabled = viewed >= maxMonth;
  }

  function selectDate(key) {
    chosenDate = key;
    chosenSlot = null;
    drawMonth();
    drawSlots();
  }

  function drawSlots() {
    const holder = $('#slotList');
    holder.replaceChildren();

    if (!chosenDate) {
      holder.appendChild(el('p', { class: 'slots__empty', text: 'Choose a date to see open times.' }));
      return;
    }

    const date  = parseYmd(chosenDate);
    const hours = slotsFor(date);

    $('#slotsHeading').textContent =
      date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    if (!hours.length) {
      holder.appendChild(el('p', { class: 'slots__empty', text: 'No times available that day.' }));
      return;
    }

    hours.forEach(h => {
      const btn = el('button', {
        class: 'slot', type: 'button',
        'aria-pressed': String(chosenSlot === h),
        text: hourLabel(h)
      });
      btn.addEventListener('click', () => {
        chosenSlot = h;
        $$('.slot', holder).forEach(s => s.setAttribute('aria-pressed', String(s === btn)));
        $('#bookingError').textContent = '';
      });
      holder.appendChild(btn);
    });
  }

  /* ---------- timezone-correct .ics ----------
     Works out the real UTC instant for a Pacific wall-clock time, so the
     event lands correctly whichever timezone the visitor's device is in
     and whichever side of a DST change the appointment falls on. */
  function offsetMs(utcMs, tz) {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    const parts = {};
    dtf.formatToParts(new Date(utcMs)).forEach(p => { parts[p.type] = p.value; });
    const asUTC = Date.UTC(
      Number(parts.year), Number(parts.month) - 1, Number(parts.day),
      Number(parts.hour) % 24, Number(parts.minute), Number(parts.second)
    );
    return asUTC - utcMs;
  }

  function zonedToUtc(y, m, d, h, tz) {
    const guess = Date.UTC(y, m - 1, d, h, 0, 0);
    // two passes settle the DST edge cases
    let utc = guess - offsetMs(guess, tz);
    utc = guess - offsetMs(utc, tz);
    return new Date(utc);
  }

  const icsStamp = date =>
    date.getUTCFullYear() + pad(date.getUTCMonth() + 1) + pad(date.getUTCDate()) + 'T' +
    pad(date.getUTCHours()) + pad(date.getUTCMinutes()) + '00Z';

  /** Fold long lines to 75 octets, as iCalendar requires. */
  function fold(line) {
    if (line.length <= 73) return line;
    const chunks = [line.slice(0, 73)];
    let rest = line.slice(73);
    while (rest.length > 72) { chunks.push(' ' + rest.slice(0, 72)); rest = rest.slice(72); }
    if (rest) chunks.push(' ' + rest);
    return chunks.join('\r\n');
  }

  const icsEscape = s => String(s)
    .replace(/\\/g, '\\\\').replace(/;/g, '\\;')
    .replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

  function buildIcs(data) {
    const [y, m, d] = data.date.split('-').map(Number);
    const start = zonedToUtc(y, m, d, data.hour, BK.timezone);
    const end   = new Date(start.getTime() + BK.slotMinutes * 60000);

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Bellwood Construction LLC//Consultation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:bellwood-${data.date}-${data.hour}-${Date.now()}@bellwoodconstruction`,
      `DTSTAMP:${icsStamp(new Date())}`,
      `DTSTART:${icsStamp(start)}`,
      `DTEND:${icsStamp(end)}`,
      fold(`SUMMARY:${icsEscape(`${B.name} — in-home consultation`)}`),
      fold(`DESCRIPTION:${icsEscape(
        `${BK.durationLabel} ${BK.locationLabel.toLowerCase()} with ${B.legalName}.\n` +
        `Project type: ${data.projectType}\n` +
        `Questions? Call ${B.phone} or email ${B.email}.\n\n` +
        `This is a requested time. We'll confirm it with you within one business day.`
      )}`),
      fold(`LOCATION:${icsEscape(data.address)}`),
      'STATUS:TENTATIVE',
      'BEGIN:VALARM',
      'TRIGGER:-PT1H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Bellwood Construction consultation in 1 hour',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ];
    return lines.join('\r\n');
  }

  /* ---------- submit ---------- */
  function collect() {
    return {
      date: chosenDate,
      hour: chosenSlot,
      name:    $('#bkName').value.trim(),
      phone:   $('#bkPhone').value.trim(),
      email:   $('#bkEmail').value.trim(),
      address: $('#bkAddress').value.trim(),
      projectType: $('#bkType').value
    };
  }

  function showConfirmation(data, sent) {
    const date = parseYmd(data.date);
    const pretty = date.toLocaleDateString('en-US',
      { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    $('#bookingForm').hidden = true;
    const panel = $('#bookingConfirm');
    panel.hidden = false;

    $('#confirmLede').textContent = sent
      ? `Thanks ${data.name.split(' ')[0]} — we've got your request and we'll confirm within one business day.`
      : `Here's your requested time. One more tap to send it to us.`;

    const dl = $('#confirmSummary');
    dl.replaceChildren();
    [
      ['When',    `${pretty} at ${hourLabel(data.hour)} ${BK.timezoneLabel}`],
      ['How long', BK.durationLabel],
      ['Where',   data.address],
      ['Project', data.projectType],
      ['Contact', `${data.phone} · ${data.email}`]
    ].forEach(([k, v]) => {
      dl.appendChild(el('dt', { text: k }));
      dl.appendChild(el('dd', { text: v }));
    });

    // .ics download
    const ics  = buildIcs(data);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const link = $('#icsDownload');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `bellwood-consultation-${data.date}.ics`);

    // If no endpoint is wired up, hand them a pre-filled email instead of
    // pretending the request went somewhere.
    const fallback = $('#confirmFallback');
    if (!sent) {
      const subject = encodeURIComponent(`Consultation request — ${pretty}, ${hourLabel(data.hour)}`);
      const body = encodeURIComponent(
        `Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\n` +
        `Address: ${data.address}\nProject: ${data.projectType}\n` +
        `Requested: ${pretty} at ${hourLabel(data.hour)} ${BK.timezoneLabel}\n`);
      fallback.innerHTML =
        `No form service is connected yet, so nothing has been sent. ` +
        `<a class="link" href="${B.emailHref}?subject=${subject}&body=${body}">` +
        `Send this request by email</a> or call <a class="link" href="${B.phoneHref}">${esc(B.phone)}</a>.`;
    } else {
      fallback.textContent = '';
    }

    panel.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
  }

  async function submit(e) {
    e.preventDefault();
    const errBox = $('#bookingError');
    errBox.textContent = '';

    if (!chosenDate || chosenSlot === null) {
      errBox.textContent = 'Please pick a date and a time first.';
      $('#calGrid').scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
      return;
    }

    if (!Validate.form($('#bookingForm'))) {
      errBox.textContent = 'Please check the highlighted fields.';
      return;
    }

    // honeypot
    if ($('#bkCompany').value) return;

    const data = collect();
    const btn  = $('#bookingSubmit');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    let sent = false;
    if (CFG.forms.bookingEndpoint) {
      const date = parseYmd(data.date);
      sent = await Submit.send(CFG.forms.bookingEndpoint, {
        _subject: `Consultation request — ${data.name}`,
        form: 'Book a Visit',
        name: data.name, phone: data.phone, email: data.email,
        address: data.address, projectType: data.projectType,
        requestedDate: date.toLocaleDateString('en-US',
          { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
        requestedTime: `${hourLabel(data.hour)} ${BK.timezoneLabel}`
      });
      if (!sent) {
        btn.disabled = false;
        btn.textContent = 'Request this time';
        errBox.innerHTML = `That didn't go through. Please call ` +
          `<a class="link" href="${B.phoneHref}">${esc(B.phone)}</a> and we'll book you in.`;
        return;
      }
    }

    showConfirmation(data, sent);
  }

  function init() {
    if (!$('#calGrid')) return;

    // open on the first month that contains a bookable day
    const start = firstBookable();
    viewYear = start.getFullYear();
    viewMonth = start.getMonth();

    $('#slotsTz').textContent = `All times ${BK.timezoneLabel} · ${BK.durationLabel} ${BK.locationLabel.toLowerCase()}`;

    // project type dropdown, straight from the services list
    const select = $('#bkType');
    select.appendChild(el('option', { value: '', text: 'Choose one…' }));
    CFG.services.forEach(s => select.appendChild(el('option', { value: s.title, text: s.title })));
    select.appendChild(el('option', { value: 'Something else', text: 'Something else' }));

    $('#calPrev').addEventListener('click', () => {
      viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      drawMonth();
    });
    $('#calNext').addEventListener('click', () => {
      viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      drawMonth();
    });

    drawMonth();
    drawSlots();

    $('#bookingForm').addEventListener('submit', submit);

    $('#bookingReset').addEventListener('click', () => {
      chosenDate = null; chosenSlot = null;
      $('#bookingForm').reset();
      $$('.field', $('#bookingForm')).forEach(f => f.classList.remove('has-error'));
      $$('.field__err', $('#bookingForm')).forEach(f => (f.textContent = ''));
      $('#bookingConfirm').hidden = true;
      $('#bookingForm').hidden = false;
      const btn = $('#bookingSubmit');
      btn.disabled = false; btn.textContent = 'Request this time';
      drawMonth(); drawSlots();
      $('#book').scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });

    Validate.live($('#bookingForm'));
  }

  return { init };
})();


/* ==========================================================================
   VALIDATION + SUBMISSION (shared by all three forms)
   ========================================================================== */
const Validate = (() => {
  const MESSAGES = {
    bkName: 'We\'ll need a name for the appointment.',
    qName:  'What should we call you?',
    cName:  'What should we call you?',
    bkPhone: 'A phone number we can reach you on, please.',
    qPhone:  'A phone number we can reach you on, please.',
    bkEmail: 'That email doesn\'t look right — mind checking it?',
    qEmail:  'That email doesn\'t look right — mind checking it?',
    cEmail:  'That email doesn\'t look right — mind checking it?',
    bkAddress: 'Where are we coming out to?',
    qAddress:  'Where\'s the project?',
    bkType: 'Pick the closest project type.',
    qTimeline: 'Roughly when would you like to start?',
    qDescription: 'Tell us a little about the project — even a sentence helps.',
    cMessage: 'What would you like to ask?'
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  /** 10 digits, ignoring brackets, dashes, spaces and a leading +1. */
  const phoneOk = v => {
    const digits = v.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
    return digits.length === 10;
  };

  function fieldError(input) {
    const v = input.value.trim();
    if (input.required && !v) return MESSAGES[input.id] || 'This one\'s required.';
    if (!v) return '';
    if (input.type === 'email' && !EMAIL_RE.test(v)) return MESSAGES[input.id] || 'Check the email address.';
    if (input.type === 'tel' && !phoneOk(v)) return 'Please enter a 10-digit phone number.';
    if (input.id === 'qDescription' && v.length < 10) return 'A little more detail, please — even one sentence.';
    return '';
  }

  function mark(input, message) {
    const field = input.closest('.field');
    const out = document.querySelector(`[data-err-for="${input.id}"]`);
    field?.classList.toggle('has-error', !!message);
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (out) out.textContent = message;
    return !message;
  }

  /** Validate every visible required control inside `scope`. */
  function form(scope) {
    const inputs = $$('input, select, textarea', scope).filter(i =>
      !i.closest('.hp') && !i.closest('[hidden]') && i.type !== 'file');
    let ok = true, firstBad = null;
    inputs.forEach(i => {
      const msg = fieldError(i);
      if (!mark(i, msg)) { ok = false; firstBad = firstBad || i; }
    });
    firstBad?.focus();
    return ok;
  }

  /** Clear an error as soon as the visitor fixes it. */
  function live(scope) {
    $$('input, select, textarea', scope).forEach(i => {
      if (i.closest('.hp')) return;
      i.addEventListener('blur', () => { if (i.value.trim()) mark(i, fieldError(i)); });
      i.addEventListener('input', () => {
        if (i.closest('.field')?.classList.contains('has-error')) mark(i, fieldError(i));
      });
    });
  }

  return { form, live, field: fieldError, mark };
})();

const Submit = (() => {
  /**
   * POST to a form backend (Formspree, Netlify, Basin — anything that
   * accepts a plain POST). Returns true on success.
   * `files` is optional; when present we send multipart instead of JSON.
   */
  async function send(endpoint, data, files) {
    try {
      let res;
      if (files && files.length) {
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => fd.append(k, v));
        files.forEach((f, i) => fd.append(`photo${i + 1}`, f, f.name));
        res = await fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      } else {
        res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data)
        });
      }
      return res.ok;
    } catch (err) {
      return false;
    }
  }
  return { send };
})();


/* ==========================================================================
   L. QUOTE WIZARD
   ========================================================================== */
const Quote = (() => {
  const TOTAL = 4;
  let step = 1;
  let photos = [];                 // File objects
  const picks = { projectType: '', budget: '', contactMethod: '' };

  /* ---------- radiogroup pickers ---------- */
  function buildPicker(holder, options, key, withIcons) {
    holder.replaceChildren();

    options.forEach((opt, i) => {
      const value = typeof opt === 'string' ? opt : opt.title;
      const icon  = typeof opt === 'string' ? null : opt.icon;

      const btn = el('button', {
        class: 'pick', type: 'button',
        role: 'radio',
        'aria-checked': 'false',
        'data-value': value,
        tabindex: i === 0 ? '0' : '-1',
        html: (withIcons && icon ? iconSvg(icon) : '') + `<span>${esc(value)}</span>`
      });

      btn.addEventListener('click', () => select(holder, key, btn));

      // arrow-key roving focus, the way a radiogroup should behave
      btn.addEventListener('keydown', e => {
        const all = $$('.pick', holder);
        const idx = all.indexOf(btn);
        let next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = all[(idx + 1) % all.length];
        if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   next = all[(idx - 1 + all.length) % all.length];
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); select(holder, key, btn); return; }
        if (!next) return;
        e.preventDefault();
        select(holder, key, next);
        next.focus();
      });

      holder.appendChild(btn);
    });
  }

  function select(holder, key, btn) {
    picks[key] = btn.dataset.value;
    $$('.pick', holder).forEach(p => {
      const on = p === btn;
      p.setAttribute('aria-checked', String(on));
      p.tabIndex = on ? 0 : -1;
    });
    const err = document.querySelector(`[data-err-for="${key}"]`);
    if (err) err.textContent = '';
  }

  /* ---------- photos ---------- */
  function addFiles(fileList) {
    const err = document.querySelector('[data-err-for="photos"]');
    err.textContent = '';
    const max = CFG.quoteForm.maxPhotos;

    Array.from(fileList).forEach(file => {
      if (photos.length >= max) {
        err.textContent = `That's the limit — ${max} photos. Remove one to add another.`;
        return;
      }
      if (!file.type.startsWith('image/')) {
        err.textContent = 'Photos only, please (JPG, PNG or HEIC).';
        return;
      }
      if (file.size > CFG.quoteForm.maxPhotoSizeMB * 1024 * 1024) {
        err.textContent = `${file.name} is over ${CFG.quoteForm.maxPhotoSizeMB}MB. Try a smaller version.`;
        return;
      }
      if (photos.some(p => p.name === file.name && p.size === file.size)) return;  // dedupe
      photos.push(file);
    });

    drawPreviews();
  }

  function drawPreviews() {
    const list = $('#previews');
    list.replaceChildren();

    photos.forEach((file, i) => {
      const url = URL.createObjectURL(file);
      const item = el('li', { class: 'preview' }, [
        el('img', { src: url, alt: `Photo you added: ${file.name}`,
          onload: () => URL.revokeObjectURL(url) }),
        el('button', {
          class: 'preview__del', type: 'button',
          'aria-label': `Remove ${file.name}`,
          html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                   stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
          onclick: () => { photos.splice(i, 1); drawPreviews(); $('#dropZone').focus(); }
        }),
        el('p', { class: 'preview__name', text: file.name })
      ]);
      list.appendChild(item);
    });

    $('#dropHint').textContent = photos.length
      ? `${photos.length} of ${CFG.quoteForm.maxPhotos} photos added. Optional, but they help us quote accurately.`
      : `Up to ${CFG.quoteForm.maxPhotos} photos. Optional, but they help us quote accurately.`;
  }

  /* ---------- steps ---------- */
  function validateStep(n) {
    let ok = true;
    const setErr = (key, msg) => {
      const box = document.querySelector(`[data-err-for="${key}"]`);
      if (box) box.textContent = msg;
      if (msg) ok = false;
    };

    if (n === 1) {
      setErr('projectType', picks.projectType ? '' : 'Pick the closest match — we can refine it later.');
      const tl = $('#qTimeline');
      if (!Validate.mark(tl, Validate.field(tl))) ok = false;

    } else if (n === 2) {
      setErr('budget', picks.budget ? '' : 'A rough range is fine — it helps us suggest real options.');
      const d = $('#qDescription');
      if (!Validate.mark(d, Validate.field(d))) ok = false;

    } else if (n === 3) {
      setErr('contactMethod', picks.contactMethod ? '' : 'How would you rather hear back?');

    } else if (n === 4) {
      ['#qName', '#qPhone', '#qEmail', '#qAddress'].forEach(sel => {
        const i = $(sel);
        if (!Validate.mark(i, Validate.field(i))) ok = false;
      });
    }
    return ok;
  }

  function show(n) {
    step = n;
    $$('.step').forEach(s => {
      const on = Number(s.dataset.step) === n;
      s.hidden = !on;
      s.classList.toggle('is-active', on);
    });

    $('#progressFill').style.width = `${(n / TOTAL) * 100}%`;
    $$('#progressSteps li').forEach((li, i) => {
      li.classList.toggle('is-active', i + 1 === n);
      li.classList.toggle('is-done', i + 1 < n);
    });
    $('#progressStatus').textContent = `Step ${n} of ${TOTAL}`;

    $('#quoteBack').hidden   = n === 1;
    $('#quoteNext').hidden   = n === TOTAL;
    $('#quoteSubmit').hidden = n !== TOTAL;
    $('#quoteError').textContent = '';

    if (n === TOTAL) drawReview();

    // move focus to the new step's heading so screen readers follow along
    const heading = $(`.step[data-step="${n}"] .step__title`);
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  function drawReview() {
    const dl = $('#quoteReview');
    dl.replaceChildren();
    const rows = [
      ['Project',  picks.projectType || '—'],
      ['Timeline', $('#qTimeline').value || '—'],
      ['Budget',   picks.budget || '—'],
      ['Details',  $('#qDescription').value.trim() || '—'],
      ['Photos',   photos.length ? `${photos.length} attached` : 'None'],
      ['Contact by', picks.contactMethod || '—']
    ];
    rows.forEach(([k, v]) => {
      dl.appendChild(el('dt', { text: k }));
      dl.appendChild(el('dd', { text: v }));
    });
  }

  /* ---------- submit ---------- */
  async function submit(e) {
    e.preventDefault();
    if (!validateStep(4)) {
      $('#quoteError').textContent = 'Please check the highlighted fields.';
      return;
    }
    if ($('#qWebsite').value) return;    // honeypot

    const btn = $('#quoteSubmit');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    const payload = {
      _subject: `Quote request — ${picks.projectType} — ${$('#qName').value.trim()}`,
      form: 'Quote Request',
      name:    $('#qName').value.trim(),
      email:   $('#qEmail').value.trim(),
      phone:   $('#qPhone').value.trim(),
      address: $('#qAddress').value.trim(),
      projectType: picks.projectType,
      timeline: $('#qTimeline').value,
      budget: picks.budget,
      description: $('#qDescription').value.trim(),
      preferredContact: picks.contactMethod,
      photosAttached: String(photos.length)
    };

    let sent = false;
    if (CFG.forms.quoteEndpoint) {
      sent = await Submit.send(CFG.forms.quoteEndpoint, payload, photos);
      if (!sent) {
        btn.disabled = false;
        btn.textContent = 'Send my request';
        $('#quoteError').innerHTML = `That didn't go through. Please call ` +
          `<a class="link" href="${B.phoneHref}">${esc(B.phone)}</a> or email ` +
          `<a class="link" href="${B.emailHref}">${esc(B.email)}</a>.`;
        return;
      }
    }

    $('#quoteForm').hidden = true;
    $('.progress').hidden = true;
    const panel = $('#quoteSuccess');
    panel.hidden = false;

    $('#quoteSuccessLede').textContent = sent
      ? `Thanks ${payload.name.split(' ')[0]} — we've got it. Expect to hear from us within one business day, by ${picks.contactMethod.toLowerCase()}.`
      : `Almost there — your request hasn't been sent yet.`;

    const fb = $('#quoteFallback');
    if (!sent) {
      const subject = encodeURIComponent(payload._subject);
      const body = encodeURIComponent(
        `Name: ${payload.name}\nPhone: ${payload.phone}\nEmail: ${payload.email}\n` +
        `Address: ${payload.address}\n\nProject: ${payload.projectType}\n` +
        `Timeline: ${payload.timeline}\nBudget: ${payload.budget}\n` +
        `Preferred contact: ${payload.preferredContact}\n\n${payload.description}\n`);
      fb.innerHTML =
        `No form service is connected yet, so nothing has been sent. ` +
        `<a class="link" href="${B.emailHref}?subject=${subject}&body=${body}">` +
        `Send this by email</a>${photos.length ? ' (you\'ll need to attach your photos again)' : ''}, ` +
        `or call <a class="link" href="${B.phoneHref}">${esc(B.phone)}</a>.`;
    } else {
      fb.textContent = '';
    }

    panel.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
  }

  /* ---------- public: jump here from a service card ---------- */
  function openWith(serviceId) {
    const svc = CFG.services.find(s => s.id === serviceId);
    if (svc) {
      const holder = $('#typePicker');
      const btn = $$('.pick', holder).find(p => p.dataset.value === svc.title);
      if (btn) select(holder, 'projectType', btn);
      const bk = $('#bkType');
      if (bk) bk.value = svc.title;
    }
    show(1);
    scrollToId('quote');
  }

  function init() {
    if (!$('#quoteForm')) return;

    buildPicker($('#typePicker'), CFG.services, 'projectType', true);
    buildPicker($('#budgetPicker'), CFG.quoteForm.budgets, 'budget', false);
    buildPicker($('#contactPicker'), CFG.quoteForm.contactMethods, 'contactMethod', false);

    const tl = $('#qTimeline');
    tl.appendChild(el('option', { value: '', text: 'Choose one…' }));
    CFG.quoteForm.timelines.forEach(t => tl.appendChild(el('option', { value: t, text: t })));

    drawPreviews();

    // --- drop zone ---
    const drop  = $('#dropZone');
    const input = $('#photoInput');

    drop.addEventListener('click', () => input.click());
    drop.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
    });
    input.addEventListener('change', () => { addFiles(input.files); input.value = ''; });

    ['dragenter', 'dragover'].forEach(type =>
      drop.addEventListener(type, e => { e.preventDefault(); drop.classList.add('is-over'); }));
    ['dragleave', 'drop'].forEach(type =>
      drop.addEventListener(type, e => { e.preventDefault(); drop.classList.remove('is-over'); }));
    drop.addEventListener('drop', e => {
      if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
    });

    // --- wizard nav ---
    $('#quoteNext').addEventListener('click', () => {
      if (!validateStep(step)) {
        $('#quoteError').textContent = 'Just one or two things to finish on this step.';
        return;
      }
      show(Math.min(step + 1, TOTAL));
    });
    $('#quoteBack').addEventListener('click', () => show(Math.max(step - 1, 1)));
    $('#quoteForm').addEventListener('submit', submit);

    // Enter shouldn't skip a step from inside a text input
    $('#quoteForm').addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && step < TOTAL) {
        e.preventDefault();
        $('#quoteNext').click();
      }
    });

    Validate.live($('#quoteForm'));
    show(1);
  }

  return { init, openWith };
})();


/* ==========================================================================
   M. CONTACT FORM
   ========================================================================== */
const Contact = (() => {
  function init() {
    const form = $('#contactForm');
    if (!form) return;
    Validate.live(form);

    form.addEventListener('submit', async e => {
      e.preventDefault();
      $('#contactError').textContent = '';
      $('#contactSuccess').textContent = '';

      if (!Validate.form(form)) {
        $('#contactError').textContent = 'Please check the highlighted fields.';
        return;
      }
      if ($('#cUrl').value) return;   // honeypot

      const btn = $('button[type="submit"]', form);
      btn.disabled = true;
      btn.textContent = 'Sending…';

      const payload = {
        _subject: `Website question — ${$('#cName').value.trim()}`,
        form: 'Contact',
        name: $('#cName').value.trim(),
        email: $('#cEmail').value.trim(),
        message: $('#cMessage').value.trim()
      };

      let sent = false;
      if (CFG.forms.contactEndpoint) {
        sent = await Submit.send(CFG.forms.contactEndpoint, payload);
      }

      btn.disabled = false;
      btn.textContent = 'Send message';

      if (sent) {
        form.reset();
        $('#contactSuccess').textContent = 'Thanks — we\'ll get back to you shortly.';
      } else if (CFG.forms.contactEndpoint) {
        $('#contactError').innerHTML = `That didn't send. Please email ` +
          `<a class="link" href="${B.emailHref}">${esc(B.email)}</a> or call ` +
          `<a class="link" href="${B.phoneHref}">${esc(B.phone)}</a>.`;
      } else {
        const subject = encodeURIComponent(payload._subject);
        const body = encodeURIComponent(`${payload.message}\n\n— ${payload.name} (${payload.email})`);
        $('#contactError').innerHTML =
          `No form service is connected yet. ` +
          `<a class="link" href="${B.emailHref}?subject=${subject}&body=${body}">Send this by email</a> ` +
          `or call <a class="link" href="${B.phoneHref}">${esc(B.phone)}</a>.`;
      }
    });
  }
  return { init };
})();


/* ==========================================================================
   N. FOOTER
   ========================================================================== */
const Footer = (() => {
  const SOCIAL_ICONS = {
    Facebook:  '<path d="M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    Instagram: '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.4"/>',
    Google:    '<path d="M21.6 12.2c0-.7-.06-1.35-.18-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2a9.7 9.7 0 0 0 3-7.3z"/><path d="M12 22c2.7 0 4.96-.9 6.6-2.4l-3.2-2.5a6 6 0 0 1-9-3.2H3.1v2.6A10 10 0 0 0 12 22z"/><path d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9z"/><path d="M12 6a5.4 5.4 0 0 1 3.8 1.5l2.85-2.85A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.9 5.5l3.3 2.6A6 6 0 0 1 12 6z"/>'
  };

  function init() {
    // service-area links
    const areas = $('#footerAreas');
    if (areas) {
      CFG.serviceArea.cities.filter(c => c.primary).forEach(c =>
        areas.appendChild(el('li', { text: `${c.name}, WA` })));
      areas.appendChild(el('li', { text: '& surrounding areas' }));
    }

    // licence + insurance
    const lic = $('#footerLicense');
    if (lic) {
      lic.textContent =
        `${B.legalName} · WA Contractor License #${B.licenseNumber} · Licensed, bonded & insured.`;
    }

    // copyright with the live year
    const copy = $('#footerCopy');
    if (copy) copy.textContent = `© ${new Date().getFullYear()} ${B.legalName}. All rights reserved.`;

    // social — only render the ones that actually have a URL
    const social = $('#footerSocial');
    if (social) {
      B.social.filter(s => s.url && !isPlaceholder(s.url)).forEach(s => {
        social.appendChild(el('li', null, [
          el('a', {
            href: s.url, target: '_blank', rel: 'noopener noreferrer',
            'aria-label': `${B.name} on ${s.label}`,
            html: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${SOCIAL_ICONS[s.label] || ''}</svg>`
          })
        ]));
      });
    }
  }
  return { init };
})();


/* ==========================================================================
   FLOATING CALL BUTTON — hide it while a form is on screen so it never
   sits on top of a Submit button.
   ========================================================================== */
function initCallFab() {
  const fab = $('#callFab');
  if (!fab || !('IntersectionObserver' in window)) return;

  const zones = ['#quote', '#book', '#contact'].map(s => $(s)).filter(Boolean);
  const overlapping = new Set();

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) overlapping.add(en.target);
      else overlapping.delete(en.target);
    });
    fab.classList.toggle('is-hidden', overlapping.size > 0);
  }, { rootMargin: '-55% 0px -8% 0px' });

  zones.forEach(z => io.observe(z));
}


/* ==========================================================================
   BOOT
   ========================================================================== */
function boot() {
  Theme.init();
  Header.init();
  Identity.init();
  Placeholders.init();
  Services.init();
  Gallery.init();
  Lightbox.init();
  Process.init();
  ServiceArea.init();
  Booking.init();
  Quote.init();
  Contact.init();
  Footer.init();
  Reveal.init();
  initCallFab();

  // in-page anchors: respect reduced motion and the sticky header
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      scrollToId(id);
      history.replaceState(null, '', `#${id}`);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

// Quote needs to be reachable from the service cards, which are built
// before the module closure is assigned — expose it for safety.
window.Quote = Quote;

})();
