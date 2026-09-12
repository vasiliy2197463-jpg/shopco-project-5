import Link from 'next/link';
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub, FaApplePay, FaGooglePay } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#F0F0F0] pt-20 md:pt-24 pb-8 px-4 md:px-6 font-satoshi relative">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2 lg:col-span-1 space-y-6">
            <h2 className="font-integral text-[28px] sm:text-[32px] font-bold text-black tracking-tight">SHOP.CO</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We have clothes that suits your style and which you're proud to wear. From women to men.
            </p>
            <div className="flex items-center space-x-3">
              <Link href="https://twitter.com" className="w-8 h-8 rounded-full bg-white border border-[rgba(0,0,0,0.1)] flex items-center justify-center hover:bg-black hover:text-white transition-colors" aria-label="Twitter">
                <FaTwitter size={14} />
              </Link>
              <Link href="https://facebook.com" className="w-8 h-8 rounded-full bg-white border border-[rgba(0,0,0,0.1)] flex items-center justify-center hover:bg-black hover:text-white transition-colors" aria-label="Facebook">
                <FaFacebookF size={14} />
              </Link>
              <Link href="https://instagram.com" className="w-8 h-8 rounded-full bg-white border border-[rgba(0,0,0,0.1)] flex items-center justify-center hover:bg-black hover:text-white transition-colors" aria-label="Instagram">
                <FaInstagram size={14} />
              </Link>
              <Link href="https://github.com" className="w-8 h-8 rounded-full bg-white border border-[rgba(0,0,0,0.1)] flex items-center justify-center hover:bg-black hover:text-white transition-colors" aria-label="GitHub">
                <FaGithub size={14} />
              </Link>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="uppercase tracking-widest font-medium text-base mb-6 text-black">Company</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/category/casual" className="text-gray-600 hover:text-black transition-colors">About</Link></li>
              <li><Link href="/category/casual" className="text-gray-600 hover:text-black transition-colors">Features</Link></li>
              <li><Link href="/category/casual" className="text-gray-600 hover:text-black transition-colors">Works</Link></li>
              <li><Link href="/category/casual" className="text-gray-600 hover:text-black transition-colors">Career</Link></li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h3 className="uppercase tracking-widest font-medium text-base mb-6 text-black">Help</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/category/casual" className="text-gray-600 hover:text-black transition-colors">Customer Support</Link></li>
              <li><Link href="/category/casual" className="text-gray-600 hover:text-black transition-colors">Delivery Details</Link></li>
              <li><Link href="/category/casual" className="text-gray-600 hover:text-black transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/category/casual" className="text-gray-600 hover:text-black transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="uppercase tracking-widest font-medium text-base mb-6 text-black">FAQ</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/category/casual" className="text-gray-600 hover:text-black transition-colors">Account</Link></li>
              <li><Link href="/category/casual" className="text-gray-600 hover:text-black transition-colors">Manage Deliveries</Link></li>
              <li><Link href="/category/casual" className="text-gray-600 hover:text-black transition-colors">Orders</Link></li>
              <li><Link href="/category/casual" className="text-gray-600 hover:text-black transition-colors">Payments</Link></li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h3 className="uppercase tracking-widest font-medium text-base mb-6 text-black">Resources</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/category/casual" className="text-gray-600 hover:text-black transition-colors">Free eBooks</Link></li>
              <li><Link href="/category/casual" className="text-gray-600 hover:text-black transition-colors">Development Tutorial</Link></li>
              <li><Link href="/category/casual" className="text-gray-600 hover:text-black transition-colors">How to - Blog</Link></li>
              <li><Link href="/category/casual" className="text-gray-600 hover:text-black transition-colors">Youtube Playlist</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-[rgba(0,0,0,0.1)] flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-sm text-gray-600">Shop.co © 2000-2023, All Rights Reserved</p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 md:gap-3 w-full md:w-auto">
            <div className="h-[32px] w-[46px] sm:h-[38px] sm:w-[56px] md:h-[46px] md:w-[66px] bg-white border border-[rgba(0,0,0,0.06)] rounded-lg flex items-center justify-center shadow-sm overflow-hidden shrink-0">
              <svg viewBox="0 0 48 16" className="h-3 sm:h-3.5 md:h-4 w-auto"><path d="M18.5 1.2L15.3 14.8H12.1L15.3 1.2H18.5ZM31.9 9.8L33.5 5.2L34.4 9.8H31.9ZM35.2 14.8H38L35.6 1.2H33C32.3 1.2 31.7 1.6 31.4 2.2L26.5 14.8H29.8L30.5 12.8H34.5L35.2 14.8ZM28 10.1C28 6.5 22.8 6.3 22.9 4.7C22.9 4.2 23.4 3.6 24.5 3.5C25 3.4 26.5 3.4 28.1 4.1L28.7 1.6C27.8 1.3 26.7 1 25.3 1C22.2 1 20 2.6 20 5C20 6.8 21.6 7.8 22.8 8.4C24.1 9 24.5 9.5 24.5 10.1C24.5 11 23.4 11.5 22.4 11.5C20.6 11.5 19.6 11 18.8 10.6L18.2 13.2C19 13.6 20.5 13.9 22.1 13.9C25.4 14 27.9 12.4 28 10.1ZM13.2 1.2L8.1 14.8H4.7L2.2 3.7C2 2.9 1.9 2.6 1.3 2.3C0.3 1.7 -0.8 1.3 -0.8 1.3L-0.7 1.2H4.4C5.2 1.2 5.8 1.7 6 2.5L7.3 9.5L10.5 1.2H13.2Z" fill="#1A1F71"/></svg>
            </div>
            <div className="h-[32px] w-[46px] sm:h-[38px] sm:w-[56px] md:h-[46px] md:w-[66px] bg-white border border-[rgba(0,0,0,0.06)] rounded-lg flex items-center justify-center shadow-sm overflow-hidden shrink-0">
              <svg viewBox="0 0 32 20" className="h-4 sm:h-4.5 md:h-5 w-auto">
                <circle cx="12" cy="10" r="8" fill="#EB001B"/>
                <circle cx="20" cy="10" r="8" fill="#F79E1B"/>
                <path d="M16 3.8C17.8 5.2 19 7.4 19 10C19 12.6 17.8 14.8 16 16.2C14.2 14.8 13 12.6 13 10C13 7.4 14.2 5.2 16 3.8Z" fill="#FF5F00"/>
              </svg>
            </div>
            <div className="h-[32px] w-[46px] sm:h-[38px] sm:w-[56px] md:h-[46px] md:w-[66px] bg-white border border-[rgba(0,0,0,0.06)] rounded-lg flex items-center justify-center shadow-sm overflow-hidden shrink-0">
              <svg viewBox="0 0 80 20" className="h-3 sm:h-3.5 md:h-4 w-auto"><text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#003087" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700" fontStyle="italic">Pay<tspan fill="#009cde">Pal</tspan></text></svg>
            </div>
            <div className="h-[32px] w-[46px] sm:h-[38px] sm:w-[56px] md:h-[46px] md:w-[66px] bg-white border border-[rgba(0,0,0,0.06)] rounded-lg flex items-center justify-center shadow-sm overflow-hidden text-black text-xl sm:text-2xl md:text-3xl shrink-0">
              <FaApplePay />
            </div>
            <div className="h-[32px] w-[46px] sm:h-[38px] sm:w-[56px] md:h-[46px] md:w-[66px] bg-white border border-[rgba(0,0,0,0.06)] rounded-lg flex items-center justify-center shadow-sm overflow-hidden shrink-0">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-3 sm:h-3.5 md:h-4 w-auto object-contain" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
