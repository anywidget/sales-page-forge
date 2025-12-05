# WPlus Page Forge - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from WarriorPlus, ClickFunnels, and modern conversion-focused page builders. The design must embrace bold, high-impact visual styling that screams "marketing" while maintaining professional usability in the editor interface.

## Core Design Principles

### 1. Dual Design System
- **Editor Interface**: Clean, professional, tool-focused (think Linear/Notion clarity)
- **Page Preview/Output**: Bold, conversion-focused, graphics-heavy (WarriorPlus style)

### 2. Typography

**Editor Interface:**
- Primary: Inter or System UI font stack
- Headings: 600-700 weight, sizes 24/18/14px
- Body: 400 weight, 14px
- Labels: 500 weight, 12px uppercase with letter-spacing

**Generated Pages (All Themes):**
- Headlines: Montserrat Bold or Poppins ExtraBold, 48-72px desktop
- Subheadlines: 24-36px, 600 weight
- Body: Open Sans or Roboto, 16-18px for readability
- CTA Buttons: 18-20px, 700 weight, uppercase with tracking

### 3. Layout System
Use Tailwind spacing units: **2, 4, 6, 8, 12, 16, 24** for consistent rhythm

**Editor Layout (Three-Panel):**
- Left Sidebar: 280px fixed, sticky
- Center Preview: flex-1, max-w-6xl centered, px-8
- Right Sidebar: 360px fixed, sticky, scrollable

**Generated Pages:**
- Container: max-w-screen-xl for content sections
- Full-width for hero/CTA sections
- Section padding: py-16 md:py-24
- Inner content: px-6 md:px-12

## Theme Specifications

### Theme 1: clean_marketer
- Background: White to light gray gradient (50-100)
- Primary: Blue-600
- Accent: Orange-500
- Cards: White with subtle shadow
- Buttons: Solid blue, white text, rounded-lg
- Minimal gradients, professional photography

### Theme 2: mmo_dark
- Background: Gray-900 to black gradient
- Primary: Emerald-500 (neon green)
- Accent: Cyan-400
- Cards: Gray-800 with glowing borders (emerald-500/30)
- Buttons: Gradient emerald-500 to cyan-500, rounded-xl, shadow-2xl with glow effect
- Dark imagery with vibrant overlays

### Theme 3: neon_gamer
- Background: Radial gradient purple-900 via violet-800 to indigo-900
- Primary: Fuchsia-500
- Accent: Blue-400
- Cards: Glass-morphism effect (backdrop-blur, border gradient)
- Buttons: Gradient fuchsia-500 to purple-600, large shadow with purple glow
- Futuristic imagery with neon treatments

## Component Library

### Editor Components

**Left Sidebar Navigation:**
- Logo area: p-6, brand lockup
- Nav items: p-4, hover bg-gray-100, rounded-lg, flex with icons
- Project list: Compact cards with thumbnail, name, meta
- Active state: bg-blue-50, blue-600 text, left border-4

**Section Editor (Right Panel):**
- Header: Section type badge, reorder arrows, delete icon
- Form fields: Stacked with 4 spacing, labels above inputs
- Input groups: White bg, border rounded-lg, p-3
- Add section button: Dashed border card, center-aligned, hover lift
- Collapsible sections for organization

**Center Preview:**
- Frame controls: Top bar with theme toggle, device toggle, export buttons
- Mobile/Desktop toggle: Segmented control
- Zoom/scale controls if needed
- Preview renders at actual size within scrollable container

### Generated Page Components (Sales Letter Sections)

**Hero Section:**
- Full viewport or 80vh minimum
- Large gradient background with overlay
- Headline + subheadline stacked, center-aligned
- CTA button: Extra large (px-12 py-5), below headline
- Badge elements: Positioned absolute, top-right ("Limited Time")
- Background image with gradient overlay for text legibility

**Subheadline Block:**
- py-12, centered text, max-w-3xl
- 1.5 line-height for readability
- Highlight spans in accent color

