import Link from "next/link"
import { Facebook, Instagram, Music } from "lucide-react"
import Image from "next/image"
import { SiTiktok, SiWhatsapp } from "react-icons/si"

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container-custom">
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Logo and Description - Full width on mobile, first column on desktop */}
          <div className="text-center md:text-left md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              {/* <span className="text-secondary text-3xl font-bold">dhakabite</span> */}
               <Image
                  src="/dhaka-bite.svg"
                  alt="Dhaka Bite Logo"
                  width={40}  // ⬅️ Increased for better visibility
                  height={40}
                  priority // ⬅️ Improves load performance
                  className="h-auto w-auto object-contain" // ⬅️ Keeps aspect ratio cleanly
                />
            </Link>
            <p className="text-sm text-gray-200 mb-6">
              Dhakabite is a food delivery service that connects you with local restaurants in Dhaka.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link
              href="https://www.facebook.com/share/1BBhiDmhEj/"
              className="bg-primary p-2 rounded-md hover:bg-green-600 shadow-md transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook size={20} className="text-white" />
            </Link>
            <Link
              href="https://www.instagram.com/dhakabite?igsh=MXNpNzN3ejJwZzExdw=="
              className="bg-primary p-2 rounded-md hover:bg-green-600 shadow-md transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={20} className="text-white" />
            </Link>
            <Link
              href="https://www.tiktok.com/@dhaka_bite?_t=ZS-8wsWsjYPj8i&_r=1"
              className="bg-primary p-2 rounded-md hover:bg-green-600 shadow-md transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiTiktok size={20} className="text-white" />
            </Link>
            <Link
              href="https://wa.me/01621362024"
              className="bg-primary p-2 rounded-md hover:bg-green-600 shadow-md transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiWhatsapp size={20} className="text-white" />
            </Link>
            </div>
          </div>

          {/* On mobile: These two columns will be in one row below the logo */}
          <div className="grid grid-cols-2 gap-8 md:contents">
            {/* Column 2: Page Links */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Pages</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm hover:underline transition-colors">
                    About Dhakabite
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="text-sm hover:underline transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm hover:underline transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm hover:underline transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="text-sm hover:underline transition-colors">
                    Refund & Return Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Address */}
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-semibold mb-4">Address</h3>
              <ul className="space-y-2">
                <li className="text-sm">
                  <span className="font-medium">Kitchen Location:</span>
                  <br />
                  Mirbagh, Rampura
                </li>
                <li className="text-sm">
                  <span className="font-medium">Email:</span> dhakabite@gmail.com
                </li>
                <li className="text-sm">
                  <span className="font-medium">Mobile:</span> 01621362024
                </li>
                <li className="text-sm">
                  <span className="font-medium">Trade License:</span>
                  <br />
                  202526138690164477
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-white/20 pt-6 text-center text-sm text-gray-300">
          <p>© {new Date().getFullYear()} Dhaka Bite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}