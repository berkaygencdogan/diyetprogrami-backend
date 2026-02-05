// utils/buildAdHtml.js
export function buildAdHtml({ image_url, img_class, link_url }) {
  if (!image_url) return null;

  const imgClass = img_class || "w-full h-full object-cover";

  const img = `<img src="${image_url}" class="${imgClass}" />`;

  if (link_url) {
    return `<a href="${link_url}" target="_blank" rel="nofollow sponsored">${img}</a>`;
  }

  return img;
}
