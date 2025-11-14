# Getting Started

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API running (see Backend Setup section)

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:

   Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

   Update the API base URL in `.env.local`:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
├── app/
│   ├── (dashboard)/           # Protected dashboard routes
│   │   ├── layout.tsx         # Dashboard layout with sidebar
│   │   ├── dashboard/         # Dashboard page
│   │   ├── products/          # Product list and detail pages
│   │   └── transactions/      # Transaction list page
│   ├── login/                 # Login page
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Root page (redirects to login)
├── components/
│   ├── common/                # Reusable UI components
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── SummaryCard.tsx
│   └── layout/
│       └── Sidebar.tsx        # Navigation sidebar
├── lib/
│   └── api.ts                 # API service wrapper
├── middleware.ts              # Route protection middleware
└── .env.local.example         # Environment variables template
```

## Notes

- All protected routes automatically redirect to login if no token is present
- Token stored in both localStorage (for API calls) and cookies (for middleware)
- Search functionality on products page filters by product name
- Transaction history filtered by product_id on product detail page
- Low stock items highlighted in red on products table
- Stock levels color-coded (red for low, green for sufficient)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
