# Church Platform Website

A modern, responsive website for the Church Platform built with React, TypeScript, and Vite.

## Project Structure

```
src/
├── app/              # Main App component
├── components/       # Reusable components (Navbar, Footer, Layout, etc.)
├── hooks/           # Custom React hooks
├── pages/           # Page components organized by feature
│   ├── home/        # Home page
│   ├── about/       # About page
│   ├── events/      # Events page
│   └── contact/     # Contact page
├── services/        # API services and external integrations
├── store/           # Zustand state management
├── styles/          # Global styles
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── index.css        # Global styles with Tailwind imports
└── main.tsx         # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd website
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Technologies Used

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Socket.io** - Real-time communication

## Adding New Pages

1. Create a new folder under `src/pages/`
2. Create your page component (e.g., `YourPage.tsx`)
3. Import and add the route to `src/app/App.tsx`

Example:
```tsx
import YourPage from '../pages/your-page/YourPage'

// In Routes:
<Route path="/your-page" element={<YourPage />} />
```

## Adding New Components

Place reusable components in `src/components/` and feature-specific components in their respective page folders.

## Contributing

When contributing, follow the project structure and TypeScript best practices.

## License

See LICENSE file in the repository root.
