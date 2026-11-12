# Bellwood Construction LLC — website

A single-page site for Bellwood Construction LLC, Everett WA. Plain HTML, CSS
and JavaScript — no build step, no framework, no npm install. Open
`index.html` in a browser and it runs.

```
Bellwood Website/
├── index.html          the whole page
├── css/styles.css      all styling, light + dark
├── js/config.js        ← EVERYTHING YOU EDIT LIVES HERE
├── js/app.js           behaviour (gallery, booking, forms, map)
└── assets/
    ├── logo-mark.png    your Bw monogram (see "The logo" below)
    ├── favicon-*.png    browser tab + home-screen icons
    └── projects/        your real project photos + resized copies
```

---

## 🚀 Going live

Four steps. Steps 1 and 2 are the ones that matter — a live site that still
says `[WA LICENSE #]` and drops enquiries is worse than a site that goes up a
week later.

I can't do steps 1 and 3 for you: they need accounts in your name, your email
and your card. Everything else is already done.

### Step 1 — Make the forms actually send (30 minutes, free)

Right now the forms are honest about not being connected: they show the
visitor a pre-filled email button instead of pretending to send. That's a
safety net, not a substitute. Fix it like this:

1. Go to **[formspree.io](https://formspree.io)** and create a free account
   using **BellwoodConstructionLLC@gmail.com**.
2. Click the verification link Formspree emails you. *(Skip this and nothing
   will ever arrive.)*
3. Create a new form — call it "Bellwood Website". Copy the endpoint it gives
   you. It looks like `https://formspree.io/f/mwpelabc`.
4. Open `js/config.js`, find section 2, and paste it into all three slots:

   ```js
   forms: {
     quoteEndpoint:   'https://formspree.io/f/mwpelabc',
     bookingEndpoint: 'https://formspree.io/f/mwpelabc',
     contactEndpoint: 'https://formspree.io/f/mwpelabc'
   }
   ```

5. **Test it yourself before you trust it.** Open the site, send yourself a
   quote request, and confirm it lands in the Gmail inbox. Do this again after
   the site is live on its real domain.

Every email arrives with a subject line like *"Quote request — Bathroom
Remodels — Dana Reyes"* and a `form` field saying which of the three forms it
came from, so you can filter them in Gmail.

**The free plan allows 50 submissions a month and does not include photo
uploads.** The quote form's text always comes through; the photos only attach
on a paid plan (about $10/month). If you want the photos, upgrade — being able
to see the room before you quote is usually worth it.

### Step 2 — Fill in the placeholders (15 minutes)

Work through the table in the next section. Anything in `[SQUARE BRACKETS]` is
visible to visitors right now. The license number especially — homeowners in
Washington do check it.

### Step 3 — Put it online (1 hour, ~$15/year for the domain)

The site is plain files, so hosting is free. You only pay for the domain name.

1. **Buy the domain.** Namecheap, Cloudflare or Porkbun, roughly $12–15/year.
   `bellwoodconstructionllc.com` or `bellwoodconstruction.com` if it's free.
2. **Host it.** Easiest route: go to
   **[app.netlify.com/drop](https://app.netlify.com/drop)** and drag the whole
   **Bellwood Website** folder from your Desktop onto the page. It goes live in
   about 20 seconds at
   a temporary address like `chipper-otter-1a2b3c.netlify.app`. Free account,
   free HTTPS, no build step. I've already added a `netlify.toml` so caching
   and security headers are set up correctly.
3. **Connect your domain** in Netlify under *Domain settings → Add a domain*,
   then follow their instructions to point the domain's nameservers at Netlify.
   HTTPS turns itself on within the hour.
4. **Tell the site its own address.** Once the domain works, update these three
   spots so link previews and Google behave:
   - `js/config.js` → `business.siteUrl`
   - `index.html` → `<link rel="canonical" href="/">` → your full URL
   - `index.html` → `<meta property="og:image" ...>` → the full URL to the
     photo, e.g. `https://yourdomain.com/assets/projects/kitchen-two-tone-open-plan.jpg`
     *(social sites won't show a preview image from a relative path)*
   - `sitemap.xml` and `robots.txt` → replace `yourdomain.com`

   Then drag the folder onto Netlify again to republish.

### Step 4 — Get found (ongoing)

1. **Google Business Profile** is worth more than the website for local search.
   Claim it at [business.google.com](https://business.google.com), use the same
   phone, address and hours as the site, and add your project photos. Google
   cross-checks the two, which is why the site publishes your hours and service
   area in a format it can read.
2. **Google Search Console** — [search.google.com/search-console](https://search.google.com/search-console),
   add your domain, submit `sitemap.xml`.
3. **Ask for reviews.** You have no testimonials on the site because you hadn't
   given me any and I won't invent them. Once you have four or five real Google
   reviews, that's the next section to add, and it'll do more for your
   conversion rate than anything else on the page.

### What it costs

| | |
|---|---|
| Hosting (Netlify free tier) | $0 |
| HTTPS certificate | $0 |
| Domain name | ~$12–15/year |
| Formspree free (50 enquiries/month, no photos) | $0 |
| Formspree paid (photos + more volume) | ~$10/month, optional |

---

## ✅ What you still need to give me

Everything below shows on the site right now as a visible placeholder like
`[WA LICENSE #]`, so nothing is silently wrong — but visitors can see them, so
these should be filled in before you go live. All of them live in
**`js/config.js`**, section 1, except where noted.

| # | What | Where | Notes |
|---|------|-------|-------|
| 1 | **Street address** | `config.js` → `business.streetAddress` + `postalCode` | Also update `"streetAddress"` and `"postalCode"` in the `<script type="application/ld+json">` block near the top of `index.html` — that's the block Google reads. |
| 2 | **WA contractor license number** | `config.js` → `business.licenseNumber` | **Currently not shown anywhere** — the "Licensed & Insured" panel, the Contact row and the footer line were all removed while the number was a placeholder. Washington requires a registered contractor's number in advertising, so put these back once you have it (see Licensing below). |
| 3 | **Form endpoint(s)** | `config.js` → `forms` | See "Connecting the forms" below. Until this is set, forms fall back to a pre-filled email button instead of pretending to send. |
| 4 | **Social links** | `config.js` → `business.social` | Leave a URL as `''` and that icon simply doesn't render. |
| 5 | **Domain** | `config.js` → `business.siteUrl`, plus `<link rel="canonical">` and `og:image` in `index.html` | Only matters once you have a real domain. |
| 6 | **Placeholder images to replace** | `config.js` → `placeholderImages` | Four of them — see below. |

---

## The photos

### Your real projects — `assets/projects/`

Seven of your photos are in, in the order you gave me (strongest first), with
captions, categories and written alt text. No homeowner names, addresses or
neighbourhoods anywhere.

The commercial restroom shot has been taken out of the gallery. Its files are
still sitting in `assets/projects/` — nothing references them, so they cost you
nothing, and adding the entry back to the `projects` array in `config.js`
restores it if you change your mind.

They're displayed as a **compact strip of thumbnails** rather than a full grid,
so the work doesn't compete with the service cards just above it. Tapping any
one — or the "Browse all N photos" button — opens the lightbox, where the
**full uncropped image** and its caption appear. Thumbnails are uniform 3:4
with `object-fit: cover`, so nothing is stretched. On phones the strip scrolls
sideways; above 900px the whole set fits in a row.

I also generated 480px and 800px copies of each so phones don't download a
1200px file — that's what the `-480w.jpg` / `-800w.jpg` files are.

**To add a photo:** drop the file in `assets/projects/`, then add an entry to
the `projects` array in `config.js`. To get the smaller copies, run this from
inside `assets/projects/`:

```bash
for f in your-new-photo.jpg; do b="${f%.jpg}"; for w in 480 800; do cp "$f" "${b}-${w}w.jpg"; sips --resampleWidth $w "${b}-${w}w.jpg"; done; done
```

(It still works without the resized copies — they're a speed optimisation, not
a requirement.)

### Before/after sliders

Every gallery item has an empty `before: ''` field. **Put a "before" filename
in it and that item automatically becomes a draggable before/after slider** in
the lightbox — mouse, touch and arrow keys all work — and picks up a
"Before / After" badge on its card in the grid. Nothing else to change:

```js
{
  file: 'kitchen-two-tone-open-plan.jpg',
  before: 'kitchen-two-tone-BEFORE.jpg',   // ← just add this
  ...
}
```

I built and tested this with a temporary pair of your photos, then removed the
test value — it's ready and waiting.

### Placeholder images — `config.js` → `placeholderImages`

You said you don't have these shots yet, so these are temporary. All are free
for commercial use under the **Unsplash License** (I checked each photo's page).
Each is marked `placeholder: true` in the config, so you can see at a glance
which are still stand-ins. Nothing on the page labels them.

| Spot | What it shows | Source |
|------|---------------|--------|
| Hero background | Kitchen mid-remodel | [unsplash.com/photos/…UqNEbyRQ660](https://unsplash.com/photos/kitchen-renovation-with-white-cabinets-UqNEbyRQ660) |
| *(unused)* | House exterior — kept for the Whole-Home card if you put that service back | [unsplash.com/photos/…HckCpdBDeDk](https://unsplash.com/photos/modern-two-story-house-with-a-dark-garage-door-HckCpdBDeDk) |
| Process section | Paint roller and tray | [unsplash.com/photos/…eQ-8iUrb07g](https://unsplash.com/photos/paint-roller-in-white-paint-tray-eQ-8iUrb07g) |
| Service Area banner | PNW homes below a snow-capped peak | [unsplash.com/photos/…FdLjqC9Poyw](https://unsplash.com/photos/residential-area-on-a-hill-with-a-snow-capped-mountain-FdLjqC9Poyw) |

None contain logos, brands or identifiable faces.

**To swap one for your own:** put your file in `assets/placeholders/`, then
change that entry's `url` to `'assets/placeholders/your-file.jpg'` and set
`placeholder: false`.

> These currently load from Unsplash's CDN rather than from your server. That
> keeps the folder small, but it does mean the hero depends on an outside
> service. If you'd rather host them yourself, download each one from the link
> above into `assets/placeholders/` and point the `url` at the local file.

**Your real photos are the only thing in the Our Work gallery.** A placeholder
never appears there, and nothing is ever captioned as a Bellwood project unless
it is one.

---

## The logo

Your `Bw` monogram, taken from the PNG on your Desktop
(`ChatGPT Image Jul 2, 2026 at 04_30_49 PM.PNG`) — keep that file somewhere
safe, it's the only copy and everything here was generated from it.

The original is cream artwork on a black background, which would have shown up
as a black rectangle on the cream header. So it's been cut out into a
transparent shape and is painted at runtime with CSS:

| File | Used for |
|---|---|
| `assets/logo-mark.png` | The mark itself, transparent. The site tints it with `currentColor`, so **one file** serves the header, the footer, light mode and dark mode. |
| `assets/logo-mark-dark.png` / `-cream.png` | Fallbacks for old browsers that can't do CSS masks. |
| `assets/favicon-32.png` | Browser tab. |
| `assets/favicon-180.png`, `apple-touch-icon.png` | Bookmarks and the iPhone home screen. |

**To change the colour**, edit `--accent` in `css/styles.css` — the mark
follows automatically. No new files needed.

**To replace the logo entirely**, drop a transparent PNG or SVG at
`assets/logo-mark.png` and it'll appear everywhere.

### One honest limitation

A thin script inside a thin square frame is beautiful large and fragile small.
At 32 pixels — the browser tab — the strokes are thinner than a pixel. I've
thickened them slightly just for that size, which is the best that can be done
with this artwork, but it still reads as a texture rather than letters.

That's the logo's nature, not a mistake. If it starts to bother you, the usual
fix is a **simplified small-size variant** from whoever drew it: the same mark
with heavier strokes and no frame, used only below about 48px. Real brands keep
two or three versions of their logo for exactly this reason. It's worth asking
for if you get a van wrap or embroidered shirts done, because the same problem
shows up there.

The 180px app icon and every on-page use look sharp — this only affects the
browser tab.

---

## Licensing

Three things were taken off the site because the number behind them was still
`[WA LICENSE #]`:

- the **"Licensed & Insured"** panel in the trust strip under the hero
- the **License** row in the Contact block
- the **license line** in the footer

The `licenseNumber` field is still in `config.js`, and the JavaScript that
fills all three is still there and guarded — so restoring them is HTML only.
Put these back into `index.html`:

```html
<!-- in .trust__inner, between the two existing panels -->
<div class="trust__item">
  <span class="trust__big">Licensed &amp; Insured</span>
  <span class="trust__label">WA License #<span id="trustLicense"></span></span>
</div>

<!-- in the Contact list -->
<li>
  <span class="contact__label">License</span>
  <span class="contact__value" id="contactLicense"></span>
</li>

<!-- in the footer's "Get in touch" column -->
<p class="footer__license" id="footerLicense"></p>
```

and this line back into the JSON-LD block:

```json
"hasCredential": "WA Contractor License YOURNUMBER",
```

**Worth checking with L&I:** Washington's contractor registration law
(RCW 18.27) requires a registered contractor to include their registration
number in advertising, and a website counts. I'm not a lawyer and you should
confirm how it applies to you — but if you're registered, the number belongs
back on the site rather than off it. Treat this removal as temporary.

---

## Services

The site currently offers **two**: Kitchen Remodels and Bathroom Remodels.

Whole-Home Renovations, Basements, and Flooring & Finish Work were taken off.
Their full definitions are commented out in `config.js` section 5 — paste a
block back into the `services` array and it returns everywhere at once: the
cards, the quote form's project picker, and the dropdown when someone books a
visit all read that one list.

If you put Whole-Home back, also restore these, which were trimmed to match:

- `index.html` → the meta description, the `og:description`, and the
  `"description"`, `"knowsAbout"` and `"makesOffer"` entries in the JSON-LD block
- `index.html` → the hero subhead and the Services section intro
  ("Two things we do all day, every day")

---

## How the forms behave

Setup is step 1 of **Going live** above. This is the reference detail.

All three forms (Quote Request, Book a Visit, Contact) post to whatever
endpoint you put in `config.js` → `forms`. You can use one endpoint for all
three or three separate ones — every submission carries a `form` field naming
which one it came from either way.

**What gets sent.** A quote request arrives as a set of named fields:
`name`, `email`, `phone`, `address`, `projectType`, `timeline`, `budget`,
`description`, `preferredContact`, and `photo1`…`photo5` for the images. A
booking adds `requestedDate` and `requestedTime` in plain English
("Tuesday, September 22, 2026", "8:00 am Pacific Time") so you can read it at
a glance on your phone.

**Any service that accepts a plain POST works** — Formspree, Basin, Getform,
Web3Forms. It isn't locked to one provider. Requests go out as JSON, or as
multipart when there are photos attached.

**If the service is down or rejects the request**, the visitor is *not* shown a
fake confirmation. They stay on the filled-in form and get a message with your
phone number as a link. Nothing is silently lost.

**Before an endpoint is set**, the forms show the summary plus a "send this by
email" button that opens the visitor's mail app pre-filled with everything they
typed.

### Spam

Each form has a hidden honeypot field (`_gotcha`) that Formspree and most other
services recognise. Bots fill it in, people don't, and those submissions are
dropped before they reach you.

---

## Booking calendar

In `config.js` → `booking`:

- **Hours:** `weekly` — Mon–Fri 8am–5pm, Saturday 9am–3pm, Sunday closed.
  `end` is when the last consultation *finishes*, so `end: 17` means the last
  weekday slot starts at 4pm and Saturday's last slot starts at 2pm.
- These are separate from the **display hours** in section 1 (you're open
  7am–6pm weekdays and 9am–3pm Saturday) — the booking window sits inside your
  opening hours so a visit never runs past closing.
- **Lead time:** `leadTimeDays: 2` — nobody can book for today or tomorrow.
- **How far ahead:** `bookingWindowDays: 90`.
- **Days off:** add dates to `blackoutDates` as `'2026-12-25'`.

Everything runs in **Pacific Time** regardless of where the visitor is. The
`.ics` download they get is timezone-correct across daylight-saving changes —
a 9am appointment in September exports as 16:00 UTC and one in December as
17:00 UTC, so it lands at 9am Pacific either way. It's marked `TENTATIVE` with
a 1-hour reminder, because a requested time isn't a confirmed one until you say
so.

---

## Service area checker

In `config.js` → `serviceArea`:

- `cities` — drives both the map markers and the checker. `primary: true`
  cities get bigger pins and appear in the footer.
- `zips` — the ZIP list the checker matches against: Snohomish County, north
  King County, Seattle and the Eastside (Bellevue, Kirkland, Redmond, Mercer
  Island). It stops there — Tacoma, Auburn and Federal Way come back as a
  miss.
- `aliases` — extra spellings, e.g. someone typing "snoho".

It accepts a city name, a ZIP, "Everett WA", or a partial like "mukil". A miss
never says a flat no — it points them at your phone number.

The map is Leaflet + OpenStreetMap, loaded from a CDN. No API key, no billing,
no account. If it's ever blocked the rest of the page carries on working.

---

## Hosting and local preview

Deploying is step 3 of **Going live** above. Netlify is the suggestion, but the
site is plain files — Vercel, Cloudflare Pages, GitHub Pages or any old FTP
host all work. Nothing needs Node, PHP or a database.

To look at it on your own machine, open `index.html` directly, or run a small
server from the folder above it so everything behaves exactly as it will live:

```bash
npx --yes serve "/Users/igor/Desktop/Bellwood Website"
```

**Making a change after you've gone live:** edit the file, check it locally,
then drag the folder onto Netlify again. It replaces the old version in a few
seconds and keeps the same address.

---

## What's built in

**Conversion:** sticky header with a persistent quote button (it moves into the
drawer on mobile), click-to-call in the header, a floating Call Now button on
phones that hides itself over forms, service cards that deep-link into the
quote form with the right project type already chosen, and three separate paths
to get in touch.

**Accessibility:** WCAG AA contrast verified in both light and dark mode, full
keyboard navigation, visible focus rings, descriptive alt text on every real
photo, ARIA on the lightbox, calendar, sliders and pickers, and
`prefers-reduced-motion` fully respected. The mobile drawer is hidden from
keyboard and screen readers while it's closed.

**Speed:** two font families, one small CSS file, one JS file, lazy-loaded
images with `srcset`, and no framework. Leaflet is the only outside library and
it's deferred.

**SEO:** title and description targeting "Everett WA remodeling contractor",
Open Graph tags, and `GeneralContractor` structured data with your phone,
email, city and full service area.

**Dark mode:** a toggle in the header. It follows the visitor's system setting
until they choose for themselves, then remembers their choice. The palette
stays warm in both.

The only number claimed anywhere on the site is **8 years combined
experience**, in the trust strip under the hero, and it's labelled exactly that
— not as the company's age, which would be a different claim. Edit it in
`config.js` → `business.experience`.

No testimonials, reviews, awards or other statistics appear anywhere — you
didn't give me any, so I didn't invent any. When you have real reviews, that's the
obvious next section to add.
