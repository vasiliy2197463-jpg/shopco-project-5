export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function generateBreadcrumbs(pathname) {
  if (!pathname) return [];
  const paths = pathname.split("/").filter((path) => path !== "");
  return paths.map((path, index) => {
    const href = "/" + paths.slice(0, index + 1).join("/");
    const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
    return { label, href };
  });
}

export function truncateText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
