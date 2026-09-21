# THE USA WIRE
### America's Trending Stories, All in One Place.

**The USA Wire** is a modern, fast, mobile-first USA-focused digital news and trending media platform engineered for high-volume viral traffic, real-time editorial management, and automated content ingestion pipelines (such as n8n).

---

## 🌟 Key Features

1. **Original Visual Identity**
   - Distinct American editorial design featuring deep navy `#0A192F`, energetic red `#DC2626`, and clean paper-like reading surfaces.
   - Clean typographic pairing: *Plus Jakarta Sans* for editorial display headlines and *Newsreader* for reading ease.
   - Never copies CNN, Fox News, or NBC layouts — built with its own signature wire-grid hierarchy.

2. **Full Frontend News Portal**
   - **Hero Spotlight:** Lead national story spotlight with side priority stories.
   - **🔴 Breaking News Ticker:** Dynamic live red ticker with one-click article navigation.
   - **What's Trending in America:** Real-time trending ranking badges (#1 to #5) with trend momentum velocity.
   - **Most Read in USA:** 24-hour view-based rankings.
   - **Editorial Channels:** Dedicated categories for USA News, Politics, Business, Technology, Entertainment, Sports, Viral, and Culture.
   - **Article View:** Estimated reading times, correspondent avatars, social sharing (X, Facebook, LinkedIn, WhatsApp, Copy Link), source transparency citation blocks, and related stories.
   - **Search & Live Filters:** Search with category filtering and instant results.
   - **Newsletter Subscription:** Capture subscriber emails with instant feedback and CSV export.
   - **Newsroom Contact & Tip Line:** Readers can send press releases and story tips directly to editors.
   - **Mandatory Legal Suite:** About, Contact, Privacy Policy, Terms of Service, and Editorial & Source Transparency Disclaimers.

3. **Complete Secure Editorial Admin CMS (`/admin`)**
   - **Overview Dashboard:** Total articles, views, published count, channel breakdown, and quick action shortcuts.
   - **Article Management:** Create, edit, and delete stories with slug auto-generation, reading time estimation, tags, source attribution, and live article preview modal.
   - **Quick Flags:** 1-click toggling for **Breaking News**, **Trending Rank**, and **Featured Homepage Story**.
   - **Homepage & Ticker Manager:** Control the top red breaking ticker text and hero lead article.
   - **Channel Manager:** Add, edit, or remove channels with custom slugs and descriptions.
   - **Inbox & Tips:** Review messages and news tips sent by visitors.
   - **Newsletter Audience:** View subscribers and export as CSV.
   - **n8n Automation Hub:** Webhook documentation, sample JSON schemas, cURL commands, and a live simulation button for test ingestion.

4. **Resilient Dual-Mode Data Architecture**
   - **Supabase-Ready:** Seamlessly connects to Supabase PostgreSQL, Authentication, and Storage.
   - **Built-in LocalStorage Fallback:** The site is 100% interactive immediately with rich pre-seeded articles and data even before connecting Supabase credentials.

---

## 🚀 Quick Start (Running Locally)

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open your browser
# The app is hosted at http://localhost:3000
```

### Admin Access Credentials
- **URL:** Navigate to `/admin` or click the **Newsroom Admin** link in the footer.
- **Default Email:** `admin@theusawire.com`
- **Default Password:** `usawire2026`

---

## 🗄️ Setting Up Supabase (Production Database)

1. **Create a Free Supabase Project:**
   - Go to [https://supabase.com](https://supabase.com) and create a free account.
   - Click **New Project** and name it `the-usa-wire`.

2. **Initialize the Schema:**
   - In your Supabase project dashboard, open the **SQL Editor** tab on the left sidebar.
   - Open `supabase-schema.sql` from this repository.
   - Copy the entire SQL script, paste it into the Supabase SQL editor, and click **Run**.
   - This creates all tables (`articles`, `categories`, `site_settings`, `contact_messages`, `newsletter_subscribers`, `media_assets`), indexes, and security policies.

3. **Configure Environment Variables:**
   - In Supabase, go to **Project Settings** -> **API**.
   - Copy your **Project URL** and **anon public key**.
   - Add them to your `.env` (or Netlify environment variables):
     ```env
     VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
     VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
     ```

---

## 🌐 Deploying to Netlify (Free Tier)

1. Push your repository to **GitHub**.
2. Log into [https://www.netlify.com](https://www.netlify.com) and select **Add new site** -> **Import an existing project**.
3. Choose your GitHub repository.
4. Set the Build Configuration:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. In **Site Configuration** -> **Environment variables**, set:
   - `VITE_SUPABASE_URL` = `https://your-project-ref.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-supabase-anon-key`
6. Click **Deploy Site**. Netlify will build and provide an SSL-secured live URL.

---

## 🤖 n8n Automated News Ingestion

The platform has a dedicated **Automation Hub** accessible at `/admin/automation`.

### Webhook HTTP POST Ingestion
Your n8n workflow (e.g. RSS feed monitor or AI summary bot) can insert stories directly into Supabase:

```bash
curl -X POST 'https://your-project-ref.supabase.co/rest/v1/articles' \
  -H "apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "title": "Autonomous Electric Air Taxis Complete First Federal Test Corridor",
    "subtitle": "Federal aviation inspectors certify regional passenger test routes connecting major cities.",
    "slug": "autonomous-electric-air-taxis-first-corridor-test",
    "category_id": "cat-technology",
    "content": "Full article body dispatches here...",
    "featured_image": "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80",
    "author_name": "The USA Wire Automated Desk",
    "source_name": "Associated Press / Federal Aviation Administration",
    "source_url": "https://faa.gov",
    "status": "published",
    "trending": true,
    "trend_score": 95,
    "breaking": false
  }'
```

---

## 📄 License & Source Ethics
The USA Wire is committed to transparent digital journalism. All stories synthesized from wire dispatches or third-party reporting visibly feature primary source citations and links.
