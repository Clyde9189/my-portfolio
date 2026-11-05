/* ==========================================================================
   ClydeDev portfolio: script
   1. DATA     (edit this section to update the site)
   2. HELPERS
   3. MODULES  (theme, nav, scroll, projects, journey, contact form, etc.)
   4. INIT
   No API keys, tokens or secrets belong in this file. It is public.
   ========================================================================== */

document.documentElement.classList.add('js');

/* --------------------------------------------------------------------------
   1. DATA
   -------------------------------------------------------------------------- */

const SITE = {
  email: 'clydecyan91@gmail.com',
  github: { user: 'Clyde9189', profile: 'https://github.com/Clyde9189' },
  // Add a real LinkedIn URL here to show the LinkedIn links (hero + footer).
  // Leave empty until an account exists. They stay hidden while this is ''.
  linkedin: '',
  // Set available: true after you add the file at assets/Clyde.cv.pdf
  cv: { path: '/assets/Clyde.cv.pdf', available: false },
};

/*
  Projects. To add one, copy an object and edit it.
  - categories: any of 'Web', 'C/C++', 'Java', 'JavaScript', 'Other'. Filter buttons
    are built only from categories that real projects use.
  - live: only set when a real deployment exists, otherwise leave as ''.
  - screenshot: path like 'assets/images/my-project.webp' plus screenshotAlt, or '' for none.
  - featured: true shows the project in the large spotlight card (the first one found).
  - caseStudy: leave a field as '' until you have real notes, and it shows as "to be written".
*/
const PROJECTS = [
  {
    id: 'parking-system',
    name: 'Parking System Project',
    featured: true,
    categories: ['Web'],
    summary:
      'A web-based parking system that shows available slots, records vehicle arrivals, calculates parking time and fees when a vehicle leaves, and opens the barrier once payment is made. Built for a Data Structures and Algorithms course and deployed online.',
    highlights: [
      'Shows available parking slots',
      'Records vehicle arrival',
      'Calculates time parked and the fee on exit',
      'Opens the barrier on payment',
    ],
    tech: ['Python', 'Flask', 'SQLite'],
    repo: 'https://github.com/Clyde9189/PARKING-SYSTEM.0.git',
    live: 'https://parking-system-0.onrender.com/',
    screenshot: '',
    screenshotAlt: '',
    caseStudy: {
      problem: '',
      approach: '',
      technology: '',
      challenges: '',
      solution: '',
      result: '',
      lessons: '',
    },
  },
];

/*
  Learning journey. status is one of:
  'foundation' (built a base), 'building' (actively developing), 'exploring' (early), 'ahead' (planned).
  Edit text or reorder freely.
*/
const JOURNEY = [
  { title: 'Programming fundamentals', status: 'foundation', text: 'Variables, control flow, functions and thinking in algorithms.' },
  { title: 'C and C++', status: 'foundation', text: 'Close-to-the-machine programming and data structures.' },
  { title: 'Java', status: 'foundation', text: 'Object-oriented programming and structuring larger programs.' },
  { title: 'HTML and CSS', status: 'foundation', text: 'Semantic markup and responsive layout. This site is hand-written.' },
  { title: 'JavaScript', status: 'building', text: 'Making pages interactive and organising code into small modules.' },
  { title: 'Git and GitHub', status: 'building', text: 'Version control, committing often and publishing work.' },
  { title: 'Software engineering', status: 'building', text: 'Designing, building, deploying and improving whole systems.' },
  { title: 'Artificial intelligence', status: 'exploring', text: 'Early exploration of the fundamentals and practical uses.' },
  { title: 'Cloud computing', status: 'exploring', text: 'Starting with deploying applications online.' },
  { title: 'Future technologies', status: 'ahead', text: 'Backend and APIs, databases, React and whatever comes next.' },
];

const STATUS_LABEL = { foundation: 'Foundation', building: 'Building', exploring: 'Exploring', ahead: 'Ahead' };

/* "Currently learning" list: edit as you progress. */
const LEARNING = [
  { name: 'Software engineering practices', note: 'designing and shipping complete projects' },
  { name: 'Artificial intelligence', note: 'fundamentals first' },
  { name: 'Cloud computing', note: 'deployment and hosting basics' },
];

/* --------------------------------------------------------------------------
   2. HELPERS
   -------------------------------------------------------------------------- */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Create an element safely (text is never parsed as HTML). */
function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of [].concat(children)) {
    if (child) node.append(child);
  }
  return node;
}

