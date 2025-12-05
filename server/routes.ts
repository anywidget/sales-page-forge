import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginUserSchema, insertProjectSchema, updateProjectSchema, type PlanType, type PageSection } from "@shared/schema";
import { hash, compare } from "bcrypt";
import { z } from "zod";
import { randomBytes } from "crypto";
import { sendPasswordResetEmail } from "./email";

const PLAN_LIMITS: Record<PlanType, number> = {
  free: 1,
  monthly: 20,
  lifetime: 100,
};

const ALL_THEMES = [
  'classic_red',
  'clean_blue', 
  'money_green',
  'dark_authority',
  'sunset_orange',
  'tech_purple',
  'black_gold',
  'fresh_teal',
  'fire_red',
  'ocean_blue',
  'neon_gamer',
  'minimalist_white'
];

const ALLOWED_THEMES: Record<PlanType, string[]> = {
  free: ["classic_red", "clean_blue", "minimalist_white"],
  monthly: ALL_THEMES,
  lifetime: ALL_THEMES,
};

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const user = await storage.getUser(req.session.userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      const existing = await storage.getUserByEmail(data.email);
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await hash(data.password, 10);
      const user = await storage.createUser({
        email: data.email,
        password: hashedPassword,
      });

      req.session.userId = user.id;
      
      res.json({ 
        id: user.id, 
        email: user.email, 
        plan: user.plan as PlanType,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Register error:", error);
      res.status(500).json({ error: "Failed to register" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginUserSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const valid = await compare(data.password, user.password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      if (user.suspended) {
        return res.status(403).json({ error: "Your account has been suspended. Please contact support." });
      }

      req.session.userId = user.id;
      
      res.json({ 
        id: user.id, 
        email: user.email, 
        plan: user.plan as PlanType,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  // Password reset - request reset email
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      
      // Always return success to prevent email enumeration attacks
      if (!user) {
        return res.json({ success: true, message: "If an account exists with this email, you will receive a password reset link." });
      }

      // Generate secure token
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      // Store token in database
      await storage.createPasswordResetToken(user.id, token, expiresAt);

      // Build reset URL
      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : process.env.REPLIT_DEPLOYMENT_URL 
        ? `https://${process.env.REPLIT_DEPLOYMENT_URL}`
        : 'http://localhost:5000';
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;

      // Send email
      await sendPasswordResetEmail(email, token, resetUrl);

      res.json({ success: true, message: "If an account exists with this email, you will receive a password reset link." });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Failed to process password reset request" });
    }
  });

  // Password reset - verify token is valid
  app.get("/api/auth/verify-reset-token", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: "Token is required" });
      }

      const resetToken = await storage.getPasswordResetToken(token);
      
      if (!resetToken) {
        return res.status(400).json({ error: "Invalid or expired reset link" });
      }

      if (resetToken.usedAt) {
        return res.status(400).json({ error: "This reset link has already been used" });
      }

      if (new Date() > new Date(resetToken.expiresAt)) {
        return res.status(400).json({ error: "This reset link has expired" });
      }

      res.json({ valid: true });
    } catch (error) {
      console.error("Verify reset token error:", error);
      res.status(500).json({ error: "Failed to verify reset token" });
    }
  });

  // Password reset - set new password
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: "Token is required" });
      }

      if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const resetToken = await storage.getPasswordResetToken(token);
      
      if (!resetToken) {
        return res.status(400).json({ error: "Invalid or expired reset link" });
      }

      if (resetToken.usedAt) {
        return res.status(400).json({ error: "This reset link has already been used" });
      }

      if (new Date() > new Date(resetToken.expiresAt)) {
        return res.status(400).json({ error: "This reset link has expired" });
      }

      // Hash new password and update user
      const hashedPassword = await hash(password, 10);
      await storage.updateUserPassword(resetToken.userId, hashedPassword);

      // Mark token as used
      await storage.markPasswordResetTokenUsed(token);

      res.json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "User not found" });
    }

    res.json({ 
      id: user.id, 
      email: user.email, 
      plan: user.plan as PlanType,
      isAdmin: user.isAdmin 
    });
  });

  app.post("/api/auth/upgrade", requireAuth, async (req, res) => {
    try {
      const { plan } = req.body as { plan: PlanType };
      if (!["free", "monthly", "lifetime"].includes(plan)) {
        return res.status(400).json({ error: "Invalid plan" });
      }

      const user = await storage.updateUserPlan(req.session.userId!, plan);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ 
        id: user.id, 
        email: user.email, 
        plan: user.plan as PlanType,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      console.error("Upgrade error:", error);
      res.status(500).json({ error: "Failed to upgrade plan" });
    }
  });

  app.get("/api/projects", requireAuth, async (req, res) => {
    try {
      const projects = await storage.getProjectsByUser(req.session.userId!);
      res.json(projects);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      if (project.userId !== req.session.userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(project);
    } catch (error) {
      console.error("Get project error:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const plan = user.plan as PlanType;
      const projectCount = await storage.countProjectsByUser(user.id);
      const maxProjects = PLAN_LIMITS[plan];

      if (projectCount >= maxProjects) {
        return res.status(403).json({ 
          error: `Project limit reached (${maxProjects}). Upgrade your plan for more projects.` 
        });
      }

      const allowedThemes = ALLOWED_THEMES[plan];
      const theme = req.body.theme || "clean_marketer";
      if (!allowedThemes.includes(theme)) {
        return res.status(403).json({ 
          error: `Theme "${theme}" not available on your plan. Upgrade to access all themes.` 
        });
      }

      const data = insertProjectSchema.parse({
        ...req.body,
        userId: user.id,
        sections: req.body.sections || [],
      });

      const project = await storage.createProject(data);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Create project error:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      if (project.userId !== req.session.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const plan = user.plan as PlanType;
      if (req.body.theme) {
        const allowedThemes = ALLOWED_THEMES[plan];
        if (!allowedThemes.includes(req.body.theme)) {
          return res.status(403).json({ 
            error: `Theme "${req.body.theme}" not available on your plan.` 
          });
        }
      }

      const data = updateProjectSchema.parse(req.body);
      const updated = await storage.updateProject(req.params.id, data);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Update project error:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      if (project.userId !== req.session.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      await storage.deleteProject(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete project error:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  app.post("/api/projects/:id/duplicate", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const plan = user.plan as PlanType;
      if (plan !== "lifetime") {
        return res.status(403).json({ error: "Duplicate feature requires Lifetime plan" });
      }

      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      if (project.userId !== req.session.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const sections = (project.sections as PageSection[]).map((s, i) => ({
        ...s,
        id: `section-${Date.now()}-${i}`,
      }));

      const duplicated = await storage.createProject({
        userId: user.id,
        name: `${project.name} (Copy)`,
        type: project.type,
        theme: project.theme,
        sections,
      });

      res.json(duplicated);
    } catch (error) {
      console.error("Duplicate project error:", error);
      res.status(500).json({ error: "Failed to duplicate project" });
    }
  });

  app.get("/api/projects/:id/export/html", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      if (project.userId !== req.session.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const plan = user.plan as PlanType;
      const canDownloadHtml = plan === "monthly" || plan === "lifetime";

      if (!canDownloadHtml) {
        return res.status(403).json({ error: "HTML download requires a paid plan" });
      }

      const sections = project.sections as PageSection[];
      const hasWatermark = false;

      res.json({
        projectName: project.name,
        projectType: project.type,
        theme: project.theme,
        sections,
        hasWatermark,
        canExport: true,
      });
    } catch (error) {
      console.error("Export HTML error:", error);
      res.status(500).json({ error: "Failed to export HTML" });
    }
  });

  app.get("/api/projects/:id/export/json", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      if (project.userId !== req.session.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const plan = user.plan as PlanType;
      if (plan !== "lifetime") {
        return res.status(403).json({ error: "JSON export requires Lifetime plan" });
      }

      res.json({
        name: project.name,
        type: project.type,
        theme: project.theme,
        sections: project.sections,
        exportedAt: new Date().toISOString(),
        version: "1.0",
      });
    } catch (error) {
      console.error("Export JSON error:", error);
      res.status(500).json({ error: "Failed to export JSON" });
    }
  });

  app.get("/api/user/api-keys", requireAuth, async (req, res) => {
    try {
      const keys = await storage.getUserApiKeys(req.session.userId!);
      res.json(keys);
    } catch (error) {
      console.error("Get API keys error:", error);
      res.status(500).json({ error: "Failed to get API keys" });
    }
  });

  app.post("/api/user/api-keys", requireAuth, async (req, res) => {
    try {
      const { provider, apiKey } = req.body;
      
      const validProviders = ["openai", "anthropic", "google", "pexels", "unsplash", "pixabay"];
      if (!validProviders.includes(provider)) {
        return res.status(400).json({ error: "Invalid provider" });
      }
      
      if (!apiKey || typeof apiKey !== "string" || apiKey.length < 10) {
        return res.status(400).json({ error: "Invalid API key" });
      }

      await storage.setUserApiKey(req.session.userId!, provider, apiKey);
      res.json({ success: true });
    } catch (error) {
      console.error("Set API key error:", error);
      res.status(500).json({ error: "Failed to set API key" });
    }
  });

  app.delete("/api/user/api-keys/:provider", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteUserApiKey(req.session.userId!, req.params.provider);
      if (!deleted) {
        return res.status(404).json({ error: "API key not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Delete API key error:", error);
      res.status(500).json({ error: "Failed to delete API key" });
    }
  });

  app.post("/api/ai/generate-copy", requireAuth, async (req, res) => {
    try {
      const { provider, prompt, productName, productType, copyLength = 'standard' } = req.body;
      
      const apiKey = await storage.getUserApiKey(req.session.userId!, provider);
      if (!apiKey) {
        return res.status(400).json({ error: `No ${provider} API key configured. Add it in Settings.` });
      }

      // Provider-specific token limits (conservative to leave room for prompt)
      const providerMaxTokens: Record<string, number> = {
        openai: 4000,      // GPT-4o: 4096 max, leaving headroom
        anthropic: 4000,   // Claude: conservative to avoid truncation
        google: 4000,      // Gemini: conservative for reliability
      };

      // Copy length configurations - conservative for all providers
      const lengthConfig: Record<string, { words: number; tokens: number; sections: string }> = {
        short: { words: 1500, tokens: 2000, sections: '8-12' },
        standard: { words: 3000, tokens: 3500, sections: '12-18' },
        extended: { words: 4500, tokens: 4000, sections: '15-25' },
      };

      const config = lengthConfig[copyLength] || lengthConfig.standard;
      const maxTokens = Math.min(config.tokens, providerMaxTokens[provider] || 4000);

      let generatedCopy = "";

      const systemPrompt = `You are an elite direct response copywriter who writes WarriorPlus and ClickBank style sales letters. You write LONG, comprehensive, emotionally compelling sales copy that converts cold traffic into buyers.

Your sales letters are famous for:
- Multiple pages of engaging content (${config.words}+ words minimum)
- Dramatic storytelling that hooks readers
- Dozens of benefit-focused bullet points
- Multiple testimonial sections
- Stacked bonuses that increase perceived value
- Urgency and scarcity that drives action
- Ironclad guarantees that eliminate risk
- Multiple calls to action throughout

You MUST use the following section markers to structure your output. Each section must be clearly marked:

<SECTION:hero>
Main headline and subheadline
</SECTION:hero>

<SECTION:story>
Opening story/hook that connects with the reader's pain
</SECTION:story>

<SECTION:problem>
Problem agitation - make them feel the pain
</SECTION:problem>

<SECTION:solution>
Introduce the product as the solution
</SECTION:solution>

<SECTION:bullets1>
First set of benefit bullets (at least 10-15 bullets)
</SECTION:bullets1>

<SECTION:features>
Key features with benefit explanations
</SECTION:features>

<SECTION:bullets2>
Second set of benefit bullets (at least 10-15 more bullets)
</SECTION:bullets2>

<SECTION:testimonial1>
First testimonial
</SECTION:testimonial1>

<SECTION:testimonial2>
Second testimonial
</SECTION:testimonial2>

<SECTION:testimonial3>
Third testimonial
</SECTION:testimonial3>

<SECTION:bonus1>
First bonus with value
</SECTION:bonus1>

<SECTION:bonus2>
Second bonus with value
</SECTION:bonus2>

<SECTION:bonus3>
Third bonus with value
</SECTION:bonus3>

<SECTION:bullets3>
Third set of benefit bullets (more unique benefits)
</SECTION:bullets3>

<SECTION:guarantee>
Money-back guarantee section
</SECTION:guarantee>

<SECTION:faq>
Frequently asked questions (at least 5-8 questions)
</SECTION:faq>

<SECTION:urgency>
Urgency and scarcity messaging
</SECTION:urgency>

<SECTION:cta>
Final call to action with price
</SECTION:cta>

<SECTION:ps>
P.S. and P.P.S. sections
</SECTION:ps>

Write at least ${config.words} words of compelling sales copy. Be verbose, emotional, and persuasive. Use power words, create vivid mental images, and write as if you're having a one-on-one conversation with the reader.`;

      const userPrompt = `${prompt ? prompt + '\n\n' : ''}Write a complete, LONG-FORM sales letter (${config.words}+ words, ${config.sections} sections) for:

Product Name: ${productName}
Product Type: ${productType}

IMPORTANT REQUIREMENTS:
1. Write AT LEAST ${config.words} words - this should be a LONG sales letter
2. Include ALL section markers as specified
3. Each bullet section should have 10-15 unique benefit bullets minimum
4. Create compelling, realistic testimonials with names and specific results
5. Stack 3 valuable bonuses with specific dollar values
6. Write emotional, persuasive copy that creates desire
7. Use urgency triggers (limited time, limited quantity, price increase)
8. Include a strong guarantee (30, 60, or 90 day)
9. Add P.S. and P.P.S. sections at the end

Make this sales letter COMPREHENSIVE and LONG. A typical WarriorPlus sales page has 20-30+ sections and thousands of words of copy. Do not be brief - be thorough and persuasive.`;

      if (provider === "openai") {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            max_tokens: maxTokens,
          }),
        });
        
        if (!response.ok) {
          const error = await response.text();
          throw new Error(`OpenAI API error: ${error}`);
        }
        
        const data = await response.json();
        generatedCopy = data.choices[0].message.content;
      } else if (provider === "anthropic") {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: maxTokens,
            system: systemPrompt,
            messages: [
              { role: "user", content: userPrompt }
            ],
          }),
        });
        
        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Anthropic API error: ${error}`);
        }
        
        const data = await response.json();
        generatedCopy = data.content[0].text;
      } else if (provider === "google") {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
            }],
            generationConfig: {
              maxOutputTokens: maxTokens,
            },
          }),
        });
        
        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Google API error: ${error}`);
        }
        
        const data = await response.json();
        generatedCopy = data.candidates[0].content.parts[0].text;
      }

      res.json({ copy: generatedCopy });
    } catch (error) {
      console.error("AI generate error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to generate copy" });
    }
  });

  app.get("/api/images/search", requireAuth, async (req, res) => {
    try {
      const { provider, query, page = "1" } = req.query as { provider: string; query: string; page?: string };
      
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const apiKey = await storage.getUserApiKey(req.session.userId!, provider);
      if (!apiKey) {
        return res.status(400).json({ error: `No ${provider} API key configured. Add it in Settings.` });
      }

      let images: { id: string; url: string; thumb: string; photographer: string; alt: string }[] = [];

      if (provider === "pexels") {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20&page=${page}`, {
          headers: { "Authorization": apiKey },
        });
        
        if (!response.ok) throw new Error("Pexels API error");
        
        const data = await response.json();
        images = data.photos.map((p: any) => ({
          id: p.id.toString(),
          url: p.src.large,
          thumb: p.src.medium,
          photographer: p.photographer,
          alt: p.alt || query,
        }));
      } else if (provider === "unsplash") {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&page=${page}`, {
          headers: { "Authorization": `Client-ID ${apiKey}` },
        });
        
        if (!response.ok) throw new Error("Unsplash API error");
        
        const data = await response.json();
        images = data.results.map((p: any) => ({
          id: p.id,
          url: p.urls.regular,
          thumb: p.urls.small,
          photographer: p.user.name,
          alt: p.alt_description || query,
        }));
      } else if (provider === "pixabay") {
        const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&per_page=20&page=${page}&image_type=photo`);
        
        if (!response.ok) throw new Error("Pixabay API error");
        
        const data = await response.json();
        images = data.hits.map((p: any) => ({
          id: p.id.toString(),
          url: p.largeImageURL,
          thumb: p.webformatURL,
          photographer: p.user,
          alt: p.tags,
        }));
      }

      res.json({ images });
    } catch (error) {
      console.error("Image search error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to search images" });
    }
  });

  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Admin stats error:", error);
      res.status(500).json({ error: "Failed to get admin stats" });
    }
  });

  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const safeUsers = users.map(u => ({
        id: u.id,
        email: u.email,
        plan: u.plan,
        isAdmin: u.isAdmin,
        suspended: u.suspended,
        suspendedAt: u.suspendedAt,
        createdAt: u.createdAt,
        projectCount: u.projectCount
      }));
      res.json(safeUsers);
    } catch (error) {
      console.error("Admin get users error:", error);
      res.status(500).json({ error: "Failed to get users" });
    }
  });

  app.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const { plan, isAdmin } = req.body;
      
      const updateData: { plan?: PlanType; isAdmin?: boolean } = {};
      if (plan && ["free", "monthly", "lifetime"].includes(plan)) {
        updateData.plan = plan as PlanType;
      }
      if (typeof isAdmin === "boolean") {
        updateData.isAdmin = isAdmin;
      }

      const user = await storage.updateUser(req.params.id, updateData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        plan: user.plan,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      });
    } catch (error) {
      console.error("Admin update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      if (req.params.id === req.session.userId) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }

      const deleted = await storage.deleteUser(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Admin delete user error:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  app.post("/api/admin/users/:id/suspend", requireAdmin, async (req, res) => {
    try {
      if (req.params.id === req.session.userId) {
        return res.status(400).json({ error: "Cannot suspend your own account" });
      }

      const user = await storage.suspendUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        plan: user.plan,
        isAdmin: user.isAdmin,
        suspended: user.suspended,
        suspendedAt: user.suspendedAt,
        createdAt: user.createdAt
      });
    } catch (error) {
      console.error("Admin suspend user error:", error);
      res.status(500).json({ error: "Failed to suspend user" });
    }
  });

  app.post("/api/admin/users/:id/reactivate", requireAdmin, async (req, res) => {
    try {
      const user = await storage.reactivateUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        plan: user.plan,
        isAdmin: user.isAdmin,
        suspended: user.suspended,
        suspendedAt: user.suspendedAt,
        createdAt: user.createdAt
      });
    } catch (error) {
      console.error("Admin reactivate user error:", error);
      res.status(500).json({ error: "Failed to reactivate user" });
    }
  });

  app.get("/api/admin/projects", requireAdmin, async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Admin get projects error:", error);
      res.status(500).json({ error: "Failed to get projects" });
    }
  });

  app.get("/api/admin/projects/:id/full", requireAdmin, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const user = await storage.getUser(project.userId);
      res.json({
        ...project,
        userEmail: user?.email || 'Unknown',
      });
    } catch (error) {
      console.error("Admin get project error:", error);
      res.status(500).json({ error: "Failed to get project" });
    }
  });

  app.delete("/api/admin/projects/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.adminDeleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Admin delete project error:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  return httpServer;
}
