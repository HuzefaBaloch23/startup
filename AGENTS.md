<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Codavolt site lives in src/codavolt/ (ported from the original Vite build, files are `@ts-nocheck`); index route lazy-loads it client-only because it uses GSAP/Three/window. Why: keeps SSR safe without rewriting the original code.
- Visual fixes go in src/codavolt/polish.css, loaded after codavolt.css. Why: keeps the 5k-line original stylesheet untouched and the overrides easy to find.
