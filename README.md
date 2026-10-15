# freebodydemo.com

One-page site where people book a free demo: weight loss (herbalist + Invisa-RED + before and after measurements) or face lift (consultation). The domain goes on the street signs.

- Hosting: Netlify project `demo-awakened-skin-body`, auto-deploys from `main`.
- Booking: Cal.com, embedded inline. The event links are at the top of the script in `index.html` (`CAL`): weight loss in English and Spanish, and face lift. Each calendar loads only when its section gets close to the screen.
- Cal.com events: `free-demo-weight-loss` (English), `free-demo-weight-loss-es` (Spanish) and `free-demo-face-lift` are copies of the Invisa-RED and Consultation events, kept separate so bookings from the signs can be counted and the awakened.skin events stay untouched. All three use the Cal.com availability schedule "Demo days" (weekly hours off, date overrides for Oct 22 to 25).
- Demo days: the dated line at the top hides itself after `DEMO_DAYS_END`. To open more days, add date overrides to the "Demo days" schedule in Cal.com and move `DEMO_DAYS_END`.
- Languages: English and Spanish on the same page. The page opens in Spanish when the phone is set to Spanish, or with `?lang=es` in the link.
- Tracking: GA4 `G-N31V27CTCY`, Google Ads `AW-18174427039`, Meta Pixel `2112349302961771`. Events: `cta_click`, `language_switch`, `demo_booked` with `demo` = weight_loss or face_lift (GA4); `Contact` and `Schedule` (Meta).
- Before and after carousels: photos in `assets/results/` (`wl-*` for weight loss, `face-*` for face lift), resized from the photos on awakened.skin /results (our own clients, shared with consent). Photo rules: Invisa-RED only uses photos whose headline says "Body Contouring" (no cellulite, stretch marks or skin tightening headlines, no arms, back or chest). The face lift set only uses Fusion Plasma photos, none that say "No Downtime". To swap a photo, replace the file and keep the 800 x 1067 size.
- Face lift demo: includes a mini face lift with atmospheric plasma ("no needles, no fillers, no toxins"). It never says zero downtime.
- Copy rules: "Weight loss" names the demo program (herbalist plan); Invisa-RED's own sentences talk about inches off the waist, hips and thighs only, and "FDA-cleared laser" stays in its own sentence, never next to weight loss. The Florida s. 456.062 statement stays in the footer because the page advertises a free service.
