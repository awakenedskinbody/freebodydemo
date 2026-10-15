# freebodydemo.com

One-page site where people book a free demo: weight loss (herbalist + Invisa-RED + before and after measurements) or face lift (consultation). The domain goes on the street signs.

- Hosting: Netlify project `demo-awakened-skin-body`, auto-deploys from `main`.
- Booking: Cal.com, embedded inline. The event links are at the top of the script in `index.html` (`CAL`): weight loss in English and Spanish, and face lift. Each calendar loads only when its section gets close to the screen.
- Demo days: the dated line at the top hides itself after `DEMO_DAYS_END`.
- Languages: English and Spanish on the same page. The page opens in Spanish when the phone is set to Spanish, or with `?lang=es` in the link.
- Tracking: GA4 `G-N31V27CTCY`, Google Ads `AW-18174427039`, Meta Pixel `2112349302961771`. Events: `cta_click`, `language_switch`, `demo_booked` with `demo` = weight_loss or face_lift (GA4); `Contact` and `Schedule` (Meta).
- Copy rules: "Weight loss" names the demo program (herbalist plan); Invisa-RED's own sentences talk about inches off the waist, hips and thighs only, and "FDA-cleared laser" stays in its own sentence, never next to weight loss. The Florida s. 456.062 statement stays in the footer because the page advertises a free service.
