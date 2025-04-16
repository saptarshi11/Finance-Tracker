import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getTransactions } from "@/lib/transactions"
import { getCategoryName } from "@/lib/categories"
import { DashboardClient } from "@/components/dashboard-client"

export default async function Home() {
  const transactions = await getTransactions()

  // Get recent transactions
  const recentTransactions = [...transactions].slice(0, 5)

  // Calculate totals
  const totalExpenses = transactions.reduce(
    (acc, transaction) => (transaction.type === "expense" ? acc + transaction.amount : acc),
    0,
  )

  const totalIncome = transactions.reduce(
    (acc, transaction) => (transaction.type === "income" ? acc + transaction.amount : acc),
    0,
  )

  const balance = totalIncome - totalExpenses

  // Get top expense category
  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, transaction) => {
        const { category, amount } = transaction
        acc[category] = (acc[category] || 0) + amount
        return acc
      },
      {} as Record<string, number>,
    )

  const topExpenseCategory =
    Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)
      .map(([category]) => category)[0] || ""

  const dashboardData = {
    transactions,
    recentTransactions,
    totalExpenses,
    totalIncome,
    balance,
    topExpenseCategory,
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-xl font-semibold">Personal Finance Tracker</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/transactions/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <DashboardClient
          data={dashboardData}
          topCategoryName={topExpenseCategory ? getCategoryName(topExpenseCategory) : "N/A"}
        />
      </main>
    </div>
  )
}
