# 🥳 GetTogether.social 🥳

## About

This repo contains the source code for [GetTogether.social](https://gettogether.social), a web application for hosting events (similar to Evite or Facebook Events).

## Technologies

- Next.js, deployed on Vercel
- Typescript
- Supabase (for Realtime Postgres, Auth, & File Storage)
- Tailwind CSS

## Contact

If you have problems, questions, ideas, or suggestions, please contact Ryan Tipps via email ( my name at gmail ).

## Local development

Use Node.js 22 and `npm ci`. Put the existing Supabase configuration in the ignored `.env.local` file:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_API_KEY` (public anonymous key)
- `SUPABASE_SERVICE_KEY` (server-only; required by the existing host-deletion API)

Run `npm run dev`, then open `http://localhost:3000`.

OAuth and email sign-in return to the current origin's `/login` route. Add `http://localhost:3000/login` and each intended Vercel preview origin's `/login` URL to **Supabase → Authentication → URL Configuration → Redirect URLs**. Keep the production Site URL unchanged. Unlisted callbacks fall back to the production Site URL.

## Checks

```sh
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev
```

The app stays on the Next.js Pages Router with React 18, Tailwind 3, and the existing Supabase schema. The Good Company design uses self-hosted DM Sans and Nunito Sans fonts, custom Tailwind components, native file inputs, and accessible HTML dialogs. DaisyUI is no longer required.

Next.js is on the patched 15.5 release line. Its nested PostCSS dependency is overridden to the patched version used by the build. The production dependency audit is clean at implementation time; the full audit still reports build-tool advisories in the Tailwind 3 / ESLint dependency chains.

The homepage and default event photograph (`public/gathering.jpg`) was generated with OpenAI's image generation tool for this design. Event-specific uploaded photos still take precedence.

**Shared database:** production, preview, and local development use the same data. Only modify or delete clearly identified test records you created. No schema migrations are included in this redesign.
