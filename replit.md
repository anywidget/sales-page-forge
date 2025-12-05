# Sales Page Forge

## Overview

Sales Page Forge is a micro-SaaS application for building high-converting, Internet Marketing-style sales letters and JV (Joint Venture) pages. The platform provides a visual drag-and-drop editor that allows users to create graphics-heavy, long-form "MMO style" marketing pages and export them as HTML/CSS.

The application features a tiered subscription model (Free, Monthly, Lifetime) with progressive feature unlocking, multiple visual themes, and a comprehensive section-based page builder.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, built using Vite as the build tool.

**UI Component System**: shadcn/ui components built on Radix UI primitives, styled with Tailwind CSS. The design system implements a dual approach:
- Clean, professional interface for the editor (Linear/Notion-inspired)
- Bold, conversion-focused styling for generated pages (Internet Marketing-style)

**State Management**: 
- TanStack Query (React Query) for server state management and API data fetching
- React Context API for global application state (authentication, theme)
- Local component state for UI interactions

**Design Philosophy**: The application uses a "New York" style variant from shadcn/ui with custom CSS variables for theming. The design supports both light and dark modes through a ThemeContext provider.

**Key UI Patterns**:
- Three-panel editor layout: left sidebar (280px), center preview (flex), right properties panel (360px)
- Sidebar navigation using shadcn/ui Sidebar component
- Modal dialogs for creating/editing projects
- Drag-and-drop section reordering (planned via @dnd-kit packages)

### Backend Architecture

**Framework**: Express.js running on Node.js with TypeScript.

**API Design**: RESTful API with session-based authentication. Key endpoints:
- `/api/auth/*` - User registration, login, logout, session management
- `/api/projects/*` - CRUD operations for page projects
- `/api/user/*` - User profile and plan management
- `/api/user/api-keys` - API key management for LLM and image providers
- `/api/ai/generate-copy` - AI-powered sales copy generation
- `/api/images/search` - Stock image search across providers

**Authentication**: Session-based authentication using express-session with PostgreSQL session store (connect-pg-simple). Sessions persist for 30 days. Password hashing implemented with bcrypt (10 rounds).

**Password Reset**: Secure password reset flow via email:
- `/api/auth/forgot-password` - Generates secure 32-byte token, stores in database with 1-hour expiration, sends branded email via Resend
- `/api/auth/verify-reset-token` - Validates token exists and hasn't expired/been used
- `/api/auth/reset-password` - Consumes token, hashes new password, marks token as used
- Tokens stored in `password_reset_tokens` table with expiration and usage tracking
- Responses hide account existence to prevent enumeration attacks
- Email service uses Resend connector for delivery

**Business Logic**: Plan-based feature gating implemented through middleware and storage layer. The system enforces limits on:
- Maximum projects per plan
- Available themes per plan
- Available section types per plan
- Export capabilities (HTML download, JSON export)
- Project duplication rights

### Data Storage

**Database**: PostgreSQL accessed through Drizzle ORM (node-postgres driver).

**Schema Design**:
- `users` table: Stores user credentials, email, plan type, auto-generated UUIDs
- `projects` table: Stores project metadata, type (sales_letter/jv_page), theme, sections as JSONB
- `user_api_keys` table: Encrypted storage for user-provided API keys (LLM and image providers)
- `user_sessions` table: Managed automatically by connect-pg-simple for session persistence

**User API Keys**:
Users manage their own API keys for third-party integrations:
- LLM Providers: OpenAI (GPT-4), Anthropic (Claude), Google (Gemini)
- Image Providers: Pexels, Unsplash, Pixabay
- Keys are encrypted using AES-256 before storage

**Data Model Choices**:
- Sections stored as JSONB array in projects table rather than separate table - chosen for simplicity and atomic updates
- UUID primary keys using PostgreSQL's `gen_random_uuid()` for distributed-friendly IDs
- Cascade deletion on user removal to maintain referential integrity
- Timestamps (created_at, updated_at) for audit trail and sorting

**ORM Layer**: Drizzle ORM with schema validation through drizzle-zod. This provides:
- Type-safe database queries
- Automatic schema inference
- Zod schema generation for API validation

### Page Builder Architecture

**Section-Based Design**: Pages are composed of reusable section blocks. Each section has:
- Unique ID
- Type (hero, bullets, testimonial, CTA, etc.)
- Position (for ordering)
- Data object (stores section-specific content)

**Available Section Types**:
- Core: hero, subheadline, bullets, testimonial, FAQ, CTA, divider, headline_only
- Premium: video, feature_grid, bonus_stack, guarantee
- JV-specific: jv_commissions, jv_calendar, jv_prizes

