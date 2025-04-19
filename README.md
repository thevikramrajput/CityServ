# City Serv - Service Provider Marketplace

City Serv is a full-stack Next.js application that connects skilled professionals with customers in need of home services.

## Features

- User authentication (sign up, sign in)
- Service listings and details
- Provider registration
- Booking system
- Provider dashboard
- User booking management

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom cookie-based auth

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Set up your environment variables in a `.env` file:
   \`\`\`
   DATABASE_URL="postgresql://username:password@localhost:5432/cityserv"
   \`\`\`
4. Set up the database:
   \`\`\`bash
   npx prisma migrate dev --name init
   \`\`\`
5. Seed the database:
   \`\`\`bash
   npm run db:seed
   \`\`\`
6. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Demo Accounts

After seeding the database, you can use these accounts to test the application:

- **Admin**: admin@cityserv.com / admin123
- **Provider**: plumber@cityserv.com / provider123
- **Customer**: customer@cityserv.com / customer123

## Deployment

This project can be deployed on Vercel with a PostgreSQL database from providers like Neon, Supabase, or Railway.

## License

This project is licensed under the MIT License.
