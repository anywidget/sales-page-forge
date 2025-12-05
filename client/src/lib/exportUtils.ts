import type { PageSection, ThemeType } from './projectTypes';

// Strip HTML tags from content
const stripHtml = (html: string | undefined): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

const THEME_CSS: Record<ThemeType, string> = {
  classic_red: `
    :root {
      --bg-gradient-start: #fffef0;
      --bg-gradient-end: #fef3c7;
      --text-color: #1f2937;
      --accent-color: #dc2626;
      --button-bg: #dc2626;
      --button-hover: #b91c1c;
      --button-text: #ffffff;
      --card-bg: #ffffff;
      --card-border: #fcd34d;
    }
  `,
  clean_blue: `
    :root {
      --bg-gradient-start: #ffffff;
      --bg-gradient-end: #f0f9ff;
      --text-color: #1e293b;
      --accent-color: #2563eb;
      --button-bg: #2563eb;
      --button-hover: #1d4ed8;
      --button-text: #ffffff;
      --card-bg: #ffffff;
      --card-border: #bfdbfe;
    }
  `,
  money_green: `
    :root {
      --bg-gradient-start: #f0fdf4;
      --bg-gradient-end: #dcfce7;
      --text-color: #14532d;
      --accent-color: #16a34a;
      --button-bg: #ca8a04;
      --button-hover: #a16207;
      --button-text: #ffffff;
      --card-bg: #ffffff;
      --card-border: #86efac;
    }
  `,
  dark_authority: `
    :root {
      --bg-gradient-start: #111827;
      --bg-gradient-end: #1f2937;
      --text-color: #f3f4f6;
      --accent-color: #60a5fa;
      --button-bg: #3b82f6;
      --button-hover: #2563eb;
      --button-text: #ffffff;
      --card-bg: #1f2937;
      --card-border: #374151;
    }
  `,
  sunset_orange: `
    :root {
      --bg-gradient-start: #fffbeb;
      --bg-gradient-end: #fff7ed;
      --text-color: #1c1917;
      --accent-color: #ea580c;
      --button-bg: #ea580c;
      --button-hover: #c2410c;
      --button-text: #ffffff;
      --card-bg: #ffffff;
      --card-border: #fed7aa;
    }
  `,
  tech_purple: `
    :root {
      --bg-gradient-start: #faf5ff;
      --bg-gradient-end: #f3e8ff;
      --text-color: #1e1b4b;
      --accent-color: #7c3aed;
      --button-bg: #7c3aed;
      --button-hover: #6d28d9;
      --button-text: #ffffff;
      --card-bg: #ffffff;
      --card-border: #c4b5fd;
    }
  `,
  black_gold: `
    :root {
      --bg-gradient-start: #0a0a0a;
      --bg-gradient-end: #171717;
      --text-color: #fafafa;
      --accent-color: #ca8a04;
      --button-bg: #ca8a04;
      --button-hover: #a16207;
      --button-text: #000000;
      --card-bg: #171717;
      --card-border: rgba(202, 138, 4, 0.3);
    }
  `,
  fresh_teal: `
    :root {
      --bg-gradient-start: #f0fdfa;
      --bg-gradient-end: #ccfbf1;
      --text-color: #134e4a;
      --accent-color: #0d9488;
      --button-bg: #0d9488;
      --button-hover: #0f766e;
      --button-text: #ffffff;
      --card-bg: #ffffff;
      --card-border: #99f6e4;
    }
  `,
  fire_red: `
    :root {
      --bg-gradient-start: #1a1a1a;
      --bg-gradient-end: #262626;
      --text-color: #fafafa;
      --accent-color: #ef4444;
      --button-bg: #ef4444;
      --button-hover: #dc2626;
      --button-text: #ffffff;
      --card-bg: #262626;
      --card-border: #404040;
    }
  `,
  ocean_blue: `
    :root {
      --bg-gradient-start: #f0f9ff;
      --bg-gradient-end: #e0f2fe;
      --text-color: #0c4a6e;
      --accent-color: #0284c7;
      --button-bg: #0284c7;
      --button-hover: #0369a1;
      --button-text: #ffffff;
      --card-bg: #ffffff;
      --card-border: #7dd3fc;
    }
  `,
  neon_gamer: `
    :root {
      --bg-gradient-start: #0f0f23;
      --bg-gradient-end: #1a1a2e;
      --text-color: #e0e0ff;
      --accent-color: #00ff88;
      --button-bg: #00ff88;
      --button-hover: #00cc6a;
      --button-text: #000000;
      --card-bg: rgba(26, 26, 46, 0.8);
      --card-border: rgba(0, 255, 136, 0.3);
    }
  `,
  minimalist_white: `
    :root {
      --bg-gradient-start: #ffffff;
      --bg-gradient-end: #fafafa;
      --text-color: #171717;
      --accent-color: #171717;
      --button-bg: #171717;
      --button-hover: #262626;
      --button-text: #ffffff;
      --card-bg: #ffffff;
      --card-border: #e5e5e5;
    }
  `,
};

