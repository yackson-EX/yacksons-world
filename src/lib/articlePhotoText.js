// A deliberately small, safe text formatter: single *asterisks* mean emphasis.
// Everything else remains text, including HTML, unmatched stars, and kaomoji.
export function photoTextParts(text) {
  const parts = [];
  const emphasis = /(?<![\\*])\*(?![\s*])([^*\n]*?[^\s*])(?<!\\)\*(?!\*)/gu;
  let offset = 0;
  for (const match of text.matchAll(emphasis)) {
    if (match.index > offset) parts.push({ text: text.slice(offset, match.index), italic: false });
    parts.push({ text: match[1], italic: true });
    offset = match.index + match[0].length;
  }
  if (offset < text.length) parts.push({ text: text.slice(offset), italic: false });
  return parts;
}

export function renderPhotoText(element, text, formatted = false) {
  element.replaceChildren();
  if (!formatted) {
    element.textContent = text;
    return;
  }
  for (const part of photoTextParts(text)) {
    if (part.italic) {
      const emphasis = document.createElement("em");
      emphasis.textContent = part.text;
      element.appendChild(emphasis);
    } else {
      element.appendChild(document.createTextNode(part.text));
    }
  }
}

export function photoHoverText(image) {
  return image.getAttribute("data-photo-hover") ?? image.getAttribute("title");
}

// Native title tooltips cannot contain styled text. Only photos whose hover
// copy contains emphasis opt into this tooltip; ordinary titles stay native.
export function createPhotoTooltip() {
  const tooltip = document.createElement("div");
  tooltip.id = "article-photo-rich-tooltip";
  tooltip.className = "article-photo-rich-tooltip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.hidden = true;
  document.body.appendChild(tooltip);
  let activeTarget = null;
  let timer;

  const hide = () => {
    window.clearTimeout(timer);
    tooltip.hidden = true;
    if (activeTarget) {
      const descriptions = (activeTarget.getAttribute("aria-describedby") || "")
        .split(/\s+/).filter((id) => id && id !== tooltip.id);
      if (descriptions.length) activeTarget.setAttribute("aria-describedby", descriptions.join(" "));
      else activeTarget.removeAttribute("aria-describedby");
    }
    activeTarget = null;
  };

  const position = (image, pointer) => {
    const rect = image.getBoundingClientRect();
    const box = tooltip.getBoundingClientRect();
    const x = pointer ? pointer.clientX + 14 : rect.left + (rect.width - box.width) / 2;
    const y = pointer ? pointer.clientY + 18 : rect.bottom + 10;
    tooltip.style.left = `${Math.max(8, Math.min(x, window.innerWidth - box.width - 8))}px`;
    tooltip.style.top = `${Math.max(8, y + box.height > window.innerHeight - 8
      ? (pointer ? pointer.clientY : rect.top) - box.height - 10 : y)}px`;
  };

  const show = (image, focusTarget, pointer) => {
    const text = image.getAttribute("data-photo-hover");
    if (!text) return;
    window.clearTimeout(timer);
    if (activeTarget !== focusTarget) hide();
    renderPhotoText(tooltip, text, true);
    tooltip.hidden = false;
    activeTarget = focusTarget;
    const descriptions = new Set((focusTarget.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    descriptions.add(tooltip.id);
    focusTarget.setAttribute("aria-describedby", [...descriptions].join(" "));
    position(image, pointer);
  };

  const setText = (image, text) => {
    if (text !== null && photoTextParts(text).some((part) => part.italic)) {
      image.setAttribute("data-photo-hover", text);
      image.removeAttribute("title");
    } else {
      image.removeAttribute("data-photo-hover");
      if (text === null) image.removeAttribute("title");
      else image.setAttribute("title", text);
    }
  };

  const bind = (image, focusTarget = image) => {
    setText(image, photoHoverText(image));
    image.addEventListener("mouseenter", (event) => show(image, focusTarget, event));
    image.addEventListener("mouseleave", () => {
      timer = window.setTimeout(hide, 150);
    });
    focusTarget.addEventListener("focus", () => show(image, focusTarget, null));
    focusTarget.addEventListener("blur", hide);
    focusTarget.addEventListener("click", hide);
  };

  tooltip.addEventListener("mouseenter", () => window.clearTimeout(timer));
  tooltip.addEventListener("mouseleave", hide);
  window.addEventListener("keydown", (event) => { if (event.key === "Escape") hide(); });
  window.addEventListener("scroll", hide, { passive: true });
  window.addEventListener("resize", hide);
  return { bind, hide, setText };
}
