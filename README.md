# FlashDeck

A small React + TypeScript flashcard app — flip cards, delete them, and add your own.

## Stack

- React 18
- TypeScript
- Vite

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Features mapped to the lab

| Requirement | Where |
| --- | --- |
| `#flashcard` element | `src/App.tsx` — `<div id="flashcard">` |
| `FlashCard` interface with `questionText` & `questionAnswer` (both string) | `src/types.ts` |
| `currentCards` collection | `useState<FlashCard[]>` in `App` |
| Click `#flashcard` toggles `flipped` class | `handleFlip` + template className |
| `#delete-btn` element | `<button id="delete-btn">` |
| Click `#delete-btn` removes current card & shows previous | `handleDelete` |
| `#entry-form` form | `<form id="entry-form">` |
| `#front-text` and `#back-text` inside the form | two `<input>` elements with those ids |
| New card appended to `currentCards` and shown as current | `handleAdd` |
| `InvalidUserInputError` thrown when either field empty | `src/types.ts` + `handleAdd` |