const BASE_CSS = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(to bottom, var(--bg-gradient-start), var(--bg-gradient-end));
    color: var(--text-color);
    min-height: 100vh;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
  .hero {
    min-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 80px 24px;
    background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7));
  }
  .hero h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    margin-bottom: 16px;
    line-height: 1.2;
    color: #ffffff;
  }
  .hero p {
    font-size: clamp(1rem, 2vw, 1.25rem);
    color: #e5e7eb;
    margin-bottom: 32px;
    max-width: 640px;
    margin-left: auto;
    margin-right: auto;
  }
  .btn {
    display: inline-block;
    padding: 16px 48px;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--button-text);
    background: var(--button-bg);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  }
  .section {
    padding: 64px 24px;
  }
  .subheadline {
    font-size: clamp(1.25rem, 2vw, 1.5rem);
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
  }
  .video-wrapper {
    max-width: 900px;
    margin: 0 auto;
    aspect-ratio: 16/9;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  }
  .video-wrapper iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  .bullets {
    max-width: 640px;
    margin: 0 auto;
  }
  .bullets h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 24px;
  }
  .bullets ul {
    list-style: none;
  }
  .bullets li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 1.125rem;
    margin-bottom: 16px;
  }
  .bullets .check {
    color: var(--accent-color);
    font-size: 1.25rem;
  }
  .card {
    max-width: 640px;
    margin: 0 auto;
    padding: 32px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 12px;
  }
  .testimonial-quote {
    font-size: 1.125rem;
    font-style: italic;
    margin-bottom: 16px;
    line-height: 1.6;
  }
  .testimonial-author {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .testimonial-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--accent-color);
  }
  .testimonial-name {
    font-weight: 600;
  }
  .testimonial-role {
    font-size: 0.875rem;
    opacity: 0.7;
  }
  .cta {
    text-align: center;
    background: rgba(0,0,0,0.2);
    padding: 80px 24px;
  }
  .cta h2 {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700;
    margin-bottom: 16px;
  }
  .scarcity {
    color: #ef4444;
    font-weight: 600;
    margin-bottom: 16px;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .guarantee-badge {
    font-size: 0.875rem;
    opacity: 0.7;
    margin-top: 16px;
  }
  .divider {
    max-width: 640px;
    margin: 0 auto;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(128,128,128,0.5), transparent);
  }
  .guarantee {
    text-align: center;
  }
  .guarantee-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 16px;
    background: rgba(var(--accent-color), 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
  }
  .guarantee h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .jv-commissions .tier {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    background: rgba(0,0,0,0.2);
    border-radius: 8px;
    margin-bottom: 8px;
  }
  .jv-commissions .commission {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent-color);
  }
  .badge-row {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
    flex-wrap: wrap;
  }
  .badge {
    padding: 8px 16px;
    background: rgba(255,255,255,0.1);
    border-radius: 9999px;
    font-size: 0.875rem;
  }
  .watermark {
    text-align: center;
    padding: 16px;
    background: rgba(0,0,0,0.8);
    font-size: 0.75rem;
    color: #9ca3af;
  }
