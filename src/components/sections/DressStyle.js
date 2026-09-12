import Image from 'next/image';
import Link from 'next/link';

export default function DressStyle() {
  return (
    <section className="py-8">
      <div className="container-main mx-auto px-4 lg:px-8">
        <div className="bg-gray-bg rounded-[40px] p-5 sm:p-6 md:p-10 lg:p-12 2xl:p-16 my-8">
          <h2 className="font-integral text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl text-center mb-8 md:mb-12 lg:mb-16 uppercase font-bold text-primary">
            BROWSE BY DRESS STYLE
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1.86fr] gap-4 lg:gap-5 mb-4 lg:mb-5">
            <Link href="/category/casual" className="relative h-[190px] sm:h-[200px] md:h-[218px] lg:h-[250px] 2xl:h-[289px] bg-white rounded-[20px] overflow-hidden group block">
              <Image src="/images/styles/casual.png" alt="Casual Style" fill className="object-cover object-right-top group-hover:scale-105 transition-transform duration-500 contrast-[1.15] brightness-[1.1]" />
              <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-6 lg:left-6 xl:top-9 xl:left-9">
                <span className="font-bold text-2xl sm:text-3xl lg:text-2xl xl:text-[36px] text-primary">Casual</span>
              </div>
            </Link>
            <Link href="/category/formal" className="relative h-[190px] sm:h-[200px] md:h-[218px] lg:h-[250px] 2xl:h-[289px] bg-white rounded-[20px] overflow-hidden group block">
              <Image src="/images/styles/formal.png" alt="Formal Style" fill className="object-cover object-right-top group-hover:scale-105 transition-transform duration-500 contrast-[1.15] brightness-[1.1]" />
              <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-6 lg:left-6 xl:top-9 xl:left-9">
                <span className="font-bold text-2xl sm:text-3xl lg:text-2xl xl:text-[36px] text-primary">Formal</span>
              </div>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.86fr_1fr] gap-4 lg:gap-5">
            <Link href="/category/party" className="relative h-[190px] sm:h-[200px] md:h-[218px] lg:h-[250px] 2xl:h-[289px] bg-white rounded-[20px] overflow-hidden group block">
              <Image src="/images/styles/party.png" alt="Party Style" fill className="object-cover object-right-top group-hover:scale-105 transition-transform duration-500 contrast-[1.15] brightness-[1.1]" />
              <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-6 lg:left-6 xl:top-9 xl:left-9">
                <span className="font-bold text-2xl sm:text-3xl lg:text-2xl xl:text-[36px] text-primary">Party</span>
              </div>
            </Link>
            <Link href="/category/gym" className="relative h-[190px] sm:h-[200px] md:h-[218px] lg:h-[250px] 2xl:h-[289px] bg-white rounded-[20px] overflow-hidden group block">
              <Image src="/images/styles/gym.png" alt="Gym Style" fill className="object-cover object-right-top group-hover:scale-105 transition-transform duration-500 contrast-[1.15] brightness-[1.1]" />
              <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-6 lg:left-6 xl:top-9 xl:left-9">
                <span className="font-bold text-2xl sm:text-3xl lg:text-2xl xl:text-[36px] text-primary">Gym</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
