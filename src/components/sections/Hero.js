import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/common/Button';

export default function Hero() {
  return (
    <section className="bg-gray-bg w-full">
      <div className="container-main mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row pt-10 md:pt-16 lg:pt-24 gap-10 lg:gap-0">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="font-integral text-[28px] sm:text-4xl md:text-5xl lg:text-[64px] lg:leading-[64px] font-bold text-primary mb-5 lg:mb-8 max-w-[500px]">
              FIND CLOTHES THAT MATCHES YOUR STYLE
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-8 lg:mb-10 max-w-[545px]">
              Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
            </p>
            <div className="mb-10 lg:mb-12">
              <Link href="/category/casual" className="block w-full lg:w-auto">
                <Button variant="primary" size="lg" className="w-full lg:w-auto px-16 rounded-pill">
                  Shop Now
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap md:flex-nowrap justify-center lg:justify-start gap-4 sm:gap-8 lg:gap-12">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-primary">200+</span>
                <span className="text-gray-600 text-xs sm:text-sm lg:text-base">International Brands</span>
              </div>
              <div className="hidden sm:block w-px bg-gray-300 h-auto"></div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-primary">2,000+</span>
                <span className="text-gray-600 text-xs sm:text-sm lg:text-base">High-Quality Products</span>
              </div>
              <div className="hidden lg:block w-px bg-gray-300 h-auto"></div>
              <div className="flex flex-col items-center lg:items-start w-full sm:w-auto mt-4 sm:mt-0">
                <span className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-primary">30,000+</span>
                <span className="text-gray-600 text-xs sm:text-sm lg:text-base">Happy Customers</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 relative min-h-[350px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[600px] flex items-end justify-center lg:justify-end overflow-hidden">
            <div className="absolute top-10 right-8 lg:top-24 lg:right-16 w-14 h-14 lg:w-[104px] lg:h-[104px] animate-pulse">
              <svg viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M52 0L63.5358 38.4642L102 50L63.5358 61.5358L52 100L40.4642 61.5358L2 50L40.4642 38.4642L52 0Z" fill="black"/>
              </svg>
            </div>
            <div className="absolute top-1/3 left-4 lg:top-1/2 lg:left-10 w-9 h-9 lg:w-14 lg:h-14 animate-pulse">
              <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28 0L34.2114 20.7886L55 27L34.2114 33.2114L28 54L21.7886 33.2114L1 27L21.7886 20.7886L28 0Z" fill="black"/>
              </svg>
            </div>
            <Image 
              src="/images/hero/hero-banner.png" 
              alt="Fashion models" 
              width={600}
              height={600}
              className="object-contain w-full max-w-[500px] lg:max-w-none h-auto z-10"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
