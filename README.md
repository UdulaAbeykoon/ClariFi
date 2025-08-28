# ClariFi - Smart Learning for Business Students

A modern, AI-powered learning platform designed specifically for business students. Study more efficiently with PDF viewing, intelligent note-taking, and AI assistance.

## Features

- **PDF Side-by-Side Viewing**: View textbooks and PDFs alongside your notes
- **Auto-Save Notes**: Cloud-synced notes with real-time saving
- **AI Study Assistant**: Get explanations, summaries, and quizzes powered by OpenAI
- **Modular Learning**: Organized by business subjects (Valuation, Accounting, Marketing)
- **Resizable Interface**: Customize your workspace with flexible panels
- **Smart Search**: Find your notes quickly with intelligent search
- **Keyboard Shortcuts**: Efficient navigation and shortcuts

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ClariFi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   ```bash
   # Supabase (for notes storage)
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # OpenAI (for AI assistant)
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Supabase Setup

If you want to use the notes feature, set up a Supabase project:

1. Create a new project at [supabase.com](https://supabase.com)
2. Run this SQL to create the notes table:

```sql
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  doc_id text not null,
  page_number int,
  title text,
  content text,
  updated_at timestamptz default now()
);

-- Enable Row Level Security (optional, for future auth)
alter table notes enable row level security;

-- Create policy to allow all operations (update when auth is added)
create policy "Allow all operations" on notes for all using (true);
```

3. Add your Supabase URL and anon key to `.env`

## Usage

### Navigation

- **Landing Page**: Overview of features and getting started
- **Modules Page**: Choose from Business Valuation, Accounting, or Marketing
- **Study Interface**: Split-screen with PDF viewer and notes/AI chat

### Keyboard Shortcuts

- `[` / `]`: Navigate PDF pages
- `Ctrl/Cmd + S`: Force save notes
- `Ctrl/Cmd + K`: Focus note search

### Interface

- **Left Panel**: PDF viewer with zoom and navigation controls
- **Right Panel**: Tabbed interface for Notes and AI Chat
- **Resizable**: Drag the dividers to adjust panel sizes
- **Persistent**: Your layout preferences are saved automatically

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **PDF Viewing**: react-pdf (PDF.js)
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-3.5/GPT-4
- **Routing**: React Router
- **State**: React hooks + localStorage

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── Navbar.tsx       # Navigation header
│   ├── Hero.tsx         # Landing page hero
│   ├── Features.tsx     # Features section
│   ├── About.tsx        # About section
│   ├── ModuleCards.tsx  # Module selection cards
│   ├── SplitContainer.tsx # Main app layout
│   ├── PdfViewer.tsx    # PDF display component
│   ├── RightPane.tsx    # Tabbed right panel
│   ├── NotesPane.tsx    # Notes editor
│   ├── ChatPane.tsx     # AI chat interface
│   └── SaveStatus.tsx   # Save indicator
├── lib/                 # Utility libraries
│   ├── supabaseClient.js # Database client
│   ├── openaiClient.js  # AI client
│   └── storage.js       # localStorage utilities
├── pages/               # Route components
│   ├── Landing.tsx      # Home page
│   ├── GetStarted.tsx   # Module selection
│   ├── Module.tsx       # Main study interface
│   └── NotFound.tsx     # 404 page
└── assets/              # Static assets
```

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Adding New Modules

To add a new business module:

1. Add module data to `ModuleCards.tsx`
2. Update routing in `Module.tsx` to handle the new slug
3. Add any module-specific logic or content

### Customizing the Design

The design system is defined in:
- `src/index.css`: CSS custom properties and base styles
- `tailwind.config.ts`: Tailwind configuration with custom colors

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider

3. Ensure environment variables are set in your production environment

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for business students everywhere.