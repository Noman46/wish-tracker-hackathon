# Wish Tracker

A modern, elegant web application for managing your personal wishlist. Track your wishes through three statuses: **Wish → In Progress → Achieved**, with categorization and remarks support.

## Features

- ✅ **CRUD Operations for Categories** - Create, read, update, and delete categories with custom colors
- ✅ **CRUD Operations for Wish Items** - Full management of wish items with descriptions, remarks, and categorization
- ✅ **Status Transitions** - Move wishes through three stages: Wish → In Progress → Achieved
- ✅ **Google SSO Authentication** - Secure sign-in with Google OAuth 2.0
- ✅ **Modern UI** - Beautiful, responsive interface built with Tailwind CSS
- ✅ **Type Safety** - Full TypeScript support throughout the application
- ✅ **Testing** - Comprehensive test suite for API routes and components

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (better-sqlite3)
- **Authentication**: NextAuth.js with Google Provider
- **Validation**: Zod
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library

## Prerequisites

- Node.js 18+ and npm/yarn
- Google OAuth 2.0 credentials (for SSO)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd wish-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen if prompted
6. Set authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
7. Copy your Client ID and Client Secret

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
```

**Note**: Generate a random secret for `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 5. Initialize the Database

The database will be automatically initialized on first run. The SQLite database file (`wish-tracker.db`) will be created in the project root.

### 6. Run the Development Server

```bash
npm run dev
```npm run 

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Build for Production

```bash
npm run build
npm start
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
wish-tracker/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth configuration
│   │   ├── categories/             # Category API routes
│   │   └── wish-items/             # Wish item API routes
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Home page
├── components/
│   ├── AuthButton.tsx              # Authentication button
│   ├── CategoryManager.tsx         # Category management UI
│   ├── Providers.tsx               # Session provider wrapper
│   └── WishItemManager.tsx         # Wish item management UI
├── lib/
│   ├── db.ts                       # Database initialization
│   ├── auth.ts                     # Authentication utilities
│   └── models/
│       ├── category.ts             # Category model
│       └── wish-item.ts            # Wish item model
├── __tests__/
│   ├── api/                        # API route tests
│   └── components/                 # Component tests
└── README.md
```

## API Endpoints

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `GET /api/categories/[id]` - Get a specific category
- `PATCH /api/categories/[id]` - Update a category
- `DELETE /api/categories/[id]` - Delete a category

### Wish Items

- `GET /api/wish-items` - Get all wish items (supports `?status=wish|in_progress|achieved` and `?category_id=1` query params)
- `POST /api/wish-items` - Create a new wish item
- `GET /api/wish-items/[id]` - Get a specific wish item
- `PATCH /api/wish-items/[id]` - Update a wish item
- `DELETE /api/wish-items/[id]` - Delete a wish item

## Usage

### Creating Categories

1. Click on the "Categories" tab
2. Click "Add Category"
3. Enter a name and choose a color
4. Click "Create"

### Creating Wish Items

1. Click on the "Wish Items" tab
2. Click "Add Wish Item"
3. Fill in the details:
   - Title (required)
   - Description (optional)
   - Status (Wish, In Progress, or Achieved)
   - Category (optional)
   - Remarks (optional)
4. Click "Create"

### Updating Status

Click the status buttons (Wish, In Progress, Achieved) on any wish item card to quickly change its status.

### Filtering

Use the status filter buttons at the top of the wish items list to filter by status.

## Agentic Development Principles Applied

This project demonstrates agentic software development principles:

1. **Plan → Execute → Review Cycles**: Structured development with clear planning, execution, and review phases
2. **Choice of Models**: Selected appropriate technologies based on requirements (Next.js for full-stack, SQLite for simplicity)
3. **Prompt Efficiency**: Focused, clear prompts with specific requirements
4. **Context Management**: Modular code structure with clear separation of concerns
5. **Verification & Testing**: Comprehensive test suite covering API routes and UI components

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