**Video Section:**
- 16:9 aspect ratio container, max-w-4xl centered
- Rounded-xl with shadow
- Caption/description below

**Bullet Points:**
- Large checkmark icons (24px) in accent color
- Each bullet: flex items-start, gap-4, py-3
- Alternate background rows for readability

**Feature Grid:**
- 3-column on desktop, 1-column mobile
- Cards: p-8, rounded-2xl, hover scale-105 transition
- Icon top, 64px, accent color
- Title + description stacked

**Bonus Stack:**
- Stacked cards with offset/stagger effect
- Each bonus: Image left, content right, "Value" badge top-right
- Strikethrough original price, large bonus value

**Testimonials:**
- 2-column grid on desktop
- Avatar (rounded-full, 64px), quote, name, role
- Star ratings, verified badge
- Alternating card backgrounds

**JV Commission Table:**
- Bold headline "Massive Commissions"
- Table or cards showing tier structure
- Large percentage numbers (accent color)
- EPC and cookie duration badges

**JV Calendar:**
- Timeline visual with date markers
- Important dates highlighted with icons
- Countdown timer placeholders
- Webinar schedule cards

**Guarantee Section:**
- Shield or badge icon (96px)
- Centered, prominent headline
- Risk-free messaging, money-back terms
- Trust seals/badges row below

**FAQ Accordion:**
- Cards with expand/collapse
- Question: 600 weight, expand icon right
- Answer: Gray text, revealed with smooth animation

**CTA (Call-to-Action):**
- Full-width section, gradient background
- Extra large button (px-16 py-6)
- Scarcity text above ("Only 3 spots left")
- Guarantee badges below button
- Urgency indicators (countdown, limited availability)

**Divider:**
- Decorative separators between sections
- Options: Gradient line, zigzag, wave pattern
- 2-4 spacing vertical

## Visual Elements

### Badges & Labels
- "NEW": px-3 py-1, rounded-full, small caps, 11px
- "LIMITED": Red-500 background, white text, pulse animation
- "BONUS": Gradient background, rotated -3deg for dynamic feel

### Buttons
- Primary CTA: Large, gradient, shadow-2xl, uppercase, tracking-wide
- Secondary: Outline style, hover fill
- Hover: Scale-105, increased shadow
- Blurred background when over images (backdrop-blur-sm bg-black/30)

### Cards/Containers
- Rounded corners: rounded-xl to rounded-2xl
- Shadows: shadow-lg for elevation
- Borders: 1-2px, gradient borders for neon themes
- Hover states: Lift (translateY) and shadow increase

## Images

**Hero Sections:**
- Full-width background images (1920x1080+)
- Product mockups, lifestyle imagery showing results
- Gradient overlays for text contrast (black/60 to transparent)
- Always include compelling hero imagery

**Section Backgrounds:**
- Subtle patterns or gradients
- Product screenshots for features
- Before/after comparisons
- Team photos for testimonials

**Icons:**
- Use Heroicons for editor UI
- Font Awesome for generated page elements (checkmarks, stars, shields)
- Custom badge/seal graphics for guarantees

## Accessibility
- Maintain 4.5:1 contrast for all text
- Focus states: 2px ring in primary color
- Keyboard navigation throughout editor
- ARIA labels on all interactive elements
- Skip links for main content

## Animation Strategy
**Editor**: Minimal, smooth transitions only (200ms)
**Generated Pages**: Strategic use for impact
- Scroll-triggered fade-ins for sections
- Hover lifts on cards (transform + shadow)
- CTA button pulse effect (subtle, continuous)
- Countdown timers with flip animations
- NO distracting parallax or overuse

## Responsive Behavior
- Mobile-first approach
- Breakpoints: 640px (sm), 1024px (lg), 1280px (xl)
- Stack all multi-column layouts on mobile
- Reduce font sizes by 30-40% on mobile
- Maintain CTA button prominence across devices
- Touch-friendly tap targets (minimum 44px)

This design system enables rapid creation of high-converting, visually striking sales pages while maintaining a professional, usable editor experience.