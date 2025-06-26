"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Menu, X, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { useCart } from "@/hooks/useCart"
import { useDispatch } from "react-redux"
import { logout } from "@/store/slices/authSlice"
import { useLogoutMutation } from "@/store/api/authApi"
import CartModal from "./cart-modal"
import Image from "next/image"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  const { toast } = useToast()
  const pathname = usePathname()
  const dispatch = useDispatch()

  const { user, isAuthenticated } = useAuth()
  const { totalItems } = useCart()
  const [logoutMutation] = useLogoutMutation()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap()
      dispatch(logout())
      toast({ title: "Logged out", description: "You have been successfully logged out." })
    } catch (error) {
      dispatch(logout())
      toast({ title: "Logged out", description: "You have been logged out." })
    }
  }

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const getLinkClass = (path: string) => {
    return `font-medium ${isActive(path) ? "text-secondary" : "text-gray-800 hover:text-primary"} transition-colors`
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  return (
    <>
      <nav className="bg-white py-4 shadow-sm">
        <div className="container-custom flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-secondary text-2xl font-bold">dhaka bite</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={getLinkClass("/")}>Home</Link>
            <Link href="/subscription" className={getLinkClass("/subscription")}>Subscription</Link>
            <Link href="/blogs" className={getLinkClass("/blogs")}>Blogs</Link>
            <Link href="/contact-us" className={getLinkClass("/contact-us")}>Contact Us</Link>
            <Link href="/offers" className={getLinkClass("/offers")}>Offers</Link>
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && hasMounted && (
              <button className="flex items-center gap-1 border rounded-full px-4 py-1.5 transition-all duration-1000 ease-in-out relative overflow-hidden w-[180px] justify-center border-primary hover:text-white text-primary group">
                <div className="absolute inset-0 bg-primary transition-transform duration-1000 ease-in-out -translate-x-full group-hover:translate-x-0" />
                <CreditCard size={16} className="relative z-10" />
                <span className="relative z-10">
                  <span className="group-hover:hidden">Check Balance</span>
                  <span className="hidden group-hover:inline">৳{user?.balance?.toLocaleString() || "0"}</span>
                </span>
              </button>
            )}

            {/* Cart */}
            <div className="relative">
              <button onClick={toggleCart} className="flex items-center">
                <ShoppingCart className={isActive("/cart") ? "text-secondary" : "text-primary"} />
                {hasMounted && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {!isAuthenticated ? (
              <Link href="/login" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors">Login</Link>
            ) : (
              <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {user?.profileImage ? (
                      <Image src={user.profileImage || "/placeholder.svg"} alt={user.name || "User"} width={32} height={32} className="w-full h-full object-cover" />
                    ) : (
                      <User size={20} className="text-gray-600" />
                    )}
                  </div>
                  <div className="text-sm hidden md:block">
                    <p className="font-medium">{hasMounted && user?.name}</p>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                        handleLogout()
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Balance */}
            {isAuthenticated && hasMounted && (
              <button className="flex items-center gap-1 text-primary text-sm border border-primary px-3 py-1 rounded-full">
                <CreditCard size={16} />
                <span>৳{user?.balance?.toLocaleString() || "0"}</span>
              </button>
            )}

            {/* Cart */}
            <div className="relative">
              <button onClick={toggleCart} className="flex items-center">
                <ShoppingCart className={isActive("/cart") ? "text-secondary" : "text-primary"} />
                {hasMounted && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* Hamburger */}
            <button className="text-primary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 px-4 shadow-md">
            <div className="flex flex-col space-y-4">
              {["/", "/subscription", "/blogs", "/contact-us", "/offers"].map(path => (
                <Link key={path} href={path} className={`${getLinkClass(path)} block`} onClick={() => setIsMenuOpen(false)}>
                  {path === "/" ? "Home" : path.replace("/", "").replace("-", " ")}
                </Link>
              ))}

              <div className="pt-2 border-t border-gray-200">
                {!isAuthenticated ? (
                  <Link href="/login" className="flex items-center gap-1 text-primary w-full py-2" onClick={() => setIsMenuOpen(false)}>
                    <User size={16} />
                    <span>Login</span>
                  </Link>
                ) : (
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user?.profileImage ? (
                          <Image src={user.profileImage || "/placeholder.svg"} alt={user?.name || "user"} width={32} height={32} className="w-full h-full object-cover" />
                        ) : (
                          <User size={20} className="text-gray-600" />
                        )}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{hasMounted && user?.name}</p>
                        <p className="text-xs text-gray-500">User</p>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="text-gray-500 hover:text-primary">
                      <CreditCard size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
