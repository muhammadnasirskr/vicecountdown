# Vice Countdown — GTA 6 Release Countdown

A complete, production-ready **single-page static website**: a neon-noir synthwave countdown and information hub for the Grand Theft Auto VI release on **November 19, 2026**, built for US organic search traffic and monetized with **Adsterra**.

Pure **HTML + CSS + vanilla JS**. No build step, no npm, no frameworks. Deploy the folder as-is (this build is tuned for **Netlify**).

---

## What's inside

```
vice-countdown/
├── index.html          ← the main single page
├── about.html          ← who runs the site
├── privacy.html        ← full privacy policy (ads / cookies / GDPR / CCPA)
├── cookies.html        ← cookie policy
├── contact.html        ← contact form + email
├── disclaimer.html     ← full unofficial / trademark disclaimer
├── 404.html            ← styled not-found page (Netlify serves it automatically)
├── assets/
│   ├── css/style.css   ← all styling
│   ├── js/main.js      ← countdown, nav, parallax, menu
│   └── img/            ← favicon set + og-image.png
├── netlify.toml        ← Netlify config (caching + headers, no build step)
├── robots.txt
├── sitemap.xml
├── ads.txt
└── README.md
```

Everything visual (the hero sun, grid, skyline, palms, OG image, favicon) is **original CSS/SVG/generated art** — no Rockstar logos, screenshots, artwork or fonts are used anywhere.

---

## ⚠️ Before you go live — 3 required edits

### 1. Add your Adsterra ad code
The four ad spots use **Adsterra Native Banner** units (the least intrusive format — it blends into the page and keeps the premium look). In the HTML they are placeholders you replace with your own codes. Steps:

