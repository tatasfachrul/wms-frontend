# Warehouse Management System (WMS) - Frontend

A modern, clean admin dashboard UI for managing warehouse inventory, built with Next.js 16 and TailwindCSS.

## Features

- **Authentication**: Secure login with JWT token storage
- **Dashboard**: Overview with summary cards (Total Products, Low Stock, Transactions)
- **Product Management**:
  - View all products with search functionality
  - Add new products
  - Edit product details
  - View product transaction history
- **Transaction Management**:
  - Track all inventory movements (IN/OUT)
  - Add new transactions
  - Stock validation for OUT transactions
- **Responsive Design**: Mobile-friendly sidebar navigation
- **Protected Routes**: Automatic redirect to login for unauthorized access

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Styling**: TailwindCSS
- **Components**: React Server Components + Client Components
- **Icons**: Lucide React
- **Authentication**: JWT with localStorage
- **Route Protection**: Next.js Middleware

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API running (see Backend Setup section)

### Installation

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
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

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

## API Endpoints Expected

The frontend expects the following backend API endpoints:

### Authentication
- `POST /api/login` - Login with email and password
  ```json
  Request: { "email": "user@example.com", "password": "password" }
  Response: { "token": "jwt-token", "user": {...} }
  ```

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
  ```json
  Response: {
    "totalProducts": 100,
    "lowStockCount": 5,
    "totalTransactions": 250
  }
  ```

### Products
- `GET /api/products` - Get all products (supports ?search query)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
  ```json
  Request: {
    "nama_barang": "Product Name",
    "sku": "SKU123",
    "stok": 100,
    "lokasi_rak": "A1",
    "minimum_stok": 10
  }
  ```
- `PATCH /api/products/:id` - Update product

### Transactions
- `GET /api/transactions` - Get all transactions (supports ?product_id filter)
- `POST /api/transactions` - Create new transaction
  ```json
  Request: {
    "product_id": "uuid",
    "type": "IN" | "OUT",
    "quantity": 10
  }
  ```

## Features Breakdown

### Authentication Flow
1. User enters email and password on login page
2. Credentials sent to `/api/login`
3. JWT token stored in localStorage and cookies
4. Middleware checks for token on protected routes
5. Token included in Authorization header for API requests

### Dashboard Page
- Displays three summary cards
- Total Products count
- Low Stock Count (products below minimum threshold)
- Total Transactions count

### Product Management
- **List View**: Searchable table with product details
- **Add Product**: Modal form for creating new products
- **Detail View**: Tabbed interface with:
  - Details tab: Editable product information
  - History tab: Transaction history for the product

### Transaction Management
- **List View**: Table showing all transactions
- **Add Transaction**: Modal form with:
  - Product dropdown (shows current stock)
  - Type selection (IN/OUT)
  - Quantity input
  - Stock validation for OUT transactions

### Error Handling
- Toast notifications for success/error messages
- API error messages displayed to user
- Insufficient stock errors shown when quantity exceeds available stock

## Design Style

- Clean and minimal interface
- Light theme with neutral colors
- Rounded corners and smooth transitions
- Responsive layout for mobile and desktop
- Professional color scheme (blue primary, gray neutrals)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

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

## License

This project is part of a Warehouse Management System implementation.
