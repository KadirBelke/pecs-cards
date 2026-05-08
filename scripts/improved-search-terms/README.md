# Improved ARASAAC Search Terms

This package contains improved English/Spanish-first search terms for 305 cards.

Why:
- The previous candidate search used many Turkish-only queries.
- ARASAAC results are much better with English/Spanish terms.
- These terms should be used only to download review candidates.
- Do not auto-apply unverified images.

Files:
- `improved-card-search-terms.json`
- `improved-card-search-terms.ts`

Recommended integration:
1. Make `download-symbol-candidates.mjs` read `improved-card-search-terms.json`.
2. For each card, if a `cardId` exists in this file, use these `searchTerms` instead of label/Turkish fallback.
3. Run:
   npm run candidates:symbols
   npm run review:symbols

Notes:
- Cards not selected in the review page should continue using emoji fallback.
- Candidate results still need human review.
