# clean-app

`clean-app` is an Expo + React Native application that simulates a city cleanliness reporting workflow.

It is currently a local-first demo app with four user roles:

- citizen
- volunteer
- worker
- admin

The app does not yet use a live backend. Authentication and report data are stored locally with Zustand and AsyncStorage.

## Overview

The core product flow is:

```text
Citizen creates report
  -> Admin reviews
  -> Volunteer or worker handles the task
  -> Admin closes or returns it
```

More explicitly:

```text
Citizen -> creates report -> new
Admin   -> approves/rejects
Volunteer handles normal cleanup reports
Worker handles black dump reports
Admin   -> resolves after review
```

## Tech Stack

- Expo SDK 55
- React 19
- React Native 0.83
- Expo Router
- Zustand
- AsyncStorage
- Zod
- React Query
- Axios

## Current Product Scope

What works now:

- demo login by role
- demo citizen registration
- role-based dashboards
- local report creation
- report review lifecycle
- report persistence across app restarts
- photo selection from gallery
- current GPS location capture
- shared report detail screen with role-specific actions

What is prepared but not implemented end-to-end:

- backend API integration
- React Query server data usage
- real authentication
- map UI
- in-app camera capture

## Project Structure

```text
clean-app/
  app/
    (auth)/
      _layout.tsx
      login.tsx
      register.tsx
    (citizen)/
      _layout.tsx
      index.tsx
      my-reports.tsx
      report-create.tsx
    (volunteer)/
      _layout.tsx
      index.tsx
    (worker)/
      _layout.tsx
      index.tsx
    (admin)/
      _layout.tsx
      index.tsx
    report/
      [id].tsx
    _layout.tsx
    index.tsx
  src/
    api/
    components/
    lib/
    providers/
    store/
    types/
  app.json
  eas.json
  package.json
  tsconfig.json
```

## Routing

Root behavior:

- unauthenticated users are redirected to `/(auth)/login`
- authenticated users are redirected to their role dashboard

Routes by area:

| Area | Route | Purpose |
| --- | --- | --- |
| Root | `/` | Redirect by auth state and role |
| Auth | `/(auth)/login` | Demo login |
| Auth | `/(auth)/register` | Demo citizen registration |
| Citizen | `/(citizen)` | Citizen dashboard |
| Citizen | `/(citizen)/report-create` | Create a report |
| Citizen | `/(citizen)/my-reports` | View own reports |
| Volunteer | `/(volunteer)` | Volunteer dashboard |
| Worker | `/(worker)` | Worker dashboard |
| Admin | `/(admin)` | Admin dashboard |
| Shared | `/report/[id]` | Shared report detail |

## Role Workflow

### Citizen

- can create reports
- can view only their own reports
- sees report counts and latest activity

### Volunteer

- can claim approved reports
- cannot claim `black_dump`
- workflow:
  - `approved` -> `assigned_volunteer`
  - `assigned_volunteer` -> `in_progress`
  - `in_progress` -> `waiting_for_review`

### Worker

- can claim only `black_dump`
- workflow:
  - `approved` -> `in_progress`
  - `in_progress` -> `waiting_for_review`

### Admin

- can approve or reject new reports
- can resolve reviewed reports
- can return reviewed reports back to `approved`

## Report Lifecycle

```text
new
 |- approve --------------------> approved
 |                                |- volunteer claim -> assigned_volunteer -> in_progress
 |                                |- worker claim -----------------------> in_progress
 |
 |- reject ---------------------> rejected
 |
waiting_for_review
 |- resolve --------------------> resolved
 |- return to queue ------------> approved
```

Important current rules:

- new reports always start in `new`
- reassignment is guarded in the reports store
- when a report is moved back to `approved`, `assignedTo` is cleared
- citizens cannot access someone else's report detail route

## State Management

### Auth store

File: `src/store/auth.store.ts`

Stores:

- `token`
- `user`
- `isAuthenticated`
- `hasHydrated`

Actions:

- `login`
- `logout`

### Reports store

File: `src/store/reports.store.ts`

Stores:

- `reports`
- `hasHydrated`

Actions:

- `createReport`
- `getReportById`
- `assignReport`
- `updateReportStatus`

Both stores are persisted with AsyncStorage and gated by hydration in the root layout.

## Validation

Zod schemas live in `src/lib/schemas.ts`.

Current validations:

- login email
- registration name + email
- report title + description

Forms currently use local `useState` rather than `react-hook-form`.

## Native Modules

Configured in `app.json`:

- `expo-location`
- `expo-image-picker`
- `expo-camera`

Current real usage:

- gallery selection via `expo-image-picker`
- GPS location via `expo-location`

Configured but not used in UI:

- `expo-camera`

Important runtime note:

If you see errors like `Cannot find native module 'ExponentImagePicker'`, the running client does not include the native module. Rebuild the development build or use a matching Expo Go version for SDK 55.

## Shared UI

Shared UI primitives live in `src/components/ui.tsx`.

Examples:

- `ScreenContainer`
- `HeroCard`
- `SurfaceCard`
- `AppButton`
- `StatusBadge`
- `LoadingScreen`

Role-based theme values live in `src/lib/theme.ts`.

## Running the Project

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npm start
```

Platform shortcuts:

```bash
npm run android
npm run ios
npm run web
```

## Verification

Type-check:

```bash
npx tsc --noEmit
```

Web export smoke test:

```bash
npx expo export --platform web --output-dir /tmp/clean-app-export
```

## EAS Profiles

Defined in `eas.json`:

- `development`
- `preview`
- `production`

`development` uses a development client and internal distribution.

## Current Limitations

- no real backend
- no production authentication
- no automated tests
- no lint setup
- no map screen
- no true camera capture flow
- several dependencies are installed ahead of actual usage

## Suggested Next Steps

1. Replace local-only reports with API-backed persistence.
2. Add real auth.
3. Add tests around report lifecycle transitions.
4. Introduce React Query queries and mutations.
5. Add camera capture and map-based location selection.
6. Remove or implement currently unused dependencies.

## Additional Documentation

A fuller project document and a PDF-friendly guide were generated from the current codebase outside the repo during this session.

