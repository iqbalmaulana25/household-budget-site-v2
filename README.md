# TataKas — Anggaran Rumah Tangga

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/iqbalmaulana25/household-budget-site-v2/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/iqbalmaulana25/household-budget-site-v2/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

Entry for the make.fun bounty [Make the best household budget site](https://make.fun/bounty/best-household-budget-site-20261126-1457).

**TataKas** is a working household budget site that runs entirely from its own
static files — open `app/index.html` in desktop Chrome or on a phone and every
figure, chart, form and calculator works with no network request. It follows
one fictional Indonesian household, the Mahesa family of Depok (two salaries,
two kids, a rented house), through November 2026: Rp 16.850.000 in, real
spending per category, nine recurring bills, and four savings goals.

## Pages

- **Ringkasan (`#/`)** — the month at a glance: income, spending, savings and
  what's left; a spending donut per category; every category's budget bar
  with over-budget flags; a 6-month cash-flow chart; upcoming bills; the two
  nearest goals; the latest transactions.
- **Transaksi (`#/transactions`)** — all 38 November transactions with text
  search, category and type filters, four sort orders, an add-transaction
  form and per-row delete. Edits persist in localStorage and flow through to
  every other page.
- **Tagihan (`#/bills`)** — the nine recurring bills (Rp 6.019.400/month) with
  due days, paid/unpaid status and a working "mark paid" toggle.
- **Target (`#/goals`)** — four savings goals (emergency fund, Yogyakarta
  trip, a laptop, a school admission fund) with progress, monthly set-asides,
  computed completion dates, and working top-up buttons.
- **Perencana (`#/planner`)** — editable per-category budgets, a 50/30/20
  split calculator with an income slider, and an emergency-fund calculator.
- **Panduan (`#/guide`)** — the family's written routine: a 30-minute
  month-start checklist, their adapted 67/11/18 split (and why textbook
  50/30/20 doesn't fit Depok), sinking funds, and the over-budget playbook —
  all with November's real figures.

## How it is built

- Plain static files under `app/`, no build step, no external requests:
  system font stack, hand-drawn inline SVG charts, no libraries at all.
- `app/data.js` — the seed ledger (categories, transactions, bills, goals,
  6-month history). `app/store.js` — state, localStorage persistence and all
  arithmetic. `app/format.js` — IDR and date formatting. `app/charts.js` —
  the SVG donut and bar charts. `app/main.js` — hash router that lazy-loads
  each page module under `app/pages/`, keeping the first load small.
- `main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
  to `/output` and writes `dossier.json` with the kit's
  `vendor/makefun-frontend.ts`, which is the kit copy, unchanged.

## Run it locally

```sh
node serve.ts        # then open http://localhost:8080
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # build the hand-in
```

See `shots.json` for the four views captured in `screenshots/` (three desktop
pages at 1280×800 and the goals page at phone size, 390×844).

## License

MIT — see `LICENSE`.

---

Entered by [@iqbal-maulana-2](https://make.fun) · referral: [hhk4ynvx](https://make.fun/?ref=hhk4ynvx)
