# 🛍️ Store Manager

![Node Version](https://img.shields.io/badge/node-%3E=20-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)

**A modern, production-ready product management dashboard built with React 19, TypeScript, and Tailwind CSS v4.**

This application was developed as a technical challenge, exceeding the base requirements to demonstrate senior-level engineering, **Clean Architecture**, and robust state management.

---

## 🎯 Challenge Compliance & Seniority Audit

### ✅ Base Requirements (CRUD)
- [x] **Listagem**: Advanced grid/table view with real-time search and category filters.
- [x] **Detalhes**: Dynamic routing with complete product data display.
- [x] **Criação (Create)**: High-performance form with real-time validation and image preview.
- [x] **Edição (Update)**: Seamless item modification with data pre-filling.
- [x] **Exclusão (Delete)**: Safe deletion flow with "Undo" capability via toast.
- [x] **HTTP Client**: Robust integration with Fake Store API using **Axios + TanStack Query**.

### 🌟 Senior "Overdelivery" Highlights
- **Clean Architecture Principles**: Strict separation between Data (Services), Logic (Custom Hooks), and View (Components).
- **Hybrid Persistence Layer**: Implemented a LocalStorage synchronization engine to allow CRUD operations to persist across sessions, solving mock API limitations.
- **Type-Safety & Validation**: 100% TypeScript coverage with **Zod** schema enforcement for all data entries.
- **Professional UX Patterns**: Skeleton loading for zero CLS, optimistic updates for instant feedback, and global error boundaries.
- **Automated Testing**: Unit tests implemented for critical business logic using Vitest and Testing Library.

---

## ✨ Features

### 🎯 Core Functionality
- **Complete CRUD Operations**: Create, read, update, and delete products with full API integration
- **Advanced Filtering System**: 
  - Real-time search across product names and descriptions
  - Multi-select category filtering with auto-close on click-outside
  - Dynamic price range slider
- **Favorites Management**: Star/unstar products and view them in a dedicated Favorites page
- **Bulk Operations**: Select and delete multiple products simultaneously
- **Undo Delete**: One-click restoration of deleted items via toast notifications
- **Data Export**: Export filtered product lists to CSV format
- **Smart Category Management**: 
  - Autocomplete for existing categories
  - Seamless creation of new categories
  - Automatic normalization to prevent duplicates

### 🎨 User Experience
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Professional Dashboard Layout**: Collapsible sidebar, persistent header, breadcrumb navigation
- **Real-time Metrics**: Dynamic product count, stock levels, and inventory value
- **Loading States**: Skeleton screens and smooth transitions
- **Toast Notifications**: Non-intrusive feedback for all user actions
- **Error Boundaries**: Graceful degradation with custom error pages
- **Accessible UI**: Keyboard navigation, ARIA labels, and semantic HTML

### 🏗️ Technical Highlights
- **Type-Safe Forms**: React Hook Form + Zod validation schemas
- **Server State Management**: TanStack Query with caching and background sync
- **Optimistic Updates**: Instant UI feedback with automatic rollback on errors
- **Client-Side Persistence**: Local storage for favorites and user preferences
- **Clean Architecture**: Separation of concerns with services, hooks, and components
- **Custom Hooks**: Reusable logic for products, mutations, favorites, and click-outside detection
- **Data Normalization**: Automatic trimming and formatting to maintain data integrity

---

## 🛠️ Tech Stack

### Core
- **React 19** - Latest features including automatic batching and improved concurrency
- **TypeScript 5.9** - Full type safety across the entire application
- **Vite** - Lightning-fast HMR and optimized production builds

### State & Data
- **TanStack Query v5** - Powerful async state management with built-in caching
- **React Router v7** - Type-safe routing with nested layouts
- **React Hook Form** - Performant, flexible form validation
- **Zod** - TypeScript-first schema validation

### Styling & UI
- **Tailwind CSS v4** - Utility-first styling with custom design tokens
- **Lucide Icons** - Beautiful, consistent iconography
- **Sonner** - Elegant toast notifications
- **Class Variance Authority** - Type-safe component variants

### Quality & Testing
- **Vitest** - Fast unit testing framework
- **React Testing Library** - User-centric component testing
- **ESLint + Prettier** - Automated code quality and formatting
- **Husky + Lint-Staged** - Pre-commit hooks for code quality

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20+ ([Download](https://nodejs.org/))
- **pnpm** (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CFBruna/store-manager-ui.git
   cd store-manager-ui
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173)

### Available Scripts

```bash
# Development
pnpm dev          # Start dev server with HMR

# Production
pnpm build        # TypeScript check + optimized build
pnpm preview      # Preview production build locally

# Code Quality
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm test         # Run test suite
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── forms/          # ProductForm with advanced validation
│   ├── layout/         # DashboardLayout, Sidebar, Header
│   └── ui/             # Reusable components (Button, Dialog, Table, etc.)
├── contexts/           # React Context providers (Favorites)
├── hooks/              # Custom hooks
│   ├── useProducts.ts         # Product fetching with caching
│   ├── useProductMutations.ts # CRUD operations
│   ├── useFavorites.ts        # Favorites management
│   └── useClickOutside.ts     # Click-outside detection
├── lib/
│   ├── axios.ts               # Configured HTTP client
│   ├── formatters.ts          # Data formatting utilities
│   ├── normalization.ts       # Data cleaning functions
│   └── utils.ts               # General utilities
├── pages/              # Route components
│   ├── Home.tsx               # Product listing + filters
│   ├── ProductDetails.tsx     # Single product view
│   ├── ProductFormPage.tsx    # Create/Edit wrapper
│   ├── Favorites.tsx          # Favorited products
│   ├── ComingSoon.tsx         # Placeholder for demo routes
│   └── NotFound.tsx           # 404 page
├── schemas/            # Zod validation schemas
├── services/           # API integration layer
│   └── productService.ts      # Product CRUD + local storage
└── types/              # TypeScript type definitions
```

---

## 🎯 Key Implementation Details

### API Integration
The app consumes the [Fake Store API](https://fakestoreapi.com/), a public REST API for e-commerce products. Since this is a mock API, create/update/delete operations are simulated client-side using local storage with an intelligent merge strategy.

**Features:**
- Seamless blending of API products with locally created items
- Persistent storage across sessions
- Optimistic UI updates with automatic rollback
- Smart conflict resolution

### State Management Strategy
- **Server State**: TanStack Query manages all API data with automatic caching, background refetching, and query invalidation
- **Client State**: React Context API for cross-cutting concerns (Favorites)
- **Form State**: React Hook Form with Zod validation for type-safe, performant forms
- **URL State**: React Router for shareable, bookmarkable application state

### Performance Optimizations
- Code splitting with React.lazy for route-based chunks
- Debounced search input to reduce unnecessary renders
- Virtualized lists for large datasets (ready for implementation)
- Memoized expensive computations
- Optimistic updates to eliminate loading states

---

## 🧪 Testing

The project includes a comprehensive test suite covering:
- Component rendering and user interactions
- Custom hook behavior
- Form validation logic
- API service mocking

Run tests with:
```bash
pnpm test
```

---

## 🌐 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome on Android)

---

## 📝 License

This project is licensed under the MIT License.

---

## 👩‍💻 About

**Developed by [Bruna Menezes](https://github.com/CFBruna)**

This project showcases modern React development practices, including:
- Advanced TypeScript patterns
- Production-ready architecture
- Comprehensive error handling
- Accessibility-first design
- Performance optimization techniques

For questions or collaboration opportunities, feel free to reach out!
