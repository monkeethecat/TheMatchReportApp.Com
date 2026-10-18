# The Match Report — Website

A static website (plain HTML, CSS and JavaScript — no build step) for The Match Report app.

## Files

```
index.html          Home page
privacy.html        Privacy policy (DRAFT – review before publishing)
css/styles.css      All styles (brand palette at the top in :root)
js/main.js          Interactions, live-game demo, store links
assets/img/         Logo, illustrations, player faces, icons, social image
assets/fonts/       Self-hosted Fredoka + Bangers (SIL Open Font License)
robots.txt, sitemap.xml
firebase.json       Optional: ready for Firebase Hosting
```

## Before you publish – 4 quick edits

1. **App Store link** – open `js/main.js` and set `APP_STORE_URL` to your App Store URL
   (App Store Connect → your app → App Information → "View on App Store").
   Google Play is already set to `com.thematchreport.app`.
2. **Domain** – replace `https://www.thematchreport.app` in `index.html` (og:image / og:url),
   `robots.txt` and `sitemap.xml` with your real domain.
3. **Support email** – replace `support@thematchreport.app` in `index.html` and `privacy.html`.
4. **Privacy policy** – read `privacy.html` and get it checked against how you actually handle data.

## Preview locally

```
cd "The Match Report Website"
python3 -m http.server 8080
# open http://localhost:8080
```

## Publish

Upload the whole folder (keep the structure) to any static host:

- **Netlify** – drag the folder onto app.netlify.com/drop, then add your domain.
- **Firebase Hosting** (you already use Firebase) –
  `npm i -g firebase-tools && firebase login && firebase init hosting` (choose existing project,
  public dir `.`, don't overwrite index.html) then `firebase deploy --only hosting`.
- **GitHub Pages / Cloudflare Pages / any cPanel host** – upload the files to the web root.

Use the live URLs for the App Store "Support URL" and "Privacy Policy URL", and the Google Play
"Privacy policy" field.

## Store badges

The App Store / Google Play buttons are styled to match the comic look. If you want the official
badge artwork instead, download it from Apple's and Google's marketing guidelines pages and swap
the `<a class="store-badge">` contents for an `<img>`.