function safeStorage(action, key, value) {
  try {
    return action === 'get' ? localStorage.getItem(key) : localStorage.setItem(key, value);
  } catch (e) {
    return null;
  }
}

/* --------------------------------------------------------------------------
   3. MODULES
   -------------------------------------------------------------------------- */

/* ----- Theme ----- */
function initTheme() {
  const root = document.documentElement;
  const button = $('#themeToggle');
  const meta = $('meta[name="theme-color"]');

  const apply = (theme) => {
    root.setAttribute('data-theme', theme);
    button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#10161f' : '#f6f7f9');
  };

  apply(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  button.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    safeStorage('set', 'theme', next);
  });

  // Follow the system setting only while the visitor has not chosen a theme.
  const mq = window.matchMedia('(prefers-color-scheme: light)');
  const onSystemChange = (e) => {
    if (!safeStorage('get', 'theme')) apply(e.matches ? 'light' : 'dark');
  };
  if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
}

/* ----- Mobile navigation ----- */
function initNav() {
  const toggle = $('#navToggle');
  const menu = $('#primaryNav');
  const mobile = window.matchMedia('(max-width: 800px)');

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  // Hide the collapsed menu from keyboard and screen readers on mobile.
  const syncInert = () => {
    const hidden = mobile.matches && !menu.classList.contains('is-open');
    if (hidden) menu.setAttribute('inert', '');
    else menu.removeAttribute('inert');
  };

  toggle.addEventListener('click', () => {
    setOpen(!menu.classList.contains('is-open'));
    syncInert();
  });

  $$('.nav__link', menu).forEach((link) =>
    link.addEventListener('click', () => {
      setOpen(false);
      syncInert();
    })
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      setOpen(false);
      syncInert();
      toggle.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
      setOpen(false);
      syncInert();
    }
  });

  const onBreakpoint = () => {
    if (!mobile.matches) setOpen(false);
    syncInert();
  };
  if (mobile.addEventListener) mobile.addEventListener('change', onBreakpoint);
  syncInert();
}

