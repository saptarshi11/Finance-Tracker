import Link from "next/link"
import { format } from "date-fns"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BudgetVsActualChart } from "@/components/budget-vs-actual-chart"
import { SpendingInsights } from "@/components/spending-insights"
import { getBudgets } from "@/lib/budgets"
import { getTransactions } from "@/lib/transactions"
import { getCategoryName } from "@/lib/categories"

export default async function BudgetsPage() {
  // Get current month in YYYY-MM format
  const currentMonth = format(new Date(), "yyyy-MM")

  // Get budgets for current month
  const budgets = await getBudgets(currentMonth)

  // Get all transactions
  const transactions = await getTransactions()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-xl font-semibold">Personal Finance Tracker</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/budgets/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Budget
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Budget Overview</TabsTrigger>
            <TabsTrigger value="insights">Spending Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>Budget vs. Actual Spending</CardTitle>
                  <CardDescription>
                    Compare your budgeted amounts with actual spending for {format(new Date(currentMonth), "MMMM yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <BudgetVsActualChart transactions={transactions} budgets={budgets} month={currentMonth} />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>Current Budgets</CardTitle>
                  <CardDescription>
                    Your budget allocations for {format(new Date(currentMonth), "MMMM yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {budgets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6">
                      <p className="mb-4 text-muted-foreground">No budgets set for this month</p>
                      <Link href="/budgets/new">
                        <Button>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create Your First Budget
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="p-3 text-left font-medium">Category</th>
                            <th className="p-3 text-right font-medium">Budget Amount</th>
                            <th className="p-3 text-right font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {budgets.map((budget) => (
                            <tr key={budget.id} className="border-b">
                              <td className="p-3">{getCategoryName(budget.category)}</td>
                              <td className="p-3 text-right">${budget.amount.toFixed(2)}</td>
                              <td className="p-3 text-right">
                                <Link href={`/budgets/${budget.id}/edit`}>
                                  <Button variant="outline" size="sm">
                                    Edit
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="insights" className="space-y-4">
            <SpendingInsights transactions={transactions} budgets={budgets} month={currentMonth} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
