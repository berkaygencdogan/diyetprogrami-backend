export function renderTemplate(template, data = {}) {
  if (!template) return null;

  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return data[key] ?? "";
  });
}
