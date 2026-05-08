# Visual Communication Cards

## What it is

Visual Communication Cards is a static, Turkish-first visual communication card app for children and caregivers who benefit from visual communication support.

## Who it is for

- Children who use or benefit from visual supports
- Parents and caregivers
- Teachers and special education professionals

## What it helps with

- Expressing needs
- Choosing food and drinks
- Communicating feelings
- Daily routines
- School and home communication
- Simple sentence building

## Key features

- Turkish card labels
- Category filtering
- Search
- Sentence bar
- Text-to-speech
- Mobile and tablet friendly design
- Installable PWA
- Offline support after first visit

## Important note

- This is a supportive communication tool.
- It is not medical advice, therapy, diagnosis, or an official PECS product.
- Content should be reviewed by caregivers or professionals before use.

## Licensing and pictograms

- Do not use copyrighted PECS or Pics for PECS materials.
- Pictograms from ARASAAC are property of the Government of Aragón and created by Sergio Palao for ARASAAC, distributed under CC BY-NC-SA.
- Emoji fallback may be used where pictograms are not available.
- Candidate pictograms are not automatically shown in the app.
- Only entries listed in `scripts/verified-card-symbol-map.json` are shown as real pictograms in the app.
- Wrong or unclear visuals must be rejected manually during review.
- ARASAAC attribution and license notes must be kept when using approved pictograms.

## Pictogram review workflow

```bash
npm run candidates:symbols
npm run review:symbols
npm run apply:verified-symbols
```

- `npm run candidates:symbols` downloads top candidate pictograms for each card into `public/symbol-candidates/cards/...`.
- `npm run review:symbols` builds `scripts/pictogram-review/cards-review.json` and `scripts/pictogram-review/index.html`.
- `npm run apply:verified-symbols` copies only manually approved candidate files into `public/symbols/arasaac/cards/...`.

## Tech stack

React, Vite, TypeScript, Tailwind CSS, PWA, Vercel.

## Development

```bash
npm install
npm run dev
npm run build
```

## Deployment

Vercel static deployment.