1. Sign up at [adsterra.com](https://adsterra.com) as a **Publisher** and add your website (`vicecountdown.com`).
2. For each spot, create an ad unit: **Websites → your site → Add ad unit → Native Banner**. Make 4 units (or reuse one if you prefer — separate units give better reporting).
3. Adsterra shows you a snippet like:
   ```html
   <script async="async" data-cfasync="false" src="//example.adsterra-domain.com/abc123.../invoke.js"></script>
   <div id="container-abc123..."></div>
   ```
4. In `index.html`, find the four blocks marked `<!-- AD SLOT 1..4 -->` and replace `REPLACE-WITH-YOUR-ADSTERRA-DOMAIN` and `REPLACE_KEY_1` … `REPLACE_KEY_4` with the real domain and key from each unit (the `src` URL **and** the matching `container-` id).
5. In your Adsterra dashboard open **Websites → your site → ads.txt**, copy the line(s), and paste them into `ads.txt` (replacing the comment block).

> **Ad quality tip:** stick to Native Banner. There's an optional **Social Bar** snippet (commented out near the bottom of `index.html`) that earns more but is intrusive — it can undercut the "trustworthy source" positioning, so only enable it if you're comfortable with that trade-off. Avoid stacking pop-unders on a site whose whole pitch is *"spot the fakes."*

### 2. Set your real domain
The files use `https://vicecountdown.com/` for canonical URLs, Open Graph, sitemap and robots. If you use a different domain (e.g. `vicecountdown.net`), find-and-replace `vicecountdown.com` across all files, and update `sitemap.xml` + `robots.txt` to match.

```bash
# from inside the folder (Linux)
grep -rl "vicecountdown.com" . | xargs sed -i 's#vicecountdown\.com#yourdomain.com#g'
```

### 3. Wire up the contact form
`contact.html` posts to a **Formspree placeholder** (`your-form-id`). Create a free form at [formspree.io](https://formspree.io), then replace `your-form-id` in the form `action`. Also swap the placeholder email `hello@vicecountdown.com` for your real address. (Or delete the form and keep only the email link.)

---

## Deploy to Netlify (drag-and-drop, ~2 minutes)

1. Go to [app.netlify.com](https://app.netlify.com) and sign in (free).
2. On **Sites**, drag the whole `vice-countdown` folder onto the "deploy" drop zone.
3. Netlify gives you a live URL instantly (e.g. `random-name.netlify.app`). `netlify.toml` is picked up automatically — no build settings to configure.
4. **Custom domain:** Site settings → Domain management → add `vicecountdown.com`, then point your registrar's DNS to Netlify (they show the exact records). HTTPS is automatic and free.
5. `404.html` is served automatically for unknown paths.

**Updating later:** drag the folder onto the same site again (or connect a Git repo for auto-deploys). Because `netlify.toml` marks HTML as always-revalidate, edits to dates or ad keys go live immediately, while images stay long-cached for speed.

> Tip: **Cloudflare Pages** works equally well with the same folder if you ever want an alternative — both are static-perfect and fine with ad-supported content. (Plain GitHub Pages also works, but its terms are stricter about ad-heavy/commercial sites, so Netlify or Cloudflare Pages is the safer home here.)

After the domain is live, submit `https://yourdomain.com/sitemap.xml` in **Google Search Console** to speed up indexing.

---

## Getting started with Adsterra

Why Adsterra fits this site: **near-instant approval**, it accepts brand-new/low-traffic sites, the **minimum payout is $5** (Wise/Paxum), and it pays **twice a month** — so you start earning during the countdown window instead of waiting weeks for approval. Checklist:

- Real domain connected and live (ads don't fill on `localhost`/`file://`).
- Website added and verified in Adsterra; `ads.txt` updated with the line(s) from your dashboard.
- The four Native Banner keys pasted into `index.html`.
- Give it a little time after going live for fill/optimisation to ramp up.

**Strategy note:** the countdown is the traffic hook, but GTA 6's biggest search traffic comes *after* launch (reviews, GTA Online, PC version, guides). If you keep the domain and evolve this into a GTA 6 news/guide hub after Nov 19, it becomes a long-term earner rather than a one-off — at which point applying for Google AdSense (higher US RPM, better ad quality) is worth it too. Just don't run AdSense and pop-under networks on the same page.

---

## SEO & features baked in

- Single `<title>`/`<h1>`, semantic landmarks, logical heading order.
- Meta description, canonical tags, full Open Graph + Twitter cards, original 1200×630 OG image.
- **Three JSON-LD blocks**: `WebSite` + `SearchAction`, `FAQPage` (targets rich snippets), and `Event` for the release.
- `sitemap.xml`, `robots.txt`, `font-display: swap`, deferred CSS, zero external JS libraries.
- Live countdown (one timer, tabular numerals, "My time / ET" toggle, an "IT'S HERE" state at zero, day-count mirrored into the nav badge and page title).
- Accessibility: skip link, `aria-live` day announcements, keyboard nav, neon focus rings, 44px touch targets, reduced-motion support.
- Ad slots each reserve `min-height` to prevent layout shift (CLS) while the Adsterra banner loads.

---

## Editing facts later

All dates/prices are hard-coded in plain text. If Rockstar changes anything:
- Countdown target lives in `assets/js/main.js` (`targets` object).
- Dates/prices are in `index.html` (hero eyebrow, At-a-Glance, Editions, Timeline, FAQ, and the `FAQPage` + `Event` JSON-LD blocks — update both the visible text **and** the JSON-LD so they stay in sync).
- Update the "Last updated" line in each footer.

---

## News hub — keeping traffic after the countdown

The countdown spikes traffic now, but GTA 6's biggest search demand comes *after* launch. `news.html` (a guides/news index) and `article.html` (a real, indexable sample article — a preload guide) turn this from a throwaway page into a lasting SEO asset. Both are linked in the nav and footer, and each already has its own Adsterra Native Banner slots (`REPLACE_KEY_5`–`REPLACE_KEY_8`).

**To publish a new post:**

1. Copy `article.html` to a new file, e.g. `gta6-pc-release.html`.
2. Edit the `<title>`, meta description, `<h1>`, the `canonical` URL, the visible date/read-time, and the body prose. Update the `Article` JSON-LD (`headline`, `datePublished`, `dateModified`, `mainEntityOfPage`) to match.
3. In `news.html`, turn one of the "Coming soon" cards into a real link: change its `<div class="post post--soon">` to `<a class="post" href="your-new-file.html">`, remove the `chip--soon`, and add a real date.
4. Add the new page to `sitemap.xml`.
5. Keep every claim traceable to an official source (Rockstar Newswire / Take-Two). That editorial discipline is exactly what protects your reputation — and, if you later add AdSense, your approval.

## Contact form

`contact.html` submits via AJAX (no page reload) and shows an inline success/error message — logic lives in `assets/js/main.js`. It includes a hidden honeypot field to cut spam. Until you set your Formspree ID (replace `your-form-id` in the form `action`), submitting shows a friendly "not connected yet" message instead of failing silently. Create a free form at [formspree.io](https://formspree.io), paste the ID, and it works immediately.

---

*Vice Countdown is an independent fan-run countdown site. Not affiliated with, endorsed by, or sponsored by Rockstar Games or Take-Two Interactive. All trademarks are property of their respective owners.*
