# Nx Angular Stryker Demo Monorepo

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>
<a alt="Stryker logo" href="https://stryker-mutator.io" target="_blank" rel="noreferrer"><img src="https://stryker-mutator.io/images/stryker.png" width="45"></a>

✨ Production-Ready Angular 22 & Nx 23 Monorepo with @ngrx/signals, Vitest, and Stryker Mutation Testing ✨

---

## 📦 Project Overview

This repository demonstrates a modern, enterprise-grade Angular e-commerce monorepo built with:

- **2 Applications**
  - `shop` - Angular 22 e-commerce frontend application with SSR support
  - `api` - Node.js Express backend API with Docker support serving product data

- **11 Modular Libraries**
  - `@org/shop/cart` - Cart management engine (`@ngrx/signals` Signal Store + `CartWidgetComponent`)
  - `@org/shop/wishlist` - Wishlist & product comparison engine (`@ngrx/signals` Signal Store + `WishlistToggleComponent`)
  - `@org/shop/checkout` - Multi-step checkout wizard with Luhn credit card validation (`@ngrx/signals` Signal Store + `CheckoutWizardComponent`)
  - `@org/shop/search-filter` - Search & faceted filtering engine (`@ngrx/signals` Signal Store + `SearchFilterBarComponent`)
  - `@org/shop/loyalty` - Tiered loyalty rewards & voucher redemption (`@ngrx/signals` Signal Store + `LoyaltyStatusComponent`)
  - `@org/feature-products` - Product listing feature page (Angular)
  - `@org/feature-product-detail` - Product detail view feature page (Angular)
  - `@org/data` - Data access layer and HTTP product service
  - `@org/shared-ui` - Shared UI components (ProductCard, ProductGrid, ErrorMessage, LoadingSpinner)
  - `@org/models` - Shared TypeScript domain models & interfaces
  - `@org/products` - API product service library (Backend)

- **E2E & Unit Testing**
  - `shop-e2e` - Playwright E2E test suite
  - **Vitest & AnalogJS** - Fast unit testing for all Angular libraries (62/62 tests passing, 100% green)

- **Mutation Testing**
  - **Stryker Mutator** - Automated mutation testing runner with custom Vitest sandboxing configuration and HTML report artifact generation

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/kluth/cloud.kluth.stryker-demo.git
cd cloud.kluth.stryker-demo

# Install dependencies
npm install

# Serve the Angular shop application & backend API
npx nx run shop:serve

# Build all projects
npx nx run-many -t build

# Run unit tests across all projects
npx nx run-many -t test

# Run linting
npx nx run-many -t lint

# Run Playwright E2E tests
npx nx run shop-e2e:e2e
```

---

## 🧬 Stryker Mutation Testing

Stryker Mutator tests the quality of unit tests by introducing artificial bugs (mutants) into the source code and verifying that tests fail (kill the mutant).

### Running Mutation Tests with Nx

```bash
# Run Stryker for a specific library via Nx
npx nx run cart:stryker

# Run Stryker dry run (verify test setup without mutating)
npx nx run cart:stryker --args="--dryRunOnly"

# Run Stryker for all projects
npm run stryker
# or: npx nx run-many -t stryker

# Run Stryker for affected projects only (ideal for PRs)
npm run stryker:affected
# or: npx nx affected -t stryker

# Run Stryker workspace-wide
npx stryker run
```

---

## 📁 Repository Structure

```
├── .github/
│   └── workflows/
│       ├── ci.yml               - Continuous Integration pipeline
│       └── stryker.yml          - Stryker Mutation Testing & Artifact Upload pipeline
├── apps/
│   ├── shop/           [scope:shop]    - Angular 22 e-commerce app
│   ├── shop-e2e/                       - Playwright E2E tests
│   └── api/            [scope:api]     - Express backend API with Docker
├── packages/
│   ├── shop/
│   │   ├── cart/                [scope:shop,type:feature] - Cart Signal Store & Widget
│   │   ├── wishlist/            [scope:shop,type:feature] - Wishlist & Comparison Engine
│   │   ├── checkout/            [scope:shop,type:feature] - Checkout Wizard & Luhn Validator
│   │   ├── search-filter/       [scope:shop,type:feature] - Search & Faceted Filter Engine
│   │   ├── loyalty/             [scope:shop,type:feature] - Loyalty Rewards & Voucher System
│   │   ├── feature-products/        [scope:shop,type:feature] - Product listing
│   │   ├── feature-product-detail/  [scope:shop,type:feature] - Product details
│   │   ├── data/                    [scope:shop,type:data]    - Data access layer
│   │   └── shared-ui/               [scope:shop,type:ui]      - Shared UI components
│   ├── api/
│   │   └── products/    [scope:api]    - Backend product service
│   └── shared/
│       └── models/      [scope:shared,type:data] - Shared TypeScript models
├── reports/
│   └── mutation/       - Stryker HTML Mutation Testing Report (`mutation.html`)
├── nx.json             - Nx configuration with targetDefaults for test & stryker
├── stryker.config.json - Stryker Mutator configuration for Vitest runner
├── test-setup.ts       - Global Vitest & Angular TestBed test setup
├── tsconfig.base.json  - TypeScript path mappings
└── eslint.config.mjs   - ESLint with module boundary rules
```

---

## 🏷️ Module Boundaries & Tags

This workspace enforces strict architectural boundaries via Nx tags:

| Project                   | Tags                         | Allowed Imports              |
| ------------------------- | ---------------------------- | ---------------------------- |
| `shop`                    | `scope:shop`                 | `scope:shop`, `scope:shared` |
| `api`                     | `scope:api`                  | `scope:api`, `scope:shared`  |
| `cart`                    | `scope:shop`, `type:feature` | `scope:shop`, `scope:shared` |
| `wishlist`                | `scope:shop`, `type:feature` | `scope:shop`, `scope:shared` |
| `checkout`                | `scope:shop`, `type:feature` | `scope:shop`, `scope:shared` |
| `search-filter`           | `scope:shop`, `type:feature` | `scope:shop`, `scope:shared` |
| `loyalty`                 | `scope:shop`, `type:feature` | `scope:shop`, `scope:shared` |
| `feature-products`        | `scope:shop`, `type:feature` | `scope:shop`, `scope:shared` |
| `feature-product-detail` | `scope:shop`, `type:feature` | `scope:shop`, `scope:shared` |
| `data`                    | `scope:shop`, `type:data`    | `scope:shared`               |
| `shared-ui`               | `scope:shop`, `type:ui`      | `scope:shared`               |
| `models`                  | `scope:shared`, `type:data`  | Base models (no dependencies)|

---

## 🛠️ Useful Commands

```bash
# Interactive project dependency graph
npx nx graph

# Run unit tests for all 5 new signal store feature packages
npx nx run-many -t test -p cart wishlist checkout search-filter loyalty

# Run Stryker for affected projects
npx nx affected -t stryker

# Docker operations
npx nx run api:docker:build
npx nx run api:docker:run
```

---

## 📄 License

MIT © Matthias Kluth
