# 🛍️ Store Manager

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge&logo=cloudflare)](https://store-manager.brunadev.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**A high-performance, strategic product management dashboard engineered for scalability, real-time reactivity, and a premium professional user experience.**

Developed by **Bruna Menezes**.

---

## 🏛️ Architecture & Engineering Decisions

This project implements industry-standard patterns for modern Single Page Applications (SPAs), focusing on maintainability and robustness.

### 1. Hybrid Persistence Layer (State Sync Engine)
Since the external API is read-only, I implemented a custom synchronization engine in `productService.ts`. It intelligently merges API data with a persistent `LocalStorage` state.
*   **Rationale**: This ensures a "Real Database" user experience. Created products and local modifications persist across sessions, maintaining full referential integrity.

### 2. Clean Architecture & Separation of Concerns
The codebase follows strict decoupling principles to ensure scalability:
*   **Service Layer**: All HTTP interactions are abstracted. The view layer interacts only with service interfaces, making the application agnostic to the underlying data source.
*   **Business Logic Hooks**: All non-UI logic (filtering algorithms, favorites management, optimistic updates) is encapsulated in custom React Hooks. This keeps components lean, declarative, and highly testable.
*   **Data Normalization**: A dedicated layer ensures all user entries (names, categories) are automatically sanitized and formatted (Proper Case), preventing data duplication and maintaining a professional UI.

### 3. Reactive State Management with TanStack Query v5
I chose React Query over traditional state management for server-state handling:
*   **Optimistic Updates**: Immediate UI feedback on deletions and edits. The application updates the view before the server responds, providing an "instant-feel" UX.
*   **Intelligent Caching**: Automated background fetching and cache invalidation strategies ensure the dashboard is always up-to-date without redundant network requests.

---

## ✨ Features

### 🎯 Core Functionality
- **Full CRUD Support**: Secure creation, reading, updating, and deletion of products.
- **Advanced Filtering Engine**: 
  - Sub-second real-time search across titles and descriptions.
  - Multi-select category filtering with click-outside detection.
  - Dynamic range-based views.
- **Bulk Operations**: Simultaneous management and deletion of multiple records.
- **Resilient Undo Deletion**: A safe-guard "Undo" flow available on both dashboard and details pages via toast notifications.
- **Data Export**: Professional CSV export functionality for all filtered datasets.

### 🎨 User Experience
- **Fluid Visuals**: Modern design system using **Tailwind CSS v4** with glassmorphism effects and micro-animations.
- **360° Interaction**: Interactive "3D simulation" viewer for product details.
- **Zero CLS**: Comprehensive use of Skeleton Loaders to prevent layout shifts.
- **Responsive Layout**: Pixel-perfect adaptation across mobile, tablet, and ultra-wide displays.

---

## 🛠️ Tech Stack

| Layer | Technology | Key Decision Factor |
| :--- | :--- | :--- |
| **Foundation** | React 19 + Vite | Access to the latest concurrency features and sub-second HMR. |
| **Logic** | TanStack Query v5 | Superior cache management and built-in optimistic UI support. |
| **Styling** | Tailwind CSS v4 | Next-gen utility-first engine with native CSS variable support. |
| **Validation** | Zod | Runtime type safety and robust form data enforcement. |
| **State** | React Context | Clean management of cross-cutting concerns like favorites. |

---

## 📁 Project Structure

```bash
src/
├── components/
│   ├── forms/          # High-performance forms with Zod validation
│   ├── layout/         # Shell components (Sidebar, Navigation)
│   └── ui/             # Atomic design components (Button, Dialog, etc.)
├── contexts/           # Global application context (State & Logic)
├── hooks/              # Reusable business logic (useProducts, useFavorites)
├── lib/                # Shared utilities (Axios config, formatters)
├── pages/              # Route-level view components
├── services/           # Data access & persistence layer
└── types/              # Centralized TypeScript definitions
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20+
- **pnpm** (preferred) or npm

### Installation & Run
```bash
# 1. Clone & Enter
git clone https://github.com/CFBruna/store-manager-ui.git && cd store-manager-ui

# 2. Install
pnpm install

# 3. Development
pnpm dev
```
Access the application at `http://localhost:5173`.

### Key Scripts
- `pnpm build`: Optimizes the application for production.
- `pnpm lint`: Enforces code quality and formatting standards.
- `pnpm test`: Executes the Vitest test suite.

---

## 📝 License

Licensed under the MIT License.

---
**Developed by Bruna Menezes**
