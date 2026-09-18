export default function BrandLogos() {
  const brands = [
    'VERSA-CAT',
    'ZAR-R-R-A',
    'GUSSI',
    'PRAVDA',
    'LOUIS KOTTON',
    'CALVIN KITTEN',
  ];

  return (
    <div className="brand-marquee bg-black w-full py-5 md:py-7" aria-label="Featured brands">
      <div className="brand-marquee__track">
        {[0, 1].map((group) => (
          <div className="brand-marquee__group" aria-hidden={group === 1} key={group}>
          {brands.map((brand) => (
            <div
              key={`${group}-${brand}`}
              className="brand-marquee__logo whitespace-nowrap font-integral text-xl font-bold tracking-tight text-white transition-opacity duration-300 hover:opacity-75 sm:text-2xl md:text-[28px]"
            >
              {brand}
            </div>
          ))}
          </div>
        ))}
        </div>
    </div>
  );
}
