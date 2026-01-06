# Green Global E-Commerce

A premium e-commerce platform for exporting rare plants (Aroids) from Borneo. Built with modern web technologies focusing on performance, SEO, and user experience.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Neon / Vercel Postgres)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v4
- **Payment**: Midtrans Snap API (Mocked for Dev)
- **Email**: Nodemailer (Planned/Configured)

## Prerequisites

- Node.js 18+
- PostgreSQL Database
- NPM or Yarn

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Green-Global
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:port/database"

   # Authentication
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secure-secret-key"

   # Payment (Midtrans)
   MIDTRANS_SERVER_KEY="your-server-key"
   MIDTRANS_CLIENT_KEY="your-client-key"
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="your-client-key"
   ```

4. **Database Setup**
   Run the Prisma migrations to create the database schema:

   ```bash
   npx prisma migrate dev
   ```

   (Optional) Seed the database with initial products and admin user:
   ```bash
   npx prisma db seed
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Features

### Customer Platform
- **Catalog**: Advanced searching, filtering, and sorting for products.
- **Cart & Checkout**: Full checkout flow with address management and payment integration.
- **User Accounts**: Order history, profile management, and wishlist.
- **Reviews**: Product reviews and community testimonials.
- **Tracking**: Real-time order status tracking.

### Admin Dashboard (`/admin`)
- **Product Management**: Create, update, and delete products (CRUD coverage).
- **Order Management**: View orders, update status (Shipped/Delivered), and payment verification.
- **Data Export**: Export Orders and Customers to CSV format.
- **Analytics**: Basic revenue and customer metrics.

## Project Structure

- `/app`: App Router pages and API routes.
- `/components`: Reusable UI components.
- `/lib`: Utility functions, Prisma client, and configuration.
- `/prisma`: Database schema and migrations.
- `/public`: Static assets (images).

## Deployment

The project is optimized for deployment on Vercel.
Ensure all environment variables are correctly set in the deployment project settings.
