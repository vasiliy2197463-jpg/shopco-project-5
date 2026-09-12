import Image from 'next/image';

export default function BrandLogos() {
  const brands = [
    { src: '/images/brands/versace-official.svg', alt: 'Versace', className: 'h-[23px] sm:h-[27px] md:h-[33px]' },
    { src: '/images/brands/zara-uploaded.png', alt: 'Zara', className: 'h-[23px] sm:h-[27px] md:h-[33px]' },
    { src: '/images/brands/gucci-official.svg', alt: 'Gucci', className: 'h-[23px] sm:h-[27px] md:h-[33px]' },
    { src: '/images/brands/prada-official.svg', alt: 'Prada', className: 'h-[23px] sm:h-[27px] md:h-[33px]' },
    { src: '/images/brands/calvin-klein-official.svg', alt: 'Calvin Klein', className: 'h-[23px] sm:h-[27px] md:h-[33px]' },
  ];

  return (
    <div className="bg-black w-full py-5 md:py-7">
      <div className="container-main mx-auto px-6 lg:px-8">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between gap-x-12 gap-y-6 sm:gap-x-16 md:gap-x-6 lg:gap-x-10 w-full max-w-7xl mx-auto">
          {brands.map((brand) => (
            <div
              key={brand.alt}
              className="flex items-center justify-center transition-opacity hover:opacity-75 duration-300"
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
      </div>
    </div>
  );
}

