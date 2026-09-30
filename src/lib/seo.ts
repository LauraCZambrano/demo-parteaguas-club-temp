// Lightweight SEO meta manager (no react-helmet dependency).
// Updates document title and meta/link tags imperatively, restoring previous values on cleanup.

type MetaTag =
  | { name: string; content: string }
  | { property: string; content: string };

interface SeoOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "article" | "website";
  siteName?: string;
}

const setMeta = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    Object.entries(attrs).forEach(([k, v]) => {
      if (k !== "content") el!.setAttribute(k, v);
    });
    document.head.appendChild(el);
  }
  el.setAttribute("content", attrs.content);
  return el;
};

const setLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  return el;
};

export const applySeo = ({ title, description, image, url, type = "article", siteName = (import.meta.env.VITE_SITE_NAME as string | undefined) ?? "Demo" }: SeoOptions) => {
  if (title) document.title = title;

  const tags: MetaTag[] = [];
  if (description) {
    tags.push({ name: "description", content: description });
    tags.push({ property: "og:description", content: description });
    tags.push({ name: "twitter:description", content: description });
  }
  if (title) {
    tags.push({ property: "og:title", content: title });
    tags.push({ name: "twitter:title", content: title });
  }
  if (image) {
    tags.push({ property: "og:image", content: image });
    tags.push({ name: "twitter:image", content: image });
    tags.push({ name: "twitter:card", content: "summary_large_image" });
  }
  if (url) {
    tags.push({ property: "og:url", content: url });
  }
  tags.push({ property: "og:type", content: type });
  tags.push({ property: "og:site_name", content: siteName });

  tags.forEach((t) => {
    if ("name" in t) {
      setMeta(`meta[name="${t.name}"]`, { name: t.name, content: t.content });
    } else {
      setMeta(`meta[property="${t.property}"]`, { property: t.property, content: t.content });
    }
  });

  if (url) setLink("canonical", url);
};
