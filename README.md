# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## Dev setup

Use the pinned Node version in `.nvmrc` (Node 22): `nvm use` (or your Node version manager) before running `npm install`. This keeps `package-lock.json` stable across machines.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Posting images (blog/reviews/Decap)
- Visible captions come from the image `alt` only. If you want hover text without a visible caption, set a Title and leave Alt empty. If you set both, Alt shows under the image; Title is hover-only.
- Alignment comes from `imageAlign` frontmatter (`left`, `right`, `center`); captions follow the image alignment automatically.
- Collections with alignment in Decap: Blog, Reviews, About, FAQ. Photography is intentionally fixed-layout (no alignment field).
- If a Markdown image is inside a paragraph, the page runtime will move the image into a `<figure>` placed after that paragraph and add a `<figcaption>` using the title/alt text. Empty paragraphs left behind are removed. You don’t need to do anything special—just know this normalization happens for proper caption alignment.
- Photography collection: captions come from the `caption` field; alt text from `alt` (fallback `title`).

- Written pages (Blog, Reviews, About, F.A.Q.) retain their original compact image display by default. To feature one larger photograph, use the reserved Markdown image title `{wide}`, as in `![Caption](/uploads/photo.jpg "{wide}")`. The marker is removed from hover text. Visible captions continue to use Alt; unlinked images can be clicked to enlarge. The separate Photography gallery is unchanged.
