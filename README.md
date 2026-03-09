# Gartic Draw Trainer

A desktop-first training app to improve **fast recognizable drawing** for Gartic-style rounds.

## Overview
Gartic Draw Trainer teaches the minimum viable sketch for each word: what to draw first, what to exaggerate, and when to stop. The focus is recognition speed, not artistic detail.

## Screenshots
- `docs/screenshot-main.png` (placeholder, run app and capture)

## Features
- Learn mode with key feature + step recipe
- Practice canvas with strokes, undo, timer, confidence
- Ghost replay pacing controls (0.5x–2x visual pulse in MVP)
- Category + difficulty filtering and search
- Daily/challenge-ready scoring primitives and history analytics
- Fast feedback engine (speed, stroke efficiency, simplification)
- Dataset pipeline with importer/normalizer/recipe generation

## Tech Stack
- Tauri-ready shell
- React + TypeScript + Vite
- Tailwind CSS
- Zustand state management
- Framer Motion animations
- HTML5 Canvas
- Zod-ready typed schema approach

## Installation
```bash
npm install
npm run import-words
npm run normalize-words
npm run generate-recipes
npm run dev
```

## Development Workflow
```bash
npm run dev
npm run lint
npm run test
npm run build
```

## Dataset Import Pipeline
1. `npm run import-words` fetches from source blog pages into `data/raw/importedWords.json`.
2. `npm run normalize-words` de-duplicates and normalizes accents into `data/processed/normalizedWords.json`.
3. `npm run generate-recipes` enriches words with difficulty + drawing recipes in `data/processed/wordRecipes.json`.
4. If remote parsing fails, fallback seed exists at `data/seeds/manualWords.json`.

## Contribution Guide
- Keep TypeScript strict and modular.
- Add tests for scoring/data logic.
- Preserve normalized + original forms.
- Prioritize recognizable simplification over detail.

## Roadmap
- Computer vision feedback on user drawings
- Online leaderboard
- User-created recipes and community packs
- Spaced repetition mode
- Cloud sync
- Multiplayer practice
- AI-generated simplification recipes
