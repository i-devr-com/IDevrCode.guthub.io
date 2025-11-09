import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import {
  insertAppProjectSchema,
  insertCustomQuoteSchema,
  insertRepairQuoteSchema,
  insertAdminSettingSchema,
  componentPricing,
  BASE_APP_PRICE,
  type ComponentType
} from "@shared/schema";
import archiver from "archiver";
import { Readable } from "stream";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
});

// Helper function to generate app source code
function generateAppSourceCode(projectName: string, components: ComponentType[]): string {
  const componentCode: Record<ComponentType, string> = {
    "hero": `<!-- Hero Section -->
<section class="hero">
  <h1>${projectName}</h1>
  <p>Welcome to our amazing application</p>
  <button>Get Started</button>
</section>`,
    "header": `<!-- Header -->
<header class="header">
  <nav>
    <div class="logo">${projectName}</div>
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>
</header>`,
    "contact-form": `<!-- Contact Form -->
<section class="contact-form">
  <h2>Contact Us</h2>
  <form>
    <input type="text" placeholder="Name" required />
    <input type="email" placeholder="Email" required />
    <textarea placeholder="Message" required></textarea>
    <button type="submit">Send</button>
  </form>
</section>`,
    "about-section": `<!-- About Section -->
<section class="about">
  <h2>About ${projectName}</h2>
  <p>We are dedicated to providing the best service to our customers.</p>
</section>`,
    "image-gallery": `<!-- Image Gallery -->
<section class="gallery">
  <h2>Gallery</h2>
  <div class="gallery-grid">
    <img src="image1.jpg" alt="Gallery Image 1" />
    <img src="image2.jpg" alt="Gallery Image 2" />
    <img src="image3.jpg" alt="Gallery Image 3" />
  </div>
</section>`,
    "footer": `<!-- Footer -->
<footer class="footer">
  <p>&copy; 2025 ${projectName}. All rights reserved.</p>
  <div class="social-links">
    <a href="#">Facebook</a>
    <a href="#">Twitter</a>
    <a href="#">Instagram</a>
  </div>
</footer>`,
    "feature-grid": `<!-- Feature Grid -->
<section class="features">
  <h2>Our Features</h2>
  <div class="feature-grid">
    <div class="feature">
      <h3>Fast</h3>
      <p>Lightning-fast performance</p>
    </div>
    <div class="feature">
      <h3>Secure</h3>
      <p>Bank-level security</p>
    </div>
    <div class="feature">
      <h3>Reliable</h3>
      <p>99.9% uptime guarantee</p>
    </div>
  </div>
</section>`,
    "testimonials": `<!-- Testimonials -->
<section class="testimonials">
  <h2>What Our Customers Say</h2>
  <div class="testimonial">
    <p>"${projectName} changed my business for the better!"</p>
    <cite>- Happy Customer</cite>
  </div>
</section>`,
    "pricing-table": `<!-- Pricing Table -->
<section class="pricing">
  <h2>Pricing Plans</h2>
  <div class="pricing-grid">
    <div class="plan">
      <h3>Basic</h3>
      <p class="price">$9/mo</p>
      <ul>
        <li>Feature 1</li>
        <li>Feature 2</li>
      </ul>
      <button>Choose Plan</button>
    </div>
    <div class="plan featured">
      <h3>Pro</h3>
      <p class="price">$29/mo</p>
      <ul>
        <li>All Basic features</li>
        <li>Feature 3</li>
        <li>Feature 4</li>
      </ul>
      <button>Choose Plan</button>
    </div>
  </div>
</section>`,
    "cta-section": `<!-- Call to Action -->
<section class="cta">
  <h2>Ready to Get Started?</h2>
  <p>Join thousands of satisfied customers today</p>
  <button>Sign Up Now</button>
</section>`
  };

  const htmlParts = components.map(comp => componentCode[comp]).join('\n\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  ${htmlParts}
  <script src="script.js"></script>
</body>
</html>`;

  const css = `/* ${projectName} Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

section {
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1, h2, h3 {
  margin-bottom: 20px;
}

button {
  background: #007bff;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background: #0056b3;
}

.header {
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.header nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header ul {
  display: flex;
  list-style: none;
  gap: 20px;
}

.header a {
  text-decoration: none;
  color: #333;
}

.hero {
  text-align: center;
  padding: 100px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero h1 {
  font-size: 48px;
}

.contact-form form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 500px;
  margin: 0 auto;
}

.contact-form input,
.contact-form textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.gallery-grid,
.feature-grid,
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.gallery-grid img {
  width: 100%;
  border-radius: 8px;
}

.feature,
.plan {
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
}

.plan.featured {
  border-color: #007bff;
  transform: scale(1.05);
}

.price {
  font-size: 32px;
  font-weight: bold;
  margin: 20px 0;
}

.footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 40px 20px;
}

.footer a {
  color: white;
  margin: 0 10px;
}

.cta {
  text-align: center;
  background: #f8f9fa;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 32px;
  }
  
  .header nav {
    flex-direction: column;
    gap: 20px;
  }
}`;

  const js = `// ${projectName} JavaScript
console.log('${projectName} initialized');

// Form submission handler
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Form submitted! (This is a demo)');
    });
  });
});`;

  const readme = `# ${projectName}

This application was built with I-DevR Code App Builder.

## Components Included
${components.map(c => `- ${c.replace(/-/g, ' ')}`).join('\n')}

## Getting Started

1. Open \`index.html\` in your browser
2. Customize the content in \`index.html\`
3. Modify styles in \`styles.css\`
4. Add functionality in \`script.js\`

## Deployment

You can deploy this app to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

Built with ❤️ by I-DevR Code`;

  return JSON.stringify({
    'index.html': html,
    'styles.css': css,
    'script.js': js,
    'README.md': readme
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // App Builder - Create Project
  app.post("/api/app-builder/projects", async (req, res) => {
    try {
      const data = insertAppProjectSchema.parse(req.body);
      const project = await storage.createAppProject(data);
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid project data: " + error.message });
    }
  });

  // App Builder - Get Project
  app.get("/api/app-builder/projects/:id", async (req, res) => {
    try {
      const project = await storage.getAppProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching project: " + error.message });
    }
  });

  // App Builder - Download Source Code
  app.get("/api/app-builder/download/:id", async (req, res) => {
    try {
      const project = await storage.getAppProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.isPaid !== "true") {
        return res.status(403).json({ message: "Payment required" });
      }

      const sourceCode = generateAppSourceCode(project.projectName, project.components);
      const files = JSON.parse(sourceCode);

      const archive = archiver('zip', { zlib: { level: 9 } });
      
      res.attachment(`${project.projectName}-source-code.zip`);
      archive.pipe(res);

      for (const [filename, content] of Object.entries(files)) {
        archive.append(content as string, { name: filename });
      }

      await archive.finalize();
    } catch (error: any) {
      res.status(500).json({ message: "Error generating download: " + error.message });
    }
  });

  // Stripe - Create Payment Intent
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, projectId } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
        metadata: { projectId }
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Stripe - Webhook Handler
  app.post("/api/stripe-webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const projectId = paymentIntent.metadata.projectId;
        
        if (projectId) {
          await storage.updateAppProjectPayment(projectId, paymentIntent.id);
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      res.status(400).json({ message: `Webhook Error: ${error.message}` });
    }
  });

  // Custom Quotes - Submit
  app.post("/api/quotes/custom", async (req, res) => {
    try {
      const data = insertCustomQuoteSchema.parse(req.body);
      const quote = await storage.createCustomQuote(data);
      res.json(quote);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid quote data: " + error.message });
    }
  });

  // Repair Quotes - Submit
  app.post("/api/quotes/repair", async (req, res) => {
    try {
      const data = insertRepairQuoteSchema.parse(req.body);
      const quote = await storage.createRepairQuote(data);
      res.json(quote);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid quote data: " + error.message });
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}
