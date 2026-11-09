# Box of Movies 🎬📦

A streaming-style web app for discovering movies and TV shows: browse rows of titles, watch trailers, explore episodes, and keep a personal list for every profile.

Built with **React 18 + Vite**, **Firebase Authentication** and the **TMDB API**.

## Features

- **Accounts**: sign up, sign in, "Remember me" (persistent vs. session login) and password reset by email, with friendly error messages
- **Profiles ("Who's watching?")**: up to 5 profiles per account; add, edit, recolor or delete them; **Kids profiles** show only family-friendly titles
- **Browse pages**: Home, TV Shows, Movies, New & Popular and Kids, each with:
  - a large hero banner (random trending title, with its logo when TMDB has one)
  - horizontally scrolling rows with arrow buttons and hover cards (Play / + My List / More Info)
  - **Top 10** rows with large ranking numbers
  - genre rows (Action, Comedy, Horror, Sci-Fi, Documentaries…)
- **More Info popup**: rating, year, runtime/seasons, cast, genres, director/creators, **season & episode picker** for shows, and "More Like This". The popup state is kept in the URL, so it can be shared and the browser Back button closes it
- **Player**: full-screen YouTube trailer (picks the official trailer first); per-episode videos when available
- **My List** and **Continue Watching**, saved separately for each profile
- **Search**: live search across movies, shows and people (searching an actor shows the titles they're known for)
- **Browse by Languages**: filter by language, movie/TV type and sort order, with "Load more"
- **Notifications** bell with upcoming releases
- **Help Center** (FAQ, terms, privacy) and a 404 page
- Fully responsive (desktop, tablet, phone)

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

Production build:

```bash
npm run build
npm run preview
```

### Using your own keys (optional)

The app ships with working demo keys. To use your own, copy `.env.example` to `.env.local` and fill in:

- `VITE_TMDB_TOKEN`: your TMDB "API Read Access Token" (https://www.themoviedb.org/settings/api)
- `VITE_FIREBASE_*`: your Firebase web app config. In the Firebase console, enable **Authentication → Email/Password**

## Deploying

**GitHub Pages (automatic):** every push to `main` runs `.github/workflows/deploy.yml`. It lints and builds the app and publishes it to the `gh-pages` branch. The site is served at `https://<user>.github.io/<repo>/`.
If the site doesn't appear after the first run, open **Settings → Pages** and set *Source* to **Deploy from a branch → `gh-pages` / root**.

**Vercel / Netlify:** SPA fallback config is included (`vercel.json`, `public/_redirects`). Use build command `npm run build` and output directory `dist`.

To host under a sub-path yourself, build with `VITE_BASE=/your-path/ npm run build`.

## Project structure

```
src/
  api/          TMDB client (tmdb.js) and row definitions per page (rows.js)
  components/   Navbar, Hero, Row, Card, DetailsModal, Grid, Footer, Logo, Avatar, Spinner, route guards
  context/      AuthContext (Firebase user), ProfileContext (profiles, My List, history)
  hooks/        useTmdb, useDetails
  pages/        Login, Profiles, Browse, MyList, Search, Languages, Player, Info, NotFound
```

---

Movie and TV data and images are provided by [TMDB](https://www.themoviedb.org). This product uses the TMDB API but is not endorsed or certified by TMDB.
