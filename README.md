# Store Manager UI

![CI Status](https://github.com/usuario/store-manager-ui/actions/workflows/ci.yml/badge.svg)
![Node Version](https://img.shields.io/badge/node->=20-success)
![License](https://img.shields.io/badge/license-MIT-blue)

A high-performance CRUD application for product management, engineered to demonstrate **Architectural Patterns**, **Optimistic UI**, and **Developer Experience (DX)** using the modern React ecosystem.

This project simulates a real-world scenario consuming the [Fake Store API](https://fakestoreapi.com/), featuring robust state management and a production-ready infrastructure.

## 🚀 Features

- **Architectural Layering**: Clean separation between UI, Data Layer (`hooks + react-query`), and Services (`axios`).
- **Optimistic UI**: Instant feedback on mutations (Create/Update/Delete) by manipulating the cache before server response.
- **Type Safety**: End-to-end type safety with **TypeScript** and **Zod** schemas.
- **Modern Styling**: Built with **Tailwind CSS v4** for a responsive and accessible interface.
- **Quality Assurance**: Automated linting (`ESLint v10`), formatting (`Prettier`), and pre-commit hooks (`Husky`).
- **Production Ready**: Multi-stage **Docker** build with Nginx SPA configuration and CI/CD via GitHub Actions.

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript, Vite
- **State & Data**: TanStack Query (React Query), Axios
- **Styling**: Tailwind CSS v4, clsx, tailwind-merge, Lucide Icons
- **Forms**: React Hook Form, Zod
- **Testing**: Vitest, React Testing Library
- **DevOps**: Docker, Nginx, GitHub Actions

## ⚡ Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CFBruna/store-manager-ui.git
   cd store-manager-ui
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run the dev server:**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Docker (Production Preview)

1. **Build the image:**
   ```bash
   docker build -t store-manager .
   ```

2. **Run the container:**
   ```bash
   docker run -p 8080:80 store-manager
   ```
   Open [http://localhost:8080](http://localhost:8080).

## 🧪 Testing

Run the automated test suite to verify components and logic.

```bash
pnpm test
```

## 📦 Deployment

The application is optimized for deployment on platforms like Vercel, Netlify, or AWS.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fstore-manager-ui)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
