This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Authentication and Database Setup

This project uses NextAuth.js for authentication with Google OAuth and Supabase for the database. To set up:

### Google OAuth Setup

1. Create a Google OAuth application in the [Google Cloud Console](https://console.cloud.google.com/)
2. Set the authorized redirect URI to `http://localhost:3000/api/auth/callback/google`
3. Copy your Client ID and Client Secret

### Supabase Setup

1. Create a new project at [Supabase](https://supabase.com/)
2. After project creation, get your project URL and anon key from the API settings
3. In your Supabase project, set up the following tables:

#### YouTubers Table

```sql
create table youtubers (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now(),
  name text not null,
  channel_url text not null,
  image_url text,
  description text,
  vote_count integer default 0
);
```

#### Votes Table

```sql
create table votes (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now(),
  user_id text not null,
  youtuber_id uuid references youtubers(id) on delete cascade not null,
  unique (user_id, youtuber_id)
);
```

#### Users Table

```sql
create table users (
  id text primary key,
  created_at timestamp with time zone default now(),
  email text not null unique,
  name text,
  image_url text,
  role text check (role in ('admin', 'user')) default 'user' not null
);
```

#### Increment Vote Count Function

```sql
create or replace function increment_vote_count(youtuber_id uuid)
returns void as $$
begin
  update youtubers
  set vote_count = vote_count + 1
  where id = youtuber_id;
end;
$$ language plpgsql;
```

#### Setting Up Admin Users

To make a user an admin:

1. The user must first sign in through Google OAuth (this creates their user record)
2. Update their role in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

**Important:** The first admin user must be set up manually in the database after they sign in for the first time.

4. Create a `.env.local` file in the root directory with the following variables:

```
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here # generate with `openssl rand -base64 32`

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
