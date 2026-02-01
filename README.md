# 🏃 Eternal Run Club

A 50-day running competition web application where Team Alpha and Team Beta compete for total distance accumulated.

![Eternal Run Club](https://via.placeholder.com/800x400?text=Eternal+Run+Club)

## ✨ Features

- **Team Competition**: Two teams (Alpha & Beta) competing for points
- **Run Logging**: Log daily runs with distance, duration, and proof images
- **Smart Validation**: 
  - Pace validation (min 6 km/h)
  - 24-hour submission window
  - One run per day limit
  - Competition date range enforcement
- **Live Leaderboards**: Team and individual rankings
- **Mobile-First Design**: Optimized for phone users
- **Celebration Animations**: Confetti on successful run logging

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (Auth, Database, Storage)
- **Animations**: Canvas Confetti

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Zomato/eternal-run-club.git
cd eternal-run-club
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the migration script from `supabase/migration.sql`
3. Copy your project URL and anon key from Project Settings > API

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── leaderboard/
│   │   ├── runs/
│   │   ├── teams/
│   │   └── upload/
│   ├── auth/             # Authentication page
│   ├── dashboard/        # Main dashboard
│   ├── leaderboard/      # Leaderboard page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home redirect
├── components/           # React components
│   ├── CompetitionProgress.tsx
│   ├── LogRunModal.tsx
│   ├── Navbar.tsx
│   ├── RecentRuns.tsx
│   ├── TeamScoreboard.tsx
│   └── UserStatsCard.tsx
└── lib/
    ├── constants.ts      # App constants
    ├── scoring.ts        # Scoring logic
    ├── types.ts          # TypeScript types
    └── supabase/         # Supabase clients
        ├── client.ts
        ├── middleware.ts
        └── server.ts
```

## 🎯 Business Rules

| Rule | Description |
|------|-------------|
| **Competition Period** | February 1 - March 22, 2026 |
| **Scoring** | 1 km = 1 point (rounded down) |
| **Minimum Pace** | 6 km/h (10 min/km) for points |
| **Daily Limit** | 1 run per user per day |
| **Submission Window** | Within 24 hours of run date |

## 🎨 Design System

### Colors

- **Team Alpha (Red)**: `#dc2626` (primary), `#991b1b` (secondary)
- **Team Beta (Gold)**: `#eab308` (primary), `#a16207` (secondary)
- **Background**: `#020617` (dark-950)

### Components

- Cards with glassmorphism effect
- Gradient buttons
- Team badges
- Progress bars
- Mobile-responsive tables

## 📱 Screenshots

| Dashboard | Leaderboard | Log Run |
|-----------|-------------|---------|
| ![Dashboard](https://via.placeholder.com/300x600) | ![Leaderboard](https://via.placeholder.com/300x600) | ![Log Run](https://via.placeholder.com/300x600) |

## 🔐 Database Schema

### Users Table
```sql
- id: UUID (PK, references auth.users)
- email: TEXT
- username: TEXT (unique)
- team_name: ENUM ('Alpha', 'Beta')
- created_at: TIMESTAMP
```

### Runs Table
```sql
- id: UUID (PK)
- user_id: UUID (FK to users)
- distance_km: DECIMAL(5,2)
- duration_mins: INTEGER
- points: INTEGER
- image_proof_url: TEXT
- run_date: DATE
- created_at: TIMESTAMP
- UNIQUE(user_id, run_date)
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with ❤️ for running enthusiasts
- Powered by [Supabase](https://supabase.com)
- UI inspired by modern sports apps

---

**Let the race begin! 🏃‍♂️💨**
