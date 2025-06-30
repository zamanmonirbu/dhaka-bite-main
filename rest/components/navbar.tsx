"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Menu, X, CreditCard, ChevronDown, Plus, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { useCart } from "@/hooks/useCart"
import { useDispatch } from "react-redux"
import { logout } from "@/store/slices/authSlice"
import { useLogoutMutation } from "@/store/api/authApi"
import CartModal from "./cart-modal"
import Image from "next/image"
import AddBalanceModal from "./AddBalanceModal"





export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false)
  const [isBalanceVisible, setIsBalanceVisible] = useState(false)
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
    setIsDropdownOpen(false)
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

  const handleBalanceSuccess = (amount: number) => {
    toast({
      title: "Payment Submitted",
      description: `Your payment of ৳${amount.toLocaleString()} has been submitted for review.`,
    })
  }

  return (
    <>
      <nav className="bg-[#f2e2b7] py-4 shadow-sm">
        <div className="container-custom flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/dhaka-bite.svg"
              alt="Dhaka Bite Logo"
              width={40}
              height={40}
              priority
              className="h-auto w-auto object-contain"
            />
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBalanceVisible(prev => !prev)}
                  className="flex items-center gap-1 border rounded-l-full px-2 py-1.5 bg-primary text-white h-[42px] transition-all duration-300 w-[140px] overflow-hidden"
                >
                  <CreditCard size={16} className="text-primary shrink-0" />
                  <span
                    className={`text-sm font-medium transition-all duration-300 ease-in-out transform ${isBalanceVisible ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                      }`}
                  >
                    ৳{user?.balance?.toLocaleString() || "0"}
                  </span>
                  {!isBalanceVisible && (
                    <span className="text-sm font-medium text-white transition-opacity duration-300 flex">
                      <Eye className="text-white" size={16} /> <div className="pl-1">Balance</div>

                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsBalanceModalOpen(true)}
                  className="bg-primary text-white rounded-r-full px-4 py-1.5 h-[42px] hover:bg-opacity-90 transition-colors"
                >
                  <Plus className="text-white" size={16} />
                </button>
              </div>

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

            {/* User Dropdown */}
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
                  {/* <div className="text-sm hidden md:block">
                    <p className="font-medium">{hasMounted && user?.name}</p>
                  </div> */}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
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
  {isAuthenticated && hasMounted && (
    <div className="flex items-center gap-1">
      {/* Toggle balance */}
      <button
        onClick={() => setIsBalanceVisible(prev => !prev)}
        className="flex items-center gap-1 text-primary text-sm border border-primary px-3 py-1  h-[32px] rounded-l-full transition-all duration-300"
      >
        <CreditCard size={16} />
        {isBalanceVisible ? (
          <span className="transition-opacity duration-300">
            ৳{user?.balance?.toLocaleString() || "0"}
          </span>
        ) : (
          <span>Check</span>
        )}
      </button>

      {/* Add Balance */}
      <button
        onClick={() => setIsBalanceModalOpen(true)}
        className="bg-primary text-white rounded-r-full px-3 py-1 h-[32px] hover:bg-opacity-90 transition-colors"
        aria-label="Add Balance"
      >
        <Plus size={16} />
      </button>
    </div>
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
                  {path === "/" ? "Home" : path.replace("/", "").replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())}
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
                      {/* <div className="text-sm">
                        <p className="font-medium">{hasMounted && user?.name}</p>
                        <p className="text-xs text-gray-500">User</p>
                      </div> */}
                    </div>
                    <button onClick={handleLogout} className="text-red-600 hover:text-primary">
                      Logout
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

      {/* Add Balance Modal */}
      <AddBalanceModal
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        onSuccess={handleBalanceSuccess}
        user={user}
      />
    </>
  )
}
