# Dealer & Tracking Portal

A comprehensive web application built with modern React (v19) and Vite, featuring dealer networking, order tracking, responsive programmatic SEO, and an integrated admin portal.

## Features

- **Dealer Network & Subdomain Support:** Robust multi-tenant architecture designed to handle distinct dealer portal areas, programmatic subdomains, and dedicated landing pages.
- **Product Catalog & Cart:** Full featured e-commerce capabilities with dynamic cart, checkout routing, and order tracking.
- **Service Pages:** Dedicated, responsive pages for solutions such as AIS-140 GPS tracking, mining GPS, and private tracking.
- **Admin & Dealer Dashboard:** Integrated administrative tools and secure access for dealers (`/admin` and `/portal`).
- **Responsive & Animated:** Fluid design with Tailwind CSS and Framer Motion integration for high-quality interactions and page transitions.
- **Code Splitting & Optimization:** Out-of-the-box performance optimizations leveraging React `lazy` loading, `Suspense`, and Error Boundaries.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 6 with optimized production builds via ESBuild
- **Styling:** Tailwind CSS 4 + Lucide React Icons
- **Routing:** React Router v7
- **Animations:** Motion (Framer Motion)
- **Backend Setup:** Express setup available within `server.ts` configured for production via TSX and Node.js.

## Getting Started

### Prerequisites

Ensure you have Node.js installed (v20+ recommended).

### Installation

Clone the repository and install the dependencies:

```bash
npm install
```

> **Note on `allowScripts`**: This project uses modern npm safety features. Essential build and SDK scripts (like `@firebase/util`, `@google/genai`, `esbuild`, `protobufjs`) are whitelisted via the `"allowScripts"` configuration in `package.json`. You do not need to manually approve these scripts anymore.

### Local Development

Start the local development server:

```bash
npm run dev
```

This will run the Express backend locally alongside the Vite middleware at `http://localhost:3000`.

### Production Build

To build the application for production, which bundles both the Vite client assets and the ESBuild compiled Node server:

```bash
npm run build
```

You can preview the built files by running:

```bash
npm run start
```

## Environment Variables

Make sure to set up your `.env` file if required by checking `.env.example`. Variables prefixed with `VITE_` will be exposed to your client-side React code.

## Folder Structure

- `src/pages/` - Contains all route-level components (Home, Services, Contact, etc.)
- `src/components/` - Reusable UI components (Navbar, Footer, SEO, ErrorBoundary)
- `src/context/` - Global state management for Auth, Cart, and Dealers
- `src/admin/` - Administrative application portal views
- `server.ts` - Entry point for the Express backend

## License

Copyright © 2026. All rights reserved.
