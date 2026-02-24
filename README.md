# Huddled

**Create and share meetups on campus.** Huddled is a mobile-friendly web app for Simon Fraser University students to post meetup ideas at campus locations and message each other in real time.

![Huddled](web/public/favicon.png)

---

## Features

- **Campus meetup feed** — Browse posts by location (Maggie Benston Center, Student Union Building, West Mall Center, Recreation, Library). Create posts with a location and description.
- **Real-time messaging** — One-on-one chat with other users. Inbox lists your recent conversations (up to 5); tap to open a thread.
- **SFU-only auth** — Sign up and sign in with an **@sfu.ca** email. Email verification required before using the app.
- **Profile & settings** — Choose an avatar, set major, year, and preferences. Settings and profile are available from the app navigation.
- **Responsive design** — Optimized for mobile and desktop:
  - **Desktop:** Horizontal carousel feed and left-side navigation rail.
  - **Mobile:** TikTok-style vertical scroll feed (10 posts), bottom tab bar, touch-friendly controls, and safe-area support for notched devices.

---

## Tech stack

| Layer        | Technology |
|-------------|------------|
| Frontend    | React 19, Vite 7 |
| UI          | Mantine, Tailwind CSS, DaisyUI |
| Routing     | React Router v7 |
| Backend     | Firebase (Authentication, Firestore) |
| Deployment  | Vercel (SPA with client-side routing) |

---

## Project structure

```
SFUConnect/
├── web/                 # Frontend app (Vite + React)
│   ├── public/          # Static assets, favicon
│   ├── src/
│   │   ├── App.jsx      # Main app, feed, and page state
│   │   ├── router.jsx  # Routes: /, /app, /verify, /profile, /settings
│   │   ├── firebase.js  # Firebase config (Auth, Firestore)
│   │   ├── AuthenticationForm.jsx
│   │   ├── Carousel.jsx # Feed (carousel on desktop, vertical scroll on mobile)
│   │   ├── chat.jsx, inbox.jsx
│   │   ├── Profile.jsx, settings.jsx
│   │   └── ...
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   ├── vercel.json      # Vercel build & SPA rewrites
│   └── package.json
└── README.md
```

---

## Getting started

### Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)

### Install and run locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/SFUConnect.git
   cd SFUConnect
   ```

2. **Install dependencies and start the dev server**
   ```bash
   cd web
   npm install
   npm run dev
   ```
   The app will be at `http://localhost:5173`.

3. **Firebase**  
   The app is wired to a Firebase project (Auth + Firestore). To use your own:
   - Create a project in [Firebase Console](https://console.firebase.google.com).
   - Enable **Authentication** (Email/Password) and **Firestore**.
   - Add your config in `web/src/firebase.js` (or use env vars and a small config change).
   - Deploy Firestore rules and indexes from `web/`:
     ```bash
     cd web && npx firebase deploy --only firestore:rules
     npx firebase deploy --only firestore:indexes
     ```

### Build for production

```bash
cd web
npm run build
```

Output is in `web/dist/`. To preview:

```bash
npm run preview
```

---

## Deployment (Vercel)

1. Import the repo in [Vercel](https://vercel.com).
2. Set **Root Directory** to **`web`**.
3. Build settings are read from `web/vercel.json` (Vite, `npm run build`, output `dist`, SPA rewrites).
4. Deploy. Branch deploys and preview URLs work as usual.

---

## Scripts (in `web/`)

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start Vite dev server    |
| `npm run build`| Production build        |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint              |

---

## License

MIT (or your chosen license.)

---

**Huddled** — meet up on the mountain.
