"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Users, LogOut, Building } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => {
    return pathname === path 
  }

  const handleLogout = () => {
    // In a real app, this would handle authentication logout
    router.push("/")
  }

  const NavItem = ({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
        isActive(href) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  )

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Building className="h-5 w-5" />
          <span>Administration</span>
        </Link>
        <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <NavItem href="/admin" icon={Home}>
            Dashboard
          </NavItem>
        
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>MA</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium"> Admin</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden absolute top-4 left-4 z-10">
            <Building className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden border-r bg-background md:block w-64">
        <SidebarContent />
      </div>
    </>
  )
}

