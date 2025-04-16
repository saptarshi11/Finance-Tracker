import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Home, Wallet, PieChart } from "lucide-react"

import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Personal Finance Tracker",
  description: "Track your income, expenses, and budgets",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <div className="flex flex-1">
            <aside className="hidden w-14 flex-col border-r bg-muted/40 sm:flex md:w-[240px]">
              <div className="flex h-14 items-center border-b px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <Wallet className="h-6 w-6" />
                  <span className="hidden md:inline">Finance Tracker</span>
                </Link>
              </div>
              <nav className="grid gap-2 p-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Home className="h-4 w-4" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
                <Link
                  href="/transactions/new"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <PieChart className="h-4 w-4" />
                  <span className="hidden md:inline">Add Transaction</span>
                </Link>
                <Link
                  href="/budgets"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Wallet className="h-4 w-4" />
                  <span className="hidden md:inline">Budgets</span>
                </Link>
              </nav>
            </aside>
            <div className="flex flex-1 flex-col">{children}</div>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}


import './globals.css'