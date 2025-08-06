🚀 Lendsqr Frontend Engineering Assessment

This is a frontend project replicating parts of the Lendsqr Admin Console, built with React, TypeScript, and SCSS Modules, based on the original Lendsqr design spec.

✅ Live Demo
https://umair-ibrahim-idris-lendsqr-fe-test.netlify.app

🔧 Tech Stack

React (via Vite)
TypeScript
SCSS Modules
React Router DOM
Vitest + React Testing Library
ESLint + Prettier
Mock backend via local users.json
localStorage with expiry

📥 Installation & Setup

git clone https://github.com/omair1996/lendsqr-fe-test.git
cd lendsqr-fe-test
yarn install
yarn dev
Access the app at http://localhost:5173.

🔐 Authentication

Login is not real — any random email and password grants access to simulate authentication.

Why: Keeps the app frontend-only, with no backend or token management....

🧠 Routing & Layouts
 
Used React Router DOM for navigation:

/login – login screen

/dashboard – user list view

/dashboard/users/:id – individual user profile

Wrapped all dashboard pages in a reusable layout component (navbar + sidebar).

Why: Reflects real-world routing structure, promotes layout reuse.



🔑 User Data Persistence with localStorage
    This is a key logic point in the app.

How it works:
On user actions like Blacklist or Activate, the app:

Updates the user object in-memory

Stores it in localStorage using a setWithExpiry() helper

TTL is 1 hour (3600000ms)

On reload or revisit:

The app checks if there's an updated version in localStorage

If yes, it renders the saved version

If expired or not found, it loads the default mock data from mock/users.json

Why this approach:

Simulates state persistence without needing a backend

Makes interactions feel responsive and consistent across reloads

Automatically expires and clears stale data

🗂️ Project Structure

src/
├── assets/
├── components/
│ ├── ActionMenu/
│ │ ├── ActionMenu.tsx
│ │ ├── ActionMenu.module.scss
│ │ └── ActionMenu.test.tsx
│ ├── Button/
│ ├── FilterModal/
│ ├── Input/
│ ├── LoadingIndicator/
│ ├── Navbar/
│ ├── Pagination/
│ ├── Sidebar/
│ ├── SummaryCards/
│ └── UserDashboard/
├── contexts/ # e.g. SearchContext provider
├── layouts/ # MainLayout with Sidebar + Navbar
├── pages/
│ ├── Dashboard/
│ ├── Users/ # users listing page
│ ├── UserDetails/
│ └── Login/
├── styles/ # global variables/mixins
├── types/ # TypeScript interfaces
├── utils/ # helpers, e.g. storage utilities
├── tests/ # optional global test files
├── App.tsx
└── main.tsx

📌 Highlights

Dashboard Summary Cards: KPIs including Users, Active Users, Loans & Savings
User List Table: Pagination, Filter modal, Column sorting, and Action dropdown
User Detail View (/dashboard/users/:id): Tabbed view of general info, bank, loans, documents, savings etc.

🧠 Why Structure Matters

Organizing files as .tsx, .scss, and .test.tsx per component helps ensure:

Component-level styling scopes correctly
Encapsulation of UI, logic, and tests
Scalability — easy onboarding for new developers

🧪 Testing

Tests are written using Vitest + React Testing Library.

yarn test
Covers rendering, interactions, filter logic, pagination, and Persistence handling.

🧺 Code Quality

Code is written with TypeScript, ESLint, and Prettier.
Type-safety via strict TypeScript rules
SCSS Modules ensure isolated styling
Mocked logic (users.json, Persistence utilities) mimics backend behavior

⚙️ Deployment
App is deployed on Netlify via vite build.

📝 Summary

This assessment showcases:

A clean, modular React app using modern tools
Session handling via localStorage with expiry logic
Interactive UI with filters, pagination, and actions
Well-tested and maintainable codebase

📖 Resources
Lendsqr design spec (Figma link)
