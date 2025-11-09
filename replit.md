# I-DevR Code - Dynamic Service Showcase Website

## Overview
A professional service showcase website for "I-DevR Code" featuring an interactive custom app builder with drag-and-drop components, real-time pricing calculator, and fully functional Stripe payment integration. The site showcases three main services: Custom App Builder, Custom Coding, and Website Repairs, with professional quote request forms and immediate payment processing for app builds.

**Technology Stack:** Full-stack JavaScript (React + Vite + Express + Node.js)

**Status:** Production-ready MVP (November 2025)

---

## Recent Changes

### November 9, 2025
- **Security Enhancement**: Removed admin dashboard and all admin API routes to eliminate unauthenticated access to customer PII
- **Form Refactoring**: Updated Services page quote forms to use proper shadcn Form components with useForm hook and zodResolver for validation
- **Architecture Approval**: Architect verified MVP meets all security, quality, and functionality requirements
- **Final State**: Public-facing website with App Builder, Stripe checkout, quote submissions, and source code download

---

## Project Architecture

### Frontend Structure
```
client/src/
├── pages/
│   ├── Home.tsx              # Hero section, services overview, CTA
│   ├── About.tsx             # Company information, team, values
│   ├── Services.tsx          # Quote request forms (custom coding, repairs)
│   ├── AppBuilder.tsx        # Interactive component builder with pricing
│   ├── Checkout.tsx          # Stripe payment integration
│   └── Success.tsx           # Post-payment download page
├── components/
│   ├── Navigation.tsx        # Site header with logo and navigation
│   ├── Footer.tsx            # Site footer with links and branding
│   └── ui/                   # shadcn components (Button, Card, Form, etc.)
└── lib/
    └── queryClient.ts        # TanStack Query configuration
```

### Backend Structure
```
server/
├── routes.ts                 # All API endpoints
├── storage.ts                # In-memory storage interface
└── stripe-handler.ts         # Stripe payment processing
```

### Data Models (shared/schema.ts)
- **AppBuilderComponent**: Component definitions (id, name, category, price, description)
- **AppBuilderProject**: User-created projects with selected components
- **CustomQuote**: Custom coding quote requests
- **RepairQuote**: Website repair quote requests

---

## Core Features

### 1. Interactive App Builder
- **Component Selection**: Users choose from UI, functionality, and integration components
- **Real-time Pricing**: Dynamic cost calculation as components are selected
- **Visual Preview**: Canvas showing selected components with professional styling
- **Project Persistence**: Projects saved server-side with unique IDs

### 2. Stripe Payment Integration
- **Payment Intent Creation**: Server-side Stripe API integration
- **Secure Checkout**: PCI-compliant payment flow
- **Order Confirmation**: Success page with order details
- **Source Code Delivery**: Automatic ZIP file generation and download

### 3. Quote Request Forms
- **Custom Coding Quotes**: Name, email, project description, budget, timeline
- **Repair Service Quotes**: Name, email, website URL, issue description, priority level
- **Form Validation**: Zod schema validation with shadcn Form components
- **Success Feedback**: Toast notifications for successful submissions

### 4. Professional Design
- **Design Guidelines**: Comprehensive design_guidelines.md with color tokens, typography, spacing
- **Responsive Layout**: Mobile-first design with Tailwind CSS
- **SEO Optimization**: Meta tags, Open Graph tags, descriptive titles
- **Accessibility**: data-testid attributes on all interactive elements

---

## Environment Configuration

### Required Secrets (Replit Secrets)
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key (frontend)
- `STRIPE_SECRET_KEY`: Stripe secret key (backend)
- `SESSION_SECRET`: Express session secret

### Stripe Integration Setup
The project uses the Replit Stripe integration (`javascript_stripe==1.0.0`) which handles:
- API key management and rotation
- Secret storage and environment injection
- Test/production mode switching

---

## API Endpoints

### Public Routes
```
POST   /api/quotes/custom              # Submit custom coding quote
POST   /api/quotes/repair              # Submit repair quote
POST   /api/app-builder/projects       # Save app builder project
GET    /api/app-builder/projects/:id   # Retrieve project by ID
POST   /api/create-payment-intent      # Create Stripe payment intent
GET    /api/download-source/:id        # Download generated source code ZIP
```

### Removed Routes (Security)
- All `/api/admin/*` routes removed to prevent unauthorized access to customer data

