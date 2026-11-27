// main.js — boot and hash router.
// One job: decide which page module to show. Each page is a separate module
// loaded on first visit (import()), so the first load carries only this
// file, the store, the seed data and the formatters.

import { resetToSeed } from './store.js';

const ROUTES = {
  '/': { name: 'overview', load: () => import('./pages/overview.js') },
  '/transactions': { name: 'transactions', load: () => import('./pages/transactions.js') },
  '/bills': { name: 'bills', load: () => import('./pages/bills.js') },
  '/goals': { name: 'goals', load: () => import('./pages/goals.js') },
  '/planner': { name: 'planner', load: () => import('./pages/planner.js') },
  '/guide': { name: 'guide', load: () => import('./pages/guide.js') },
};

const pageRoot = document.getElementById('page');
const loadedModules = new Map();

function currentPath() {
  const hash = window.location.hash.replace(/^#/, '');
  return ROUTES[hash] ? hash : '/';
}

async function renderRoute() {
  const path = currentPath();
  const route = ROUTES[path];
  document.querySelectorAll('.main-nav a').forEach((link) => {
    link.classList.toggle('active', link.dataset.route === route.name);
  });
  if (!loadedModules.has(path)) {
    loadedModules.set(path, (await route.load()).default);
  }
  const page = loadedModules.get(path);
  pageRoot.replaceChildren();
  page(pageRoot, renderRoute);
  pageRoot.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', renderRoute);

document.getElementById('reset-data').addEventListener('click', () => {
  resetToSeed();
  renderRoute();
});

renderRoute();