/* ----- Active nav link (highlights the section in view) ----- */
function initActiveNav() {
  const links = $$('.nav__link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach((link) => {
    const active = new URL(link.href, window.location.href).pathname.split('/').pop() === currentPage;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

/* ----- Scroll: progress bar, header border, back-to-top ----- */
function initScroll() {
  const bar = $('#progressBar');
  const header = $('#siteHeader');
  const toTop = $('#toTop');
  let ticking = false;

  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const y = window.scrollY || doc.scrollTop;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    header.classList.toggle('is-scrolled', y > 8);
    toTop.hidden = y < 600;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  window.addEventListener('resize', update);
  update();

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
}

/* ----- Scroll reveal ----- */
let revealObserver = null;
function initReveal() {
  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    $$('.reveal').forEach((n) => n.classList.add('is-visible'));
    return;
  }
  revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  observeReveals();
}
function observeReveals(root = document) {
  const nodes = $$('.reveal:not(.is-visible)', root);
  if (!revealObserver) {
    nodes.forEach((n) => n.classList.add('is-visible'));
    return;
  }
  nodes.forEach((n) => revealObserver.observe(n));
}

/* ----- Projects ----- */
function projectShot(project, small = false) {
  if (project.screenshot) {
    return el('div', { class: 'shot' }, el('img', {
      src: project.screenshot,
      alt: project.screenshotAlt || `Screenshot of ${project.name}`,
      loading: 'lazy',
      decoding: 'async',
    }));
  }
  // Decorative stand-in until a real screenshot is added.
  return el('div', { class: 'shot', 'aria-hidden': 'true' }, el('div', { class: 'shot__window' }, [
    el('div', { class: 'shot__bar' }, [el('span'), el('span'), el('span')]),
    el('div', { class: 'shot__content' }, [
      el('strong', { text: project.name }),
      el('div', { class: 'shot__row' }),
      el('div', { class: 'shot__row shot__row--short' }),
      small ? null : el('div', { class: 'shot__row' }),
    ]),
  ]));
}

function techList(project) {
  const hasTech = project.tech && project.tech.length;
  const items = hasTech ? project.tech : ['Add project technologies'];
  return el('ul', { class: `tech${hasTech ? '' : ' tech--placeholder'}`, 'aria-label': 'Technologies used' },
    items.map((t) => el('li', { text: t })));
}

function projectActions(project) {
  const external = { target: '_blank', rel: 'noopener noreferrer' };
  const actions = [];
  if (project.live) {
    actions.push(el('a', { class: 'btn btn--primary', href: project.live, ...external }, [
      document.createTextNode('Live Demo'),
      el('span', { class: 'sr-only', text: ` of ${project.name} (opens in a new tab)` }),
    ]));
  }
  if (project.repo) {
    actions.push(el('a', { class: 'btn btn--ghost', href: project.repo, ...external }, [
      document.createTextNode('GitHub repository'),
      el('span', { class: 'sr-only', text: ` for ${project.name} (opens in a new tab)` }),
    ]));
  }
  actions.push(el('button', { class: 'btn btn--ghost', type: 'button', 'data-case': project.id }, [
    document.createTextNode('Case study'),
    el('span', { class: 'sr-only', text: ` for ${project.name}` }),
  ]));
  return el('div', { class: 'card-actions' }, actions);
}

function renderFeatured() {
  const host = $('#featuredProject');
  if (!host) return;
  const project = PROJECTS.find((p) => p.featured);
  if (!project) { host.hidden = true; return; }

  const body = el('div', { class: 'featured__body' }, [
    el('div', { class: 'btn-row' }, [
      el('span', { class: 'badge', text: 'Featured project' }),
      project.live ? el('span', { class: 'badge badge--live', text: 'Deployed and live online' }) : null,
    ]),
    el('h3', { class: 'featured__title', text: project.name }),
    el('p', { class: 'featured__desc', text: project.summary }),
    project.highlights && project.highlights.length
      ? el('ul', { class: 'featured__list' }, project.highlights.map((h) => el('li', { text: h })))
      : null,
    el('p', { class: 'meta-title', text: 'Technologies' }),
    techList(project),
    projectActions(project),
  ]);

  host.replaceChildren(body, projectShot(project));
}

function renderProjectGrid(filter = 'All') {
  const grid = $('#projectGrid');
  if (!grid) return;
  const list = PROJECTS.filter((p) => !p.featured)
    .filter((p) => filter === 'All' || p.categories.includes(filter));

  if (!list.length) {
    grid.replaceChildren(el('p', { class: 'empty', text: PROJECTS.some((p) => !p.featured)
      ? 'No projects in this category yet.'
      : 'More projects will appear here as I build and ship them.' }));
    return;
  }

  grid.replaceChildren(...list.map((p) =>
    el('article', { class: 'project-card reveal' }, [
      projectShot(p, true),
      el('h4', { text: p.name }),
      el('p', { text: p.summary }),
      techList(p),
      projectActions(p),
    ])
  ));
  observeReveals(grid);
}

function initFilters() {
  const host = $('#projectFilters');
  if (!host) return;
  const order = ['Web', 'C/C++', 'Java', 'JavaScript', 'Other'];
  const used = order.filter((c) => PROJECTS.some((p) => p.categories.includes(c)));

  // A filter bar is only useful when there is more than one category to choose from.
  if (used.length < 2) { renderProjectGrid(); return; }

  const names = ['All', ...used];
  names.forEach((name, i) => {
    host.append(el('button', { class: 'filter', type: 'button', 'aria-pressed': String(i === 0), 'data-filter': name, text: name }));
  });
  host.hidden = false;

  host.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    $$('.filter', host).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    renderProjectGrid(btn.dataset.filter);
  });
  renderProjectGrid();
}

/* ----- Case study dialog ----- */
function initCaseStudies() {
  const dialog = $('#caseDialog');
  if (!dialog) return;
  const body = $('#caseBody');
  const title = $('#caseTitle');
  let opener = null;

  const SECTIONS = [
    ['problem', 'Problem', 'What problem was being addressed?'],
    ['approach', 'Approach', 'How was the problem approached?'],
    ['technology', 'Technology', 'Which technologies were used?'],
    ['challenges', 'Challenges', 'What challenges were encountered?'],
    ['solution', 'Solution', 'How were those challenges addressed?'],
    ['result', 'Result', 'What was achieved?'],
    ['lessons', 'Lessons learned', 'What was learned?'],
  ];

  function open(project, trigger) {
    opener = trigger;
    title.textContent = `${project.name}: case study`;
    const cs = project.caseStudy || {};
    const nodes = [];
    if (!SECTIONS.some(([key]) => cs[key])) {
      nodes.push(el('p', { class: 'cs__note', text: 'The full write-up for this project is still to come. The sections below will be filled in as I document it.' }));
    }
    SECTIONS.forEach(([key, label]) => {
      const text = cs[key] || (key === 'technology' && project.tech && project.tech.length ? project.tech.join(', ') : '');
      nodes.push(el('section', { class: 'cs' }, [
        el('h3', { text: label }),
        el('p', text ? { text } : { class: 'cs__pending', text: 'To be written.' }),
      ]));
    });
    body.replaceChildren(...nodes);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-case]');
    if (!btn) return;
    const project = PROJECTS.find((p) => p.id === btn.dataset.case);
    if (project) open(project, btn);
  });

  $('#caseClose').addEventListener('click', () => dialog.close());
  // Clicking the backdrop closes the dialog.
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { if (opener) opener.focus(); });
}