---

## Form Implementation Standards

All forms follow the required pattern:
1. **shadcn Form Components**: `<Form>`, `<FormField>`, `<FormItem>`, `<FormControl>`, `<FormMessage>`
2. **react-hook-form**: `useForm` hook with controlled components
3. **Zod Validation**: `zodResolver` with insert schemas from `shared/schema.ts`
4. **Error Handling**: Form validation errors displayed inline, API errors via toast notifications

Example pattern:
```tsx
const form = useForm<InsertCustomQuote>({
  resolver: zodResolver(insertCustomQuoteSchema.extend({
    // Additional validation rules
  })),
  defaultValues: { name: "", email: "", projectDescription: "" }
});

const onSubmit = form.handleSubmit(async (data) => {
  // Mutation logic with TanStack Query
});

return (
  <Form {...form}>
    <form onSubmit={onSubmit}>
      <FormField control={form.control} name="name" render={...} />
    </form>
  </Form>
);
```

---

## Development Workflow

### Running the Application
```bash
npm run dev  # Starts Express server + Vite dev server on same port
```

The workflow "Start application" is configured and runs automatically.

### Testing Approach
- **Manual Testing**: All user journeys tested (app builder, checkout, quote forms)
- **E2E Testing**: Playwright tests recommended for browser interactions
- **Test IDs**: All interactive elements have `data-testid` attributes

### Key User Journeys
1. **Build & Purchase App**: Select components → See pricing → Checkout → Download ZIP
2. **Request Custom Quote**: Fill form → Submit → Receive confirmation
3. **Request Repair Service**: Fill form → Select priority → Submit → Receive confirmation

---

## Design Philosophy

### Visual Design (design_guidelines.md)
- **Color System**: HSL-based tokens with light/dark mode support
- **Typography**: Inter font family, semantic text sizes
- **Spacing**: Consistent padding/margin using Tailwind spacing scale
- **Components**: shadcn/ui components with custom theming

### UI/UX Principles
- **Hover Interactions**: Subtle elevation using `hover-elevate` utility
- **Loading States**: Skeleton loaders and disabled states during mutations
- **Error Handling**: Clear error messages with actionable feedback
- **Responsive Design**: Mobile-first with breakpoints at md/lg

---

## Storage & Data Persistence

### In-Memory Storage (MemStorage)
- **Projects**: Stored with unique IDs for checkout/download
- **Quotes**: Custom and repair quotes stored for future admin access (if auth added)
- **No Database Required**: Simplified MVP using server memory

### Future Considerations
- Add PostgreSQL for production persistence
- Implement admin authentication for quote management
- Add email notifications for quote submissions

---

## Security Considerations

### Current State
- ✅ No admin routes exposing customer PII
- ✅ Stripe secrets stored in Replit Secrets
- ✅ Server-side payment intent creation
- ✅ Input validation with Zod schemas

### Future Enhancements
- Add authentication for admin dashboard
- Implement rate limiting on quote submissions
- Add CAPTCHA to prevent spam
- Set up Stripe webhook signature verification

---

## Deployment Notes

### Pre-Production Checklist
1. ✅ Set production Stripe API keys in Replit Secrets
2. ✅ Verify SEO metadata on all pages
3. ✅ Test checkout flow with Stripe test cards
4. ✅ Confirm ZIP download functionality works
5. ⚠️ Set up Stripe webhooks in production environment
6. ⚠️ Monitor application logs after launch

### Production Stripe Setup
- Configure webhook endpoint in Stripe Dashboard
- Update `STRIPE_WEBHOOK_SECRET` in Replit Secrets
- Test webhook handling with Stripe CLI

---

## Known Limitations

### MVP Scope
- No user authentication system
- No email notifications for quote submissions
- In-memory storage (data lost on server restart)
- Limited component library in app builder
- No admin interface to view quotes

### Future Roadmap
- Add user accounts and project history
- Email integration for quote notifications
- Database persistence (PostgreSQL)
- Expanded component library with more customization
- Admin dashboard with proper authentication
- Analytics and conversion tracking

---

## Team & Contact

**Company**: I-DevR Code  
**Services**: Custom App Builder, Custom Coding, Website Repairs  
**Technology**: Full-stack JavaScript, React, Express, Stripe  
**Last Updated**: November 9, 2025
