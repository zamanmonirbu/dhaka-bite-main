import Link from "next/link"
import { Facebook, Instagram, Music } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container-custom">
        {/* Responsive Grid: 1 column mobile, 3 columns desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Logo and Description */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-block mb-4">
              <span className="text-secondary text-3xl font-bold">dhakabite</span>
            </Link>
            <p className="text-sm text-gray-200 mb-6">
              Lorem ipsum dolor sit amet consectetur. Nibh commodo fusce posuere aliquam morbi sagittis tempor. Sit sed
              nullam non urna malesuada elementum et. Turpis tellus purus vitae faucibus.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link
                href="https://facebook.com"
                className="bg-white/10 p-2 rounded-md hover:bg-white/20 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="https://instagram.com"
                className="bg-white/10 p-2 rounded-md hover:bg-white/20 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="https://tiktok.com"
                className="bg-white/10 p-2 rounded-md hover:bg-white/20 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Music size={20} />
              </Link>
            </div>
          </div>

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
                <span className="font-medium">Email:</span> dhakabite@gmail.com
              </li>
              <li className="text-sm">
                <span className="font-medium">Mobile:</span> 01999-999990
              </li>
              <li className="text-sm">
                <span className="font-medium">Trade License:</span>
                <br />
                202526138690164477
              </li>
            </ul>
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
