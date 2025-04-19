"use client"

import Link from "next/link"
import { useAuth } from "@/app/context/auth-context"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/actions/auth"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function NavBar() {
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">Skill Hub</span>
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/services" className="text-sm font-medium">
            Services
          </Link>

          {user?.role === "PROVIDER" ? (
            <Link href="/provider/dashboard" className="text-sm font-medium">
              Provider Dashboard
            </Link>
          ) : (
            <Link href="/register-provider" className="text-sm font-medium">
              Become a Provider
            </Link>
          )}

          <Link href="/about" className="text-sm font-medium">
            About Us
          </Link>

          {loading ? (
            <div className="h-9 w-20 bg-muted animate-pulse rounded-md"></div>
          ) : user ? (
            <>
              <Link href="/bookings" className="text-sm font-medium">
                My Bookings
              </Link>
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-4">
            <Link href="/services" className="text-sm font-medium" onClick={toggleMobileMenu}>
              Services
            </Link>

            {user?.role === "PROVIDER" ? (
              <Link href="/provider/dashboard" className="text-sm font-medium" onClick={toggleMobileMenu}>
                Provider Dashboard
              </Link>
            ) : (
              <Link href="/register-provider" className="text-sm font-medium" onClick={toggleMobileMenu}>
                Become a Provider
              </Link>
            )}

            <Link href="/about" className="text-sm font-medium" onClick={toggleMobileMenu}>
              About Us
            </Link>

            {loading ? (
              <div className="h-9 w-20 bg-muted animate-pulse rounded-md"></div>
            ) : user ? (
              <>
                <Link href="/bookings" className="text-sm font-medium" onClick={toggleMobileMenu}>
                  My Bookings
                </Link>
                <Button variant="outline" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/sign-in" onClick={toggleMobileMenu}>
                <Button>Sign In</Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
