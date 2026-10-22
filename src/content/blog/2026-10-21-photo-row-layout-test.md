---
title: "TEST ONLY — Two-Up Photo Layout (Preview Branch)"
pubDate: 2026-10-21T12:00:00-07:00
category: "Temporary QA"
imageAlign: center
---

**TEMPORARY TEST PAGE — not part of the PRGE retrospective.** This page exists only to test the two-up photo layout on the deploy-preview branch. It must be removed before the branch merges into the live site.

## Test A: Two photographs beside each other

On a desktop, these should appear in **one two-column row** with separate captions. On a phone, swipe horizontally to see the second photo. Click either photo to test its full-size lightbox.

![Pair A — existing photo from the website's uploads](/uploads/000009140001.jpg "{pair}")

![Pair B — a different existing photo from the website's uploads](/uploads/r3-06884-011a.jpg "{pair}")

## Test B: A second pair with different image sizes

This checks that the two-up treatment works repeatedly without merging two rows into one.

![Pair C — small existing site photo](/uploads/pokejuice_cropped.jpg "{pair}")

![Pair D — another existing site photo](/uploads/r5-06886-036a.jpg "{pair}")

## Control A: Ordinary standalone image

This image should behave exactly as before: a normal, centered, compact photograph with its own caption and lightbox.

![Standalone control — ordinary image](/uploads/yacksoncoin.jpg)

## Control B: Existing wide image

This image should retain the existing wide-image behavior, independent of the pairs above.

![Wide-image control — existing wide treatment](/uploads/000009140001.jpg "{wide}")

## Control C: Unpaired pair marker

This marker intentionally has no adjacent partner. It should stay a normal standalone image, not create an empty row.

![Single photograph with unpaired pair marker](/uploads/koji-igarashi.webp "{pair}")

---

**Review checklist:** desktop two-up; horizontal swipe on mobile; independent captions; click to enlarge each image; lightbox Previous/Next; regular image unchanged; wide image unchanged. Once confirmed, remove this article from the branch before merging.
