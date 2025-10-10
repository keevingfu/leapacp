# Leap ACP - Frontend Application

## Overview

This is the frontend application for Leap Agentic Commerce Platform (ACP), built with React, TypeScript, and Vite.

## Technology Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3
- **UI Components**: shadcn/ui (Radix UI based)
- **State Management**: Zustand (planned)
- **Data Fetching**: TanStack Query (planned)
- **Icons**: Lucide React
- **Charts**: Recharts (planned)

## Project Structure

```
frontend/
├── src/
│   ├── layouts/          # Layout components
│   │   ├── MainLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── pages/            # Page components
│   │   └── Dashboard.tsx
│   ├── components/       # Reusable components
│   │   └── ui/          # shadcn/ui components
│   │       ├── button.tsx
│   │       └── card.tsx
│   ├── lib/             # Utility functions
│   │   └── utils.ts
│   ├── App.tsx          # Main app component with routing
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles with Tailwind
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 10+

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The application will be available at http://localhost:5173

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Routes

- `/` - Dashboard (Overview)
- `/analytics` - Analytics Page (Placeholder)
- `/geo/knowledge-graph` - Knowledge Graph (Placeholder)
- `/geo/data-collection` - Data Collection (Placeholder)
- `/geo/content-generation` - Content Generation (Placeholder)
- `/geo/content-library` - Content Library (Placeholder)
- `/commerce/orders` - Orders Management (Placeholder)
- `/commerce/offers` - Offers Catalog (Placeholder)
- `/settings` - System Settings (Placeholder)

## Features Implemented

### Phase 1 - Basic Setup ✅

- [x] Vite + React + TypeScript project structure
- [x] React Router v6 configuration
- [x] Tailwind CSS setup with shadcn/ui design system
- [x] Basic layout components (Header, Sidebar, MainLayout)
- [x] Dashboard page with metric cards
- [x] Navigation structure for all planned pages
- [x] Path alias (@/) configuration

## Next Steps

### Phase 2 - Page Development

1. Implement remaining pages:
   - Analytics Dashboard
   - Knowledge Graph with visualization
   - Data Collection interface
   - Content Generation workspace
   - Content Library
   - Orders Management
   - Offers Catalog
   - Settings

2. Add Mock Service Worker (MSW) for API mocking

3. Implement state management with Zustand

4. Add data fetching with TanStack Query

5. Create additional shadcn/ui components as needed

## Design System

The application uses shadcn/ui components with a custom color scheme:

- **Primary Color**: Blue (`hsl(221.2 83.2% 53.3%)`)
- **Background**: White/Dark Gray
- **Text**: Dark/Light based on theme
- **Border Radius**: 0.5rem

All colors support light and dark mode via CSS variables.

## Development Guidelines

1. **Component Organization**: Place reusable components in `src/components/`
2. **Page Components**: Place page-level components in `src/pages/`
3. **Layouts**: Place layout components in `src/layouts/`
4. **Utilities**: Place helper functions in `src/lib/`
5. **Naming Convention**: Use PascalCase for components, camelCase for functions
6. **Imports**: Use `@/` path alias for cleaner imports

## Verification Checklist

- [x] npm run dev starts successfully
- [x] No TypeScript errors
- [x] Page routing works correctly
- [x] Layout renders properly
- [x] Dashboard displays metric cards
- [x] Navigation sidebar works
- [ ] Mock API integration (Next phase)
- [ ] All pages implemented (Next phase)

## Notes

This is Phase 1 of the frontend development. The application currently displays a working dashboard with navigation structure. Placeholder pages are shown for routes that will be implemented in subsequent phases.
