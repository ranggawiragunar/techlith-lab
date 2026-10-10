# Techlith Lab

Software Testing Laboratory — a local-first learning workspace for inventory and testing utilities.

## Getting started

```sh
npm install
npm run dev
```

The app stores application data in this browser's IndexedDB. The seeded local admin account is `admin` / `admin123`.

## Scripts

- `npm run dev` — start the Vite development server
- `npm run lint` — lint the TypeScript and React source
- `npm run build` — type-check and build the static site
- `npm run preview` — preview the production build

## Architecture

The React application and Vite configuration live at the repository root. Dexie manages the `TechlithSoftwareTestingDB` database; localStorage stores only the current session's user ID. Items and movements have internal database IDs plus unique public codes (`BRG-001`, `TRX-STK-0001`) for user-facing screens and routes. The app is designed for static hosting and does not require a backend service.

## Inventory features

- Item list, create, view, edit, archive, and restore. New items start at zero stock; stock is not edited through item forms.
- Seeded items use public business codes `BRG-001` through `BRG-010`. New item codes are generated sequentially and remain immutable; internal database IDs are not part of user-facing screens or routes.
- Stock Inbound records the item, quantity, previous and resulting stock, admin actor, source, notes, and immutable item snapshots in one IndexedDB transaction.
- Stock Outbound records the same movement details in one IndexedDB transaction. It supports fractional measures up to three decimal places and whole-number count units.
- Stock movements use public transaction codes such as `TRX-STK-0001` and snapshot the item's public code for history.
- Stock History shows movement details and supports item, type, and text filters. Archived items remain available in history.
- Testing Utilities can restore the 10-item seed baseline and clear local movements while keeping the admin session.

## Session 3 classroom source

The standalone Create React App project is maintained in `classroom/session-3-source/` and is separate from the root Vite application. After updating its allowlisted student files, run `python3 scripts/package-session-3-source.py` from the repository root to recreate `public/downloads/session-3-inventory-classroom.zip` with stable archive metadata. The script includes only the curated source files.