/* ----- Journey + learning ----- */
function renderJourney() {
  const timeline = $('#timeline');
  if (timeline) {
    timeline.replaceChildren(...JOURNEY.map((step) =>
      el('li', { class: 'timeline__item reveal', 'data-status': step.status }, [
        el('div', { class: 'timeline__head' }, [
          el('h3', { class: 'timeline__title', text: step.title }),
          el('span', { class: 'status', 'data-status': step.status, text: STATUS_LABEL[step.status] || step.status }),
        ]),
        el('p', { class: 'timeline__text', text: step.text }),
      ])
    ));
  }

  const learningList = $('#learningList');
  if (learningList) {
    learningList.replaceChildren(...LEARNING.map((item) =>
      el('li', {}, [el('strong', { text: item.name }), el('span', { text: item.note })])
    ));
  }
}

/* ----- Contact form (validation only; nothing is sent) ----- */
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;
  const status = $('#formStatus');
  const fields = {
    name: { input: $('#name'), error: $('#name-error') },
    email: { input: $('#email'), error: $('#email-error') },
    message: { input: $('#message'), error: $('#message-error') },
  };
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    name: (v) => (v.length < 2 ? 'Enter your name (at least 2 characters).' : ''),
    email: (v) => (!v ? 'Enter your email address.' : !emailPattern.test(v) ? 'Enter a valid email address, like name@example.com.' : ''),
    message: (v) => (v.length < 10 ? 'Write a message of at least 10 characters.' : ''),
  };

  function validate(key) {
    const { input, error } = fields[key];
    const message = rules[key](input.value.trim());
    error.textContent = message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener('blur', () => validate(key));
    fields[key].input.addEventListener('input', () => {
      if (fields[key].input.getAttribute('aria-invalid') === 'true') validate(key);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.replaceChildren();
    const results = Object.keys(fields).map((k) => [k, validate(k)]);
    const firstBad = results.find(([, ok]) => !ok);
    if (firstBad) {
      fields[firstBad[0]].input.focus();
      return;
    }

    const subject = `Portfolio message from ${fields.name.input.value.trim()}`;
    const bodyText = `${fields.message.input.value.trim()}\n\n${fields.name.input.value.trim()}\n${fields.email.input.value.trim()}`;
    const href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    status.append(
      document.createTextNode('Your message looks good. It has not been sent. '),
      el('a', { href, text: 'Open it as a draft in your email app' }),
      document.createTextNode('.')
    );
  });
}

/* ----- CV button ----- */
function initCv() {
  const button = $('#cvButton');
  if (!button) return;
  const note = $('#cvNote');
  button.setAttribute('href', SITE.cv.path);
  if (SITE.cv.available) return;

  button.setAttribute('aria-disabled', 'true');
  button.removeAttribute('download');
  button.setAttribute('aria-describedby', 'cvNote');
  note.hidden = false;
  button.addEventListener('click', (e) => e.preventDefault());
}

/* ----- LinkedIn (only shown when a real URL is set) ----- */
function initLinkedIn() {
  if (!SITE.linkedin) return;
  $$('[data-linkedin]').forEach((a) => {
    a.setAttribute('href', SITE.linkedin);
    a.hidden = false;
  });
}

/* ----- Footer year ----- */
function initYear() {
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
}

/* --------------------------------------------------------------------------
   4. INIT
   -------------------------------------------------------------------------- */

function init() {
  initTheme();
  initNav();
  initActiveNav();
  initScroll();
  initReveal();
  renderFeatured();
  initFilters();
  initCaseStudies();
  renderJourney();
  observeReveals();
  initContactForm();
  initCv();
  initLinkedIn();
  initYear();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