`;

function renderSectionHtml(section: PageSection): string {
  const data = section.data;

  switch (section.type) {
    case 'hero':
      return `
        <section class="hero">
          <div class="container">
            <h1>${stripHtml(data.headline as string) || 'Your Headline Here'}</h1>
            <p>${stripHtml(data.subheadline as string) || 'Your compelling subheadline goes here'}</p>
            <a href="${(data.buttonUrl as string) || '#'}" class="btn">${stripHtml(data.buttonText as string) || 'Get Started Now'}</a>
          </div>
        </section>
      `;

    case 'subheadline':
      return `
        <section class="section">
          <p class="subheadline">${stripHtml(data.text as string) || 'Your subheadline text here...'}</p>
        </section>
      `;

    case 'video':
      return `
        <section class="section">
          <div class="video-wrapper">
            ${(data.embedUrl as string) ? `<iframe src="${data.embedUrl}" allowfullscreen></iframe>` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#1f2937;color:#9ca3af;">Video Placeholder</div>'}
          </div>
          ${(data.caption as string) ? `<p style="text-align:center;margin-top:16px;opacity:0.8;">${stripHtml(data.caption as string)}</p>` : ''}
        </section>
      `;

    case 'bullets':
      const items = (data.items as string[]) || [];
      return `
        <section class="section bullets">
          ${(data.title as string) ? `<h3>${stripHtml(data.title as string)}</h3>` : ''}
          <ul>
            ${items.map(item => `<li><span class="check">✓</span><span>${stripHtml(item)}</span></li>`).join('\n            ')}
          </ul>
        </section>
      `;

    case 'testimonial':
      return `
        <section class="section">
          <div class="card">
            <p class="testimonial-quote">"${stripHtml(data.quote as string) || 'Customer testimonial goes here...'}"</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar"></div>
              <div>
                <div class="testimonial-name">${stripHtml(data.name as string) || 'Customer Name'}</div>
                <div class="testimonial-role">${stripHtml(data.role as string) || 'Role'}</div>
              </div>
            </div>
          </div>
        </section>
      `;

    case 'cta':
      return `
        <section class="cta">
          <div class="container">
            <h2>${stripHtml(data.headline as string) || 'Ready to Get Started?'}</h2>
            ${(data.scarcityText as string) ? `<p class="scarcity">${stripHtml(data.scarcityText as string)}</p>` : ''}
            <a href="${(data.buttonUrl as string) || '#'}" class="btn">${stripHtml(data.buttonText as string) || 'Get Started Now'}</a>
            ${(data.guaranteeText as string) ? `<p class="guarantee-badge">${stripHtml(data.guaranteeText as string)}</p>` : ''}
          </div>
        </section>
      `;

    case 'divider':
      return `
        <section class="section">
          <div class="divider"></div>
        </section>
      `;

    case 'guarantee':
      return `
        <section class="section">
          <div class="card guarantee">
            <div class="guarantee-icon">🛡️</div>
            <h3>${stripHtml(data.title as string) || '30-Day Money Back Guarantee'}</h3>
            <p style="opacity:0.8;">${stripHtml(data.description as string) || 'Try it risk-free. If you are not satisfied, get a full refund.'}</p>
          </div>
        </section>
      `;

    case 'jv_commissions':
      const tiers = (data.tiers as Array<{name: string; commission: string}>) || [];
      return `
        <section class="section">
          <div class="card jv-commissions">
            <h3 style="text-align:center;font-size:1.5rem;margin-bottom:24px;">${stripHtml(data.headline as string) || 'Earn 50% Commissions'}</h3>
            ${tiers.map(tier => `
              <div class="tier">
                <span>${stripHtml(tier.name)}</span>
                <span class="commission">${stripHtml(tier.commission)}</span>
              </div>
            `).join('\n            ')}
            <div class="badge-row">
              <span class="badge">EPC: ${(data.epc as string) || '$2.50'}</span>
              <span class="badge">Cookie: ${(data.cookieDuration as string) || '60 days'}</span>
            </div>
          </div>
        </section>
      `;

    case 'bonus_stack':
      const bonuses = (data.bonuses as Array<{title: string; description: string; value: string}>) || [];
      return `
        <section class="section">
          <div style="max-width:800px;margin:0 auto;">
            <h3 style="text-align:center;font-size:2rem;margin-bottom:8px;">${stripHtml(data.title as string) || 'But Wait... There\'s More!'}</h3>
            <p style="text-align:center;margin-bottom:32px;opacity:0.8;">Order now and get these exclusive bonuses FREE:</p>
            ${bonuses.map((bonus, i) => `
              <div class="card" style="display:flex;align-items:center;gap:24px;margin-bottom:16px;">
                <div style="width:48px;height:48px;border-radius:50%;background:var(--accent-color);color:white;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:1.5rem;">${i + 1}</div>
                <div style="flex:1;">
                  <h4 style="font-weight:bold;font-size:1.25rem;margin-bottom:4px;">${stripHtml(bonus.title)}</h4>
                  <p style="opacity:0.8;">${stripHtml(bonus.description)}</p>
                </div>
                <div style="text-align:right;">
                  <span style="font-size:1.5rem;font-weight:bold;color:var(--accent-color);">${stripHtml(bonus.value)}</span>
                  <span style="display:block;font-size:0.875rem;opacity:0.6;">Value</span>
                </div>
              </div>
            `).join('')}
            ${(data.totalValue as string) ? `<p style="text-align:center;font-size:1.25rem;margin-top:24px;">Total Bonus Value: <strong style="color:var(--accent-color);">${data.totalValue}</strong></p>` : ''}
          </div>
        </section>
      `;

    case 'faq':
      const faqItems = (data.items as Array<{question: string; answer: string}>) || [];
      return `
        <section class="section">
          <div style="max-width:800px;margin:0 auto;">
            <h3 style="text-align:center;font-size:2rem;margin-bottom:32px;">Frequently Asked Questions</h3>
            ${faqItems.map(item => `
              <div class="card" style="margin-bottom:16px;">
                <h4 style="font-weight:bold;margin-bottom:8px;">Q: ${stripHtml(item.question)}</h4>
                <p style="opacity:0.8;">A: ${stripHtml(item.answer)}</p>
              </div>
            `).join('')}
          </div>
        </section>
      `;

    case 'feature_grid':
      const features = (data.features as Array<{icon: string; title: string; description: string}>) || [];
      const cols = (data.columns as number) || 3;
      return `
        <section class="section">
          <div style="max-width:1000px;margin:0 auto;">
            ${(data.headline as string) ? `<h3 style="text-align:center;font-size:2rem;margin-bottom:32px;">${data.headline}</h3>` : ''}
            <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:24px;">
              ${features.map(f => `
                <div class="card" style="text-align:center;">
                  <div style="width:56px;height:56px;margin:0 auto 16px;border-radius:50%;background:var(--accent-color);display:flex;align-items:center;justify-content:center;font-size:1.5rem;">&#10003;</div>
                  <h4 style="font-weight:bold;font-size:1.25rem;margin-bottom:8px;">${stripHtml(f.title)}</h4>
                  <p style="opacity:0.8;">${stripHtml(f.description)}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;

    case 'jv_calendar':
      return `
        <section class="section">
          <div class="card" style="max-width:640px;margin:0 auto;">
            <h3 style="text-align:center;font-size:1.5rem;margin-bottom:24px;">Launch Schedule</h3>
            <div style="display:grid;gap:16px;">
              <div style="display:flex;justify-content:space-between;padding:16px;background:rgba(0,0,0,0.1);border-radius:8px;">
                <span>Launch Date</span><strong style="color:var(--accent-color);">${(data.launchDate as string) || 'TBA'}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;padding:16px;background:rgba(0,0,0,0.1);border-radius:8px;">
                <span>Cart Opens</span><strong>${(data.cartOpen as string) || '9:00 AM EST'}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;padding:16px;background:rgba(0,0,0,0.1);border-radius:8px;">
                <span>Cart Closes</span><strong>${(data.cartClose as string) || '11:59 PM EST'}</strong>
              </div>
              ${(data.webinarTime as string) ? `<div style="display:flex;justify-content:space-between;padding:16px;background:rgba(0,0,0,0.1);border-radius:8px;"><span>Webinar</span><strong>${data.webinarTime}</strong></div>` : ''}
            </div>
          </div>
        </section>
      `;

    case 'jv_prizes':
      const prizes = (data.prizes as Array<{position: string; amount: string}>) || [];
      return `
        <section class="section">
          <div class="card" style="max-width:640px;margin:0 auto;">
            <h3 style="text-align:center;font-size:1.5rem;margin-bottom:24px;">${stripHtml(data.headline as string) || 'Win Amazing Prizes'}</h3>
            ${prizes.map((p, i) => `
              <div style="display:flex;justify-content:space-between;padding:16px;margin-bottom:8px;border-radius:8px;${i === 0 ? 'background:linear-gradient(to right,rgba(234,179,8,0.2),rgba(245,158,11,0.2));border:2px solid rgba(234,179,8,0.5);' : 'background:rgba(0,0,0,0.1);'}">
                <span style="font-weight:bold;">${p.position} Place</span>
                <span style="font-size:1.5rem;font-weight:bold;color:var(--accent-color);">${p.amount}</span>
              </div>
            `).join('')}
          </div>
        </section>
      `;

    case 'pricing_table':
      const packages = (data.packages as Array<{name: string; price: string; originalPrice?: string; features: string[]; buttonText: string; highlighted?: boolean}>) || [];
      return `
        <section class="section">
          <div style="max-width:1000px;margin:0 auto;">
            <h3 style="text-align:center;font-size:2rem;margin-bottom:8px;">${stripHtml(data.headline as string) || 'Choose Your Package'}</h3>
            ${(data.subheadline as string) ? `<p style="text-align:center;margin-bottom:32px;opacity:0.8;">${data.subheadline}</p>` : ''}
            <div style="display:grid;grid-template-columns:repeat(${packages.length},1fr);gap:24px;">
              ${packages.map(pkg => `
                <div class="card" style="${pkg.highlighted ? 'transform:scale(1.05);box-shadow:0 20px 40px rgba(0,0,0,0.2);' : ''}">
                  ${pkg.highlighted ? '<div style="text-align:center;padding:8px;background:var(--accent-color);color:white;font-weight:bold;border-radius:8px 8px 0 0;margin:-32px -32px 16px;">MOST POPULAR</div>' : ''}
                  <h4 style="text-align:center;font-size:1.25rem;font-weight:bold;margin-bottom:8px;">${pkg.name}</h4>
                  <div style="text-align:center;margin-bottom:16px;">
                    ${pkg.originalPrice ? `<span style="text-decoration:line-through;opacity:0.5;margin-right:8px;">${pkg.originalPrice}</span>` : ''}
                    <span style="font-size:2.5rem;font-weight:bold;color:var(--accent-color);">${pkg.price}</span>
                  </div>
                  <ul style="margin-bottom:24px;">
                    ${pkg.features.map(f => `<li style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"><span style="color:var(--accent-color);">&#10003;</span>${f}</li>`).join('')}
                  </ul>
                  <a href="#" class="btn" style="display:block;text-align:center;">${pkg.buttonText || 'Get Started'}</a>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;

    case 'countdown_timer':
      return `
        <section class="section">
          <div class="card" style="max-width:640px;margin:0 auto;text-align:center;border:2px solid rgba(239,68,68,0.5);">
            <h3 style="font-size:1.5rem;margin-bottom:8px;">${stripHtml(data.headline as string) || 'This Offer Expires In:'}</h3>
            <div style="display:flex;justify-content:center;gap:16px;margin:24px 0;">
              <div style="text-align:center;"><div style="width:64px;height:64px;background:var(--accent-color);color:white;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:bold;">00</div><span style="font-size:0.75rem;opacity:0.7;">Days</span></div>
              <div style="text-align:center;"><div style="width:64px;height:64px;background:var(--accent-color);color:white;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:bold;">12</div><span style="font-size:0.75rem;opacity:0.7;">Hours</span></div>
              <div style="text-align:center;"><div style="width:64px;height:64px;background:var(--accent-color);color:white;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:bold;">34</div><span style="font-size:0.75rem;opacity:0.7;">Mins</span></div>
              <div style="text-align:center;"><div style="width:64px;height:64px;background:var(--accent-color);color:white;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:bold;">56</div><span style="font-size:0.75rem;opacity:0.7;">Secs</span></div>
            </div>
            <p style="color:#ef4444;font-weight:bold;">${stripHtml(data.urgencyText as string) || 'Act now before this offer disappears forever!'}</p>
          </div>
        </section>
      `;

    case 'about_author':
      return `
        <section class="section">
          <div class="card" style="max-width:800px;margin:0 auto;display:flex;gap:32px;align-items:center;">
            <div style="width:160px;height:160px;border-radius:50%;background:linear-gradient(to bottom right,var(--accent-color),var(--button-bg));display:flex;align-items:center;justify-content:center;font-size:4rem;color:white;font-weight:bold;flex-shrink:0;">${((data.name as string) || 'A').charAt(0)}</div>
            <div>
              <h3 style="font-size:1.5rem;font-weight:bold;margin-bottom:8px;">${stripHtml(data.name as string) || 'About The Author'}</h3>
              <p style="color:var(--accent-color);font-weight:500;margin-bottom:16px;">${stripHtml(data.title as string) || 'Expert & Entrepreneur'}</p>
              <p style="opacity:0.8;line-height:1.6;">${stripHtml(data.bio as string) || 'Share your story, credentials, and why you created this product...'}</p>
            </div>
          </div>
        </section>
      `;

    case 'story_section':
      const paragraphs = (data.paragraphs as string[]) || [(data.content as string) || 'Your story goes here...'];
      return `
        <section class="section">
          <div style="max-width:800px;margin:0 auto;">
            ${(data.headline as string) ? `<h3 style="text-align:center;font-size:2rem;margin-bottom:32px;">${data.headline}</h3>` : ''}
            ${paragraphs.map(p => `<p style="margin-bottom:16px;line-height:1.8;">${stripHtml(p)}</p>`).join('')}
          </div>
        </section>
      `;

    case 'social_proof_bar':
      const logos = (data.logos as string[]) || ['Forbes', 'Inc', 'Entrepreneur', 'Business Insider'];
      return `
        <section style="padding:32px 24px;background:rgba(0,0,0,0.05);">
          <div style="max-width:1000px;margin:0 auto;">
            <p style="text-align:center;font-size:0.875rem;margin-bottom:16px;opacity:0.7;">${stripHtml(data.headline as string) || 'As Featured In:'}</p>
            <div style="display:flex;justify-content:center;gap:32px;flex-wrap:wrap;">
              ${logos.map(logo => `<span style="font-size:1.25rem;font-weight:bold;opacity:0.4;">${logo}</span>`).join('')}
            </div>
          </div>
        </section>
      `;

    case 'warning_box':
      return `
        <section class="section">
          <div style="max-width:640px;margin:0 auto;padding:24px;background:rgba(239,68,68,0.1);border:2px solid rgba(239,68,68,0.5);border-radius:12px;">
            <div style="display:flex;gap:16px;align-items:flex-start;">
              <span style="font-size:2rem;">&#9888;</span>
              <div>
                <h4 style="font-size:1.25rem;font-weight:bold;color:#dc2626;margin-bottom:8px;">${stripHtml(data.headline as string) || 'WARNING'}</h4>
                <p style="line-height:1.6;">${stripHtml(data.content as string) || 'Important warning message goes here...'}</p>
              </div>
            </div>
          </div>
        </section>
      `;

    case 'who_is_this_for':
      const forYou = (data.forYou as string[]) || [];
      const notForYou = (data.notForYou as string[]) || [];
      return `
        <section class="section">
          <div style="max-width:800px;margin:0 auto;">
            <h3 style="text-align:center;font-size:2rem;margin-bottom:32px;">${stripHtml(data.headline as string) || 'Who Is This For?'}</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;">
              <div class="card">
                <h4 style="font-size:1.25rem;font-weight:bold;color:#16a34a;margin-bottom:16px;">This IS For You If:</h4>
                <ul style="list-style:none;">
                  ${forYou.map(item => `<li style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;"><span style="color:#16a34a;font-size:1.25rem;">&#10003;</span>${item}</li>`).join('')}
                </ul>
              </div>
              <div class="card">
                <h4 style="font-size:1.25rem;font-weight:bold;color:#dc2626;margin-bottom:16px;">This is NOT For You If:</h4>
                <ul style="list-style:none;">
                  ${notForYou.map(item => `<li style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;"><span style="color:#dc2626;font-size:1.25rem;">&#10007;</span>${item}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </section>
      `;

    case 'what_you_get':
      const getItems = (data.items as Array<{name: string; description: string; value: string}>) || [];
      return `
        <section class="section">
          <div style="max-width:800px;margin:0 auto;">
            <h3 style="text-align:center;font-size:2rem;margin-bottom:32px;">${stripHtml(data.headline as string) || 'Here\'s Everything You Get:'}</h3>
            ${getItems.map(item => `
              <div class="card" style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
                <span style="width:32px;height:32px;background:var(--accent-color);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;">&#10003;</span>
                <div style="flex:1;">
                  <h4 style="font-weight:bold;">${item.name}</h4>
                  ${item.description ? `<p style="font-size:0.875rem;opacity:0.7;">${item.description}</p>` : ''}
                </div>
                <span style="font-weight:bold;color:var(--accent-color);">${item.value}</span>
              </div>
            `).join('')}
            ${(data.totalValue as string) ? `
              <div class="card" style="text-align:center;margin-top:32px;">
                <p>Total Value: <span style="text-decoration:line-through;opacity:0.5;">${data.totalValue}</span></p>
                <p style="font-size:2rem;font-weight:bold;color:var(--accent-color);margin-top:8px;">Today Only: ${(data.todayPrice as string) || '$47'}</p>
              </div>
            ` : ''}
          </div>
        </section>
      `;

    case 'ps_section':
      const psItems = (data.items as Array<{prefix: string; content: string}>) || [{prefix: 'P.S.', content: 'Your P.S. message here...'}];
      return `
        <section class="section">
          <div style="max-width:640px;margin:0 auto;">
            ${psItems.map(item => `<p style="margin-bottom:16px;line-height:1.6;"><strong style="color:var(--accent-color);">${item.prefix}</strong> ${stripHtml(item.content)}</p>`).join('')}
          </div>
        </section>
      `;

    case 'image_section':
      return `
        <section class="section">
          <div style="max-width:900px;margin:0 auto;">
            <div style="border-radius:12px;overflow:hidden;box-shadow:0 25px 50px rgba(0,0,0,0.15);">
              ${(data.imageUrl as string) ? `<img src="${data.imageUrl}" alt="${(data.alt as string) || 'Image'}" style="width:100%;height:auto;" />` : '<div style="min-height:300px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;opacity:0.5;">Image Placeholder</div>'}
            </div>
            ${(data.caption as string) ? `<p style="text-align:center;margin-top:16px;opacity:0.8;">${data.caption}</p>` : ''}
          </div>
        </section>
      `;

    case 'before_after':
      return `
        <section class="section">
          <div style="max-width:900px;margin:0 auto;">
            <h3 style="text-align:center;font-size:2rem;margin-bottom:32px;">${stripHtml(data.headline as string) || 'The Transformation'}</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;">
              <div class="card" style="text-align:center;border:2px solid rgba(239,68,68,0.3);">
                <span style="display:inline-block;padding:4px 16px;background:#ef4444;color:white;font-weight:bold;border-radius:9999px;margin-bottom:16px;">BEFORE</span>
                <p>${stripHtml(data.before as string) || 'Before description...'}</p>
              </div>
              <div class="card" style="text-align:center;border:2px solid rgba(34,197,94,0.3);">
                <span style="display:inline-block;padding:4px 16px;background:#22c55e;color:white;font-weight:bold;border-radius:9999px;margin-bottom:16px;">AFTER</span>
                <p>${stripHtml(data.after as string) || 'After description...'}</p>
              </div>
            </div>
          </div>
        </section>
      `;

    case 'step_by_step':
      const steps = (data.steps as Array<{title: string; description: string}>) || [];
      return `
        <section class="section">
          <div style="max-width:800px;margin:0 auto;">
            <h3 style="text-align:center;font-size:2rem;margin-bottom:32px;">${stripHtml(data.headline as string) || 'How It Works'}</h3>
            ${steps.map((step, i) => `
              <div style="display:flex;gap:24px;margin-bottom:24px;">
                <div style="width:48px;height:48px;flex-shrink:0;border-radius:50%;background:var(--accent-color);color:white;display:flex;align-items:center;justify-content:center;font-size:1.25rem;font-weight:bold;">${i + 1}</div>
                <div>
                  <h4 style="font-size:1.25rem;font-weight:bold;margin-bottom:4px;">${stripHtml(step.title)}</h4>
                  <p style="opacity:0.8;">${stripHtml(step.description)}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `;

    case 'module_breakdown':
      const modules = (data.modules as Array<{name: string; description: string; lessons?: number}>) || [];
      return `
        <section class="section">
          <div style="max-width:800px;margin:0 auto;">
            <h3 style="text-align:center;font-size:2rem;margin-bottom:32px;">${stripHtml(data.headline as string) || 'What\'s Inside'}</h3>
            ${modules.map((mod, i) => `
              <div class="card" style="margin-bottom:16px;">
                <div style="display:flex;align-items:center;gap:16px;margin-bottom:8px;">
                  <span style="padding:4px 12px;background:var(--accent-color);color:white;font-size:0.875rem;font-weight:bold;border-radius:9999px;">Module ${i + 1}</span>
                  <h4 style="font-size:1.125rem;font-weight:bold;">${stripHtml(mod.name)}</h4>
                </div>
                <p style="opacity:0.8;">${stripHtml(mod.description)}</p>
                ${mod.lessons ? `<p style="font-size:0.875rem;color:var(--accent-color);margin-top:8px;">${mod.lessons} lessons</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      `;

    case 'credibility_bar':
      const credItems = (data.items as string[]) || ['Secure Checkout', '256-bit SSL', 'Money Back Guarantee', '24/7 Support'];
      return `
        <section style="padding:24px;background:rgba(0,0,0,0.05);">
          <div style="max-width:900px;margin:0 auto;display:flex;justify-content:center;gap:32px;flex-wrap:wrap;">
            ${credItems.map(item => `<div style="display:flex;align-items:center;gap:8px;opacity:0.7;"><span style="color:var(--accent-color);">&#10003;</span><span style="font-size:0.875rem;font-weight:500;">${item}</span></div>`).join('')}
          </div>
        </section>
      `;

    case 'headline_only':
      return `
        <section class="section">
          <h2 style="text-align:center;font-size:clamp(1.5rem,4vw,3rem);font-weight:bold;max-width:900px;margin:0 auto;">${stripHtml(data.headline as string) || 'Your Big Headline Here'}</h2>
        </section>
      `;

    case 'comparison_table':
      const rows = (data.rows as Array<{feature: string; us: boolean; them: boolean}>) || [];
      return `
        <section class="section">
          <div style="max-width:900px;margin:0 auto;">
            <h3 style="text-align:center;font-size:2rem;margin-bottom:32px;">${stripHtml(data.headline as string) || 'Why Choose Us?'}</h3>
            <div class="card" style="overflow:hidden;">
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr style="background:rgba(0,0,0,0.1);">
                    <th style="padding:16px;text-align:left;">Feature</th>
                    <th style="padding:16px;text-align:center;">${(data.usLabel as string) || 'Us'}</th>
                    <th style="padding:16px;text-align:center;opacity:0.6;">${(data.themLabel as string) || 'Others'}</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows.map(row => `
                    <tr style="border-top:1px solid rgba(0,0,0,0.1);">
                      <td style="padding:16px;">${row.feature}</td>
                      <td style="padding:16px;text-align:center;font-size:1.25rem;color:${row.us ? '#22c55e' : '#ef4444'};">${row.us ? '&#10003;' : '&#10007;'}</td>
                      <td style="padding:16px;text-align:center;font-size:1.25rem;color:${row.them ? '#22c55e' : '#ef4444'};">${row.them ? '&#10003;' : '&#10007;'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      `;

    case 'order_bump':
      return `
        <section class="section">
          <div style="max-width:640px;margin:0 auto;padding:24px;border:4px dashed #eab308;background:rgba(234,179,8,0.1);border-radius:12px;">
            <div style="display:flex;gap:16px;align-items:flex-start;">
              <input type="checkbox" checked style="width:24px;height:24px;margin-top:4px;" />
              <div>
                <h4 style="font-size:1.125rem;font-weight:bold;margin-bottom:8px;">${stripHtml(data.headline as string) || 'YES! Add This To My Order!'}</h4>
                <p style="opacity:0.8;margin-bottom:8px;">${stripHtml(data.description as string) || 'One-time offer description here...'}</p>
                <p style="font-weight:bold;color:var(--accent-color);">Add for just ${(data.price as string) || '$27'}</p>
              </div>
            </div>
          </div>
        </section>
      `;

    case 'testimonial_grid':
      const testimonials = (data.testimonials as Array<{quote: string; name: string; role?: string}>) || [];
      return `
        <section class="section" style="background:rgba(0,0,0,0.03);">
          <div style="max-width:1000px;margin:0 auto;">
            <h3 style="text-align:center;font-size:2rem;margin-bottom:32px;">${stripHtml(data.headline as string) || 'What Our Customers Say'}</h3>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
              ${testimonials.map(t => `
                <div class="card">
                  <div style="margin-bottom:12px;">${[1,2,3,4,5].map(() => '<span style="color:#eab308;">&#9733;</span>').join('')}</div>
                  <p style="font-style:italic;margin-bottom:16px;">"${stripHtml(t.quote)}"</p>
                  <p style="font-weight:bold;">${t.name}</p>
                  ${t.role ? `<p style="font-size:0.875rem;opacity:0.6;">${t.role}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;

    case 'video_testimonials':
      const videos = (data.videos as Array<{embedUrl: string; name: string}>) || [];
      return `
        <section class="section">
          <div style="max-width:1000px;margin:0 auto;">
            <h3 style="text-align:center;font-size:2rem;margin-bottom:32px;">${stripHtml(data.headline as string) || 'Video Success Stories'}</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
              ${videos.map(v => `
                <div class="card" style="overflow:hidden;">
                  <div style="aspect-ratio:16/9;background:#1f2937;">
                    ${v.embedUrl ? `<iframe src="${v.embedUrl}" style="width:100%;height:100%;border:none;" allowfullscreen></iframe>` : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#9ca3af;">Video Placeholder</div>'}
                  </div>
                  <div style="padding:16px;"><p style="font-weight:bold;">${v.name}</p></div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;

    case 'income_proof':
      const proofs = (data.proofs as Array<{amount: string; timeframe: string; name: string}>) || [];
      return `
        <section class="section">
          <div style="max-width:900px;margin:0 auto;">
            <h3 style="text-align:center;font-size:2rem;margin-bottom:8px;">${stripHtml(data.headline as string) || 'Real Results From Real People'}</h3>
            <p style="text-align:center;opacity:0.7;margin-bottom:32px;">${stripHtml(data.disclaimer as string) || 'Results may vary. These are actual results from dedicated users.'}</p>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
              ${proofs.map(p => `
                <div class="card" style="text-align:center;">
                  <p style="font-size:2.5rem;font-weight:bold;color:var(--accent-color);margin-bottom:8px;">${p.amount}</p>
                  <p style="opacity:0.7;margin-bottom:16px;">${p.timeframe}</p>
                  <p style="font-weight:500;">${p.name}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;

    default:
      return `
        <section class="section" style="text-align:center;opacity:0.5;">
          [${section.type} section]
        </section>
      `;
  }
}

export function generateHtml(
  sections: PageSection[],
  theme: ThemeType,
  projectName: string,
  includeWatermark: boolean
): string {
  const sectionsHtml = sections.map(renderSectionHtml).join('\n');
  const watermarkHtml = includeWatermark 
    ? '<footer class="watermark">Built with Sales Page Forge (Free Account)</footer>'
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <style>
    ${THEME_CSS[theme]}
    ${BASE_CSS}
  </style>
</head>
<body>
  ${sectionsHtml}
  ${watermarkHtml}
</body>
</html>`;
}

export function generateJson(
  sections: PageSection[],
  theme: ThemeType,
  projectName: string,
  projectType: string
): string {
  return JSON.stringify({
    name: projectName,
    type: projectType,
    theme,
    sections: sections.map(s => ({
      id: s.id,
      type: s.type,
      position: s.position,
      data: s.data,
    })),
    exportedAt: new Date().toISOString(),
    version: '1.0',
  }, null, 2);
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
