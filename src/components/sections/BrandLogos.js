import Image from '@/components/common/BaseImage';

export default function BrandLogos() {
  const brands = [
    { src: '/images/brands/versace-official.svg', alt: 'Versace', className: 'h-[23px] sm:h-[27px] md:h-[33px]' },
    { src: '/images/brands/zara-uploaded.png', alt: 'Zara', className: 'h-[23px] sm:h-[27px] md:h-[33px]' },
    { src: '/images/brands/gucci-official.svg', alt: 'Gucci', className: 'h-[23px] sm:h-[27px] md:h-[33px]' },
    { src: '/images/brands/prada-official.svg', alt: 'Prada', className: 'h-[23px] sm:h-[27px] md:h-[33px]' },
    { src: '/images/brands/calvin-klein-official.svg', alt: 'Calvin Klein', className: 'h-[23px] sm:h-[27px] md:h-[33px]' },
  ];

  return (
    <div className="brand-marquee bg-black w-full py-5 md:py-7" aria-label="Featured brands">
      <div className="brand-marquee__track">
        {[0, 1].map((group) => (
          <div className="brand-marquee__group" aria-hidden={group === 1} key={group}>
          {brands.map((brand) => (
            <div
              key={`${group}-${brand.alt}`}
              className="brand-marquee__logo transition-opacity hover:opacity-75 duration-300"
            >
              <Image
                src={brand.src}
                alt={brand.alt}
                width={brand.width || 120}
                height={brand.height || 35}
                unoptimized
                className={`${brand.className} w-auto object-contain select-none`}
              />
            </div>
          ))}
          </div>
        ))}
        </div>
    </div>
  );
}
