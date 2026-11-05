# ClydeDev portfolio (Version 1)

Personal portfolio for **Claide Dev**, a software engineering student and builder.
Plain HTML5, CSS3 and vanilla JavaScript. No frameworks, no build step, no dependencies.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Pages and files

```
portfolio/
├── index.html            Home
├── about.html
├── skills.html
├── projects.html
├── journey.html
├── contact.html
├── style.css            design tokens (CSS variables), layout, components
├── script.js            project and journey data, plus interactive features
├── favicon.svg
├── assets/              add project images and CV here as needed
├── projects/            reserved for future case-study pages
└── README.md
```

The navigation at the top of every page links between these HTML files.

## Updating content (in `script.js`, top section)

| What | Where |
| --- | --- |
| Email, GitHub, LinkedIn, CV | `SITE` |
| Projects (cards, filters, case studies) | `PROJECTS` |
| Journey timeline | `JOURNEY` |
| "Currently learning" list | `LEARNING` |

**Add a project:** copy the object in `PROJECTS`, change the fields, and set `featured: false`.
Filter buttons appear automatically once projects span two or more categories.
Only set `live` when a real deployment exists.

**Screenshot:** save an optimised image (WebP, about 1200px wide) in `assets/images/`, then set
`screenshot: 'assets/images/name.webp'` and `screenshotAlt: '...'`.

**Case study:** fill in the `caseStudy` fields. Empty fields show "To be written."

**CV:** put the PDF at `assets/Clyde.cv.pdf`, then set `cv.available: true`.
The path starts with `/`, so it works at a domain root. On a GitHub Pages *project* site
(`user.github.io/repo/`), change it to `assets/Clyde.cv.pdf` in both `SITE.cv.path` and the HTML.

**LinkedIn:** set `SITE.linkedin` to your real profile URL and the links in the hero and footer appear.

## Contact form

The form validates name, email and message, but there is no backend, so **nothing is sent**.
After it passes, the visitor gets a link that opens a pre-filled draft in their email app.
To send for real later, connect a service (for example a serverless function or a form provider).

## Deploying on GitHub Pages

1. Push this folder to a GitHub repository.
2. Settings > Pages > deploy from the `main` branch, root folder.
3. After it is live, add `og:url` and an `og:image` (absolute URL, 1200x630) in `index.html`.

## Security

Everything here is public. Never put API keys, tokens or passwords in these files.
When you add GitHub API integration later, call it from a small backend or serverless function.

## Ideas for later

GitHub API repo list, blog, React rewrite, backend and database, analytics, custom domain.
