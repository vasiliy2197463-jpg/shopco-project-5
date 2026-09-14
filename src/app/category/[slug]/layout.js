const categorySlugs = ['all', 't-shirts', 'shorts', 'shirts', 'hoodie', 'jeans', 'casual', 'formal', 'party', 'gym'];

export function generateStaticParams() {
  return categorySlugs.map((slug) => ({ slug }));
}

export default function CategoryLayout({ children }) {
  return children;
}