**Text Effects System**: Sections support Internet Marketing-style text effects for bold, attention-grabbing copy:
- Text Shadow/Glow: Subtle shadow, bold shadow, neon effects (cyan, pink, fire), glow effects
- Letter Spacing: Normal to extra wide for dramatic effect
- Text Transform: Uppercase, lowercase, capitalize
- Text Decoration: Underline, strikethrough
- Text Outline: Black, white, gold, red outlines in thin/medium weights
- Effects are applied via tabbed interface in SectionEditor (Content + Text Effects tabs)
- Supported sections: hero, subheadline, bullets, cta, headline_only
- Effects stored in section.data.textEffects object and rendered via buildTextEffectStyles helper

**Freeform Elements Layer**: Hybrid editor combining section-based simplicity with freeform positioning:
- Text elements: Drag-and-drop text boxes with rich text editing, full text effects support
- Image elements: Positioned images with URL input overlay
- Background controls: Color picker with opacity slider (0-100%)
- Resize handles for element dimensions
- Elements rendered as overlay on top of section-based page preview

**Theme System**: Twelve distinct Internet Marketing-inspired themes implemented:
- `classic_red`: Bold red/yellow urgency style, classic direct response
- `clean_blue`: Professional white/blue, trust-building corporate
- `money_green`: Finance-focused green/gold accents
- `dark_authority`: Premium dark theme, authoritative presence
- `sunset_orange`: Warm, friendly orange tones
- `tech_purple`: Modern SaaS style with purple gradients
- `black_gold`: Luxury feel with black/gold accents
- `fresh_teal`: Health/wellness style with calming teal
- `fire_red`: High-energy dark theme with intense red
- `ocean_blue`: Calm, trustworthy deep ocean tones
- `neon_gamer`: Gaming/tech audience with neon colors
- `minimalist_white`: Clean modern design, minimal distractions

**Theme Availability by Plan**:
- Free: classic_red, clean_blue, minimalist_white (3 themes)
- Monthly/Lifetime: All 12 themes

**Export Mechanism**: Client-side HTML generation that:
- Converts section data to semantic HTML
- Injects theme-specific CSS
- Applies inline styles for portability
- Optionally adds watermark for free tier users

### Plan & Feature Gating

**Tier Structure**:
- Free: 1 project, 3 themes, basic sections, watermarked exports, no HTML download
- Monthly: 20 projects, 12 themes, all sections, AI copy writer, stock images, HTML download, no watermark
- Lifetime: 100 projects, 12 themes, all sections, AI copy writer, stock images, HTML + JSON export, project duplication

**Implementation**: Feature limits defined in `PLAN_LIMITS` constant, enforced both client-side (UI hiding) and server-side (API validation). This dual approach prevents unauthorized access while maintaining good UX.

### Admin Panel Architecture

**Access Control**: Admin access is controlled by an `isAdmin` boolean field on the users table. Only users with `isAdmin=true` can access the admin panel.

**Admin Routes**: All admin API routes are protected by the `requireAdmin` middleware which:
1. Checks for valid session with `userId`
2. Looks up user in database to verify `isAdmin=true`
3. Returns 401/403 for unauthorized access

**Admin API Endpoints**:
- `GET /api/admin/stats` - Dashboard statistics (total users, projects, plan breakdown, recent activity)
- `GET /api/admin/users` - List all users with project counts
- `PATCH /api/admin/users/:id` - Update user plan or admin status
- `DELETE /api/admin/users/:id` - Delete user and cascade delete their projects
- `GET /api/admin/projects` - List all projects with user email
- `DELETE /api/admin/projects/:id` - Delete any project

**Admin UI Components**:
- Dashboard tab with stat cards (Total Users, Total Projects) and plan distribution chart
- Users tab with searchable table, inline plan editing via dropdown, toggle for admin status
- Projects tab with searchable table showing all projects across all users
- Back button to return to main application

**Security Notes**:
- Admin status is checked server-side on every admin API request
- All auth endpoints (login, register, upgrade, session check) return `isAdmin` flag
- Admin nav item only renders in sidebar when `user.isAdmin === true`

## External Dependencies

**UI Framework**:
- Radix UI component primitives (@radix-ui/*) for accessible, unstyled components
- Tailwind CSS for utility-first styling
- shadcn/ui component library (New York variant)

**State & Data**:
- TanStack Query for server state and caching
- React Hook Form with Zod resolvers for form validation

**Database**:
- PostgreSQL (provisioned via Replit)
- Drizzle ORM for type-safe database access
- pg (node-postgres) as the PostgreSQL driver
- connect-pg-simple for session storage in PostgreSQL

**Authentication**:
- express-session for session management
- bcrypt for password hashing
- Session secrets managed via environment variables

**Development Tools**:
- Vite for fast development and optimized builds
- esbuild for server bundling
- TypeScript for type safety across stack

**Build Process**: Custom build script (`script/build.ts`) that:
- Builds client with Vite
- Bundles server with esbuild
- Selectively bundles server dependencies to reduce cold start times
- Outputs to `dist/` directory for production deployment