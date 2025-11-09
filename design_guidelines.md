# I-DevR Code Design Guidelines

## Design Approach
**Reference-Based Approach** drawing from modern SaaS leaders:
- **Vercel**: Clean tech aesthetic, bold typography, subtle interactions
- **Stripe**: Professional trust-building, clear service differentiation
- **Linear**: Sharp UI components, focused user flows

**Core Principles**: Technical credibility, service clarity, conversion optimization

## Typography System

**Font Stack**: 
- Headings: Inter (700, 600 weights) via Google Fonts
- Body: Inter (400, 500 weights)
- Code/Technical: JetBrains Mono (400) for component names in builder

**Hierarchy**:
- Hero Headlines: text-5xl to text-6xl, font-bold, tracking-tight
- Section Headers: text-3xl to text-4xl, font-semibold
- Service Titles: text-2xl, font-semibold
- Body Text: text-base to text-lg, font-normal, leading-relaxed
- Small Print/Labels: text-sm, font-medium

## Layout System

**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 20
- Component padding: p-6 to p-8
- Section vertical spacing: py-16 to py-24
- Card gaps: gap-6 to gap-8
- Button padding: px-6 py-3

**Container Widths**:
- Full-width sections: w-full with max-w-7xl mx-auto
- Content sections: max-w-6xl
- App builder interface: max-w-screen-xl

## Core Components

**Navigation**:
- Fixed header with logo left, nav links center, "Get Started" CTA right
- Clean separator border below
- Mobile: Hamburger menu with full-screen overlay

**Service Cards** (3-column grid on desktop):
- Large icon/illustration top (96x96px area)
- Service title, description, feature bullets
- "Learn More" link bottom
- Subtle border, hover lift effect (shadow increase)

**App Builder Interface**:
- Left sidebar (w-80): Component palette with categorized sections
- Center canvas (flex-1): Live preview area with dotted grid background
- Right panel (w-72): Properties/pricing calculator
- Component cards: Icon + name + price tag, click-to-add interaction

**Pricing Display**:
- Real-time counter showing total price
- Breakdown list of selected components
- Large "Checkout with Stripe" button
- Subtle price update animation (scale pulse)

**Quote Request Forms**:
- Two-column layout on desktop (form left, info/context right)
- Input fields: Large touch targets (h-12), clear labels above
- Textarea for project details: min-h-40
- File upload area with drag-drop zone styling

**Admin Dashboard**:
- Card-based sections for API key input
- Masked input fields for secrets (type="password")
- Clear save/test connection buttons
- Status indicators (connected/disconnected badges)

## Page-Specific Layouts

**Homepage**:
- Hero: Full-width with background gradient, centered content, h-screen minus nav
- Service showcase: 3-column grid with cards
- Trust section: Client logos/testimonials in 2-column layout
- CTA section: Centered with contrasting background
- Footer: 4-column (About, Services, Contact, Legal)

**App Builder Page**:
- Full-height interface (min-h-screen) with three-panel layout
- Sticky pricing panel during scroll
- Modal for checkout confirmation
- Success page with download button for source code

**Services Pages**:
- Hero with service-specific headline
- Feature grid: 2-column alternating (image/text)
- Pricing table: Side-by-side comparison cards
- FAQ accordion at bottom

## Images

**Hero Section**: 
- Large, high-quality image showing developer workspace or abstract code visualization (1920x1080 min)
- Overlaid with semi-transparent gradient for text readability
- Primary CTA buttons with backdrop-blur-sm backgrounds

**Service Illustrations**:
- Custom app builder: Mockup of drag-drop interface
- Custom coding: Code editor screenshot with clean syntax highlighting
- Repairs: Before/after website comparison

**Placement**: Hero (full-width), service cards (contained), about section (team/workspace photo)

## Interactive Elements

**Buttons**:
- Primary: Prominent, px-8 py-4, rounded-lg, font-semibold
- Secondary: Border style, same padding
- Icon buttons in builder: Square (h-10 w-10), rounded-md

**Component Selection** (App Builder):
- Hover state: Border highlight, slight scale
- Selected state: Checkmark badge, accent border
- Disabled: Opacity reduction, cursor-not-allowed

**Form Validation**:
- Inline error messages (text-sm, below inputs)
- Success states with checkmark icons
- Loading states with spinner in button

## Trust Elements

**Social Proof**:
- Testimonial cards: Client quote, name, role, company logo
- Stats section: Large numbers (text-4xl) with labels
- "Trusted by" logo grid

**Security Indicators**:
- Stripe badge near payment buttons
- SSL/secure checkout messaging
- Money-back guarantee seal if applicable

## Mobile Responsiveness

- All multi-column grids collapse to single column on mobile
- App builder switches to tabbed interface (Components/Preview/Settings)
- Pricing calculator becomes sticky bottom sheet
- Forms stack vertically with full-width inputs