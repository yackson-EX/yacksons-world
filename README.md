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
- Existing Markdown images keep their current behavior: `alt` supplies the visible caption and accessible description, and a regular Title supplies hover text.
- For independent accessible descriptions, visible captions, and hover text, use an HTML image block in the Markdown source (or Decap's Markdown/source mode):

  ```html
  <img src="/uploads/photo.jpg" alt="A descriptive account of the photograph" data-caption="The visible caption" title="The hover text">
  ```

  `data-caption` supplies the caption below the photo and in the enlarged viewer; `alt` remains the accessible description in both. Omit `data-caption` to retain the existing Alt caption, or use `data-caption=""` to show no caption while retaining accessible Alt text. Caption and hover values are plain text, so punctuation, asterisks, emoticons, and caption spacing are preserved. Escape attribute characters such as `&` as `&amp;` and `"` as `&quot;`.
- Keep each HTML image in its own blank-line-separated block. Add `class="post-image-wide"` for a wide image, or add `data-photo-pair="true"` to each of two adjacent images for a paired row. These attributes leave `title` available for hover text.
- Alignment comes from `imageAlign` frontmatter (`left`, `right`, `center`); captions follow the image alignment automatically.
- Collections with alignment in Decap: Blog, Reviews, About, FAQ. Photography is intentionally fixed-layout (no alignment field).
- If an image is inside a paragraph, the page runtime will move the image into a `<figure>` placed after that paragraph and add a `<figcaption>` using `data-caption` (or legacy Alt). Empty paragraphs left behind are removed. This normalization keeps caption alignment consistent.
- Photography collection: captions come from the `caption` field; alt text from `alt` (fallback `title`).

- Written pages (Blog, Reviews, About, F.A.Q.) retain their original compact image display by default. Existing Markdown layout markers still work: `{wide}`, as in `![Caption](/uploads/photo.jpg "{wide}")`, features a larger photograph; two adjacent images titled `{pair}` form a paired row. These markers are removed from hover text. Unlinked images can be clicked to enlarge. The separate Photography gallery is unchanged.
