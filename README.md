# BadAAAS AI Systems — website redesign

A ground-up redesign of **badaaas.com** built with the content from the existing site,
rebuilt in hand-written vanilla HTML, CSS and JavaScript. No framework, no build step,
no external APIs, no environment variables.

**Tagline:** _More demand in. Less opportunity lost._

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The complete single-page site (semantic HTML5, meta/OG/Twitter tags, JSON-LD `Organization` + `Service` + `FAQPage`) |
| `styles.css` | Design system + all layout/component styles, fully responsive, print + reduced-motion aware |
| `script.js` | Sticky header, scroll progress, mobile nav, scroll reveals, metric count-up, nav scroll-spy, FAQ accordion, request form validation |
| `favicon.svg` | Brand mark favicon |

## Sections

1. **Hero** — “Stop losing leads you already paid to _find_.” + live response desk visual + engagement-loop ticker
2. **Metrics** — 150+ businesses · $2M+ revenue generated · 72 hr average deployment · 5.0 Google / 4.8 Trustpilot
3. **Clients** — Trujillo Family Funeral Home, Solar Sphere, CARMA Automotive Group, Express Mortgage, IAPDA, Pinnacle Investments
4. **The leak** — the four-stage path (attention → broken handoff → answered in seconds → the payoff) beside an animated inbox showing 47s / 31s replies and a booked job
5. **What we run** — organic + paid search, conversion / AI automations and agents, reporting and optimization
6. **Paths** — the three doors: local & service businesses, lead intelligence (LeadR), custom AI systems
7. **Foundation System** — $249/month local-business offer: five modules, launch timeline (20 min demo → 7–10 days build → 25 min launch) and add-on pricing (everything $649)
8. **How it works** — strategy call → build and deploy → operate and report, month to month, no lock in
9. **Results** — Trujillo 12 → 80+ Google reviews in three months, Pinnacle 3× conversion, Greg Mellott 40% increase, SolarSphere missed calls kept warm
10. **FAQ** — the eight real questions and answers from the Foundation System page
11. **Final CTA** — “Find where your next _lead_ gets lost.”
12. **Contact** — every real channel (booking, local business demo, LeadR, custom builds), plus what you leave with / what to bring, and a client-side request form that validates and hands off to the booking calendar

## Content & images

* All copy is taken from the existing site: home, `/small-business/`, `/leadr/` and `/book/`.
* **No phone number, email address or postal address is published anywhere on the source site**, so
  none is invented here. Contact is expressed through the channels that genuinely exist.
* Client logos and the `call-1280.jpg` photograph are reused from the original site (authentic
  brand and business assets).
* The generic conceptual `path-1280.webp` (anonymous figure at a forest fork, unrelated to this
  business) was replaced with a contextually matched photograph from Pexels.
* Replacement photography is sourced from the Pexels API and used verbatim, chosen per section
  (answering leads, local search, reporting, strategy, choosing a path, local service businesses).

## Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Notes

* The request form is intentionally front-end only: it validates input and then links to the real
  booking calendar at `https://www.badaaas.com/book/`. Nothing is transmitted or stored.
* Typography uses Inter Tight, Instrument Serif and JetBrains Mono with full system-font fallbacks.
