# Clear Lakes Dental - Database Demo Project

A full-stack Nuxt 3 application with Supabase integration for managing database entries. This project demonstrates proper authentication, server-side API routes, and TypeScript type safety.

## Features

-  **Supabase Authentication**: Login and signup functionality with protected routes
-  **Database Operations**: Create and view entries stored in Supabase
-  **Server-Side API Routes**: All Supabase operations performed securely on the server
-  **Type Safety**: Full TypeScript support throughout the application
-  **Protected Routes**: Middleware ensures only authenticated users can access the site
-  **Persistent Data**: Data persists through page refreshes and server restarts

## Tech Stack

- **Nuxt 3**: Vue.js framework for building the application
- **TypeScript**: Type-safe development
- **Supabase**: Backend-as-a-Service for authentication and database
- **Tailwind CSS**: Utility-first CSS framework for styling
- **npm**: Package manager

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- A Supabase account and project

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# clone the repository
git clone <github-url>
```

```bash
# Install dependencies
npm install
```

### 2. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project and organization
3. Wait for the project to be fully provisioned

### 3. Set Up Supabase Database

1. In your Supabase dashboard, navigate to **Table Editor**
2. Click **New Table** and create a table named `entries`
3. Add the following columns:
   - `id` (type: `int8`, primary key, auto-increment)
   - `name` (type: `text`, not null)
   - `email` (type: `text`, not null)
   - `message` (type: `text`, not null)
   - `created_at` (type: `timestamptz`, default: `now()`)
4. **Optional**: Turn off Row Level Security (RLS) for simplicity:
   - Go to **Authentication** → **Policies**
   - Disable RLS for the `entries` table (or create policies that allow all operations)

### 4. Configure Environment Variables

1. In your Supabase dashboard, go to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL** (SUPABASE_URL)
   - **anon/public key** (SUPABASE_KEY)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY)

3. Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_project_url_here
SUPABASE_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important**: Never commit the `.env` file to version control. It's already included in `.gitignore`.

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
nuxt_template/
├── components/          # Reusable Vue components
│   └── header.vue      # Navigation header with auth status
├── middleware/         # Route middleware
│   └── auth.ts        # Authentication middleware for protected routes
├── pages/              # Application pages (auto-routed)
│   ├── index.vue      # Main page - displays database entries
│   ├── addData.vue    # Form page - add new entries
│   └── login.vue      # Authentication page
├── server/             # Server-side code
│   └── api/           # API routes (server-only)
│       ├── fetchData.ts  # Fetch entries from Supabase
│       └── postData.ts   # Insert new entry to Supabase
├── types/              # TypeScript type definitions
│   └── database.ts    # Database entry types
├── public/            # Static assets
├── app.vue            # Root component
├── nuxt.config.ts     # Nuxt configuration
└── package.json       # Dependencies and scripts
```

## Usage

### Authentication

1. Navigate to the application - you'll be redirected to `/login` if not authenticated
2. **Sign Up**: Click "Don't have an account? Sign Up" to create a new account
3. **Login**: Enter your email and password to log in
4. After successful authentication, you'll be redirected to the main page

### Adding Data

1. Click **Add Data** in the navigation header
2. Fill in the form with:
   - Name
   - Email
   - Message
3. Click **Submit** to save the entry to Supabase
4. You'll see a success message and the form will reset

### Viewing Data

1. The **Main Page** displays all entries in a table format
2. The table shows:
   - Entry ID
   - Name
   - Email
   - Message
   - Created timestamp

### Logging Out

1. Click the **Logout** button in the header
2. You'll be redirected to the login page

## API Routes

All Supabase operations are performed server-side for security:

### `POST /api/fetchData`
Fetches all entries from the `entries` table.

**Request Body:**
```json
{
  "table": "entries"
}
```

**Response:**
Array of `DatabaseEntry` objects

### `POST /api/postData`
Inserts a new entry into the `entries` table.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, world!"
}
```

**Response:**
Created entry object with ID and timestamp

## Type Safety

The project uses TypeScript throughout:

- **Database Types**: Defined in `types/database.ts`
- **API Responses**: Typed with `DatabaseEntry` interface
- **Form State**: Typed with `Omit<DatabaseEntry, "id" | "created_at">`

## Security Features

1. **Server-Side Operations**: All Supabase operations are performed on the server, never exposing keys to the client
2. **Authentication Middleware**: Routes are protected by middleware that verifies user authentication
3. **API Authentication**: Server API routes verify user authentication before processing requests
4. **Environment Variables**: Sensitive keys are stored in `.env` and not committed to version control

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build

### Key Nuxt Features Used

- **Pages**: Auto-routing based on file structure in `pages/`
- **Components**: Auto-imported from `components/`
- **Server Routes**: API endpoints in `server/api/`
- **Middleware**: Route protection in `middleware/`
- **Composables**: `useSupabaseClient()`, `useSupabaseUser()`, etc.

## Deployment

### Deploy to Vercel 

1. Push your code to a public GitHub repository
2. Import the project in [Vercel](https://vercel.com)
3. Add your environment variables in Vercel's project settings
4. Deploy!

The application will be available at your Vercel URL.


## Troubleshooting

### Authentication Issues

- Ensure your Supabase project has Authentication enabled
- Check that email/password authentication is enabled in Supabase Auth settings
- Verify your environment variables are correctly set

### Database Issues

- Ensure the `entries` table exists in your Supabase project
- Check that the table columns match the expected schema
- Verify RLS policies if you're using them

### API Errors

- Check browser console and server logs for detailed error messages
- Verify your Supabase keys are correct in `.env`
- Ensure you're logged in before accessing protected routes

## Resources

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Supabase JavaScript SDK](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is created for the Clear Lakes Dental Software Engineer Intern assessment.
