"use client"

import { useMemo } from "react"
import { format } from "date-fns"
import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getCategoryName } from "@/lib/categories"
import type { Budget } from "@/lib/budgets"

type Transaction = {
  id: string
  description: string
  amount: number
  date: Date
  type: "income" | "expense"
  category: string
}

export function SpendingInsights({
  transactions,
  budgets,
  month,
}: {
  transactions: Transaction[]
  budgets: Budget[]
  month: string
}) {
  const insights = useMemo(() => {
    // Filter transactions for the selected month
    const monthStart = new Date(`${month}-01T00:00:00`)
    const monthEnd = new Date(new Date(monthStart).setMonth(monthStart.getMonth() + 1) - 1)

    const monthTransactions = transactions.filter((t) => {
      const date = new Date(t.date)
      return t.type === "expense" && date >= monthStart && date <= monthEnd
    })

    // Group transactions by category
    const expensesByCategory: Record<string, number> = {}

    monthTransactions.forEach((transaction) => {
      const { category, amount } = transaction
      expensesByCategory[category] = (expensesByCategory[category] || 0) + amount
    })

    // Calculate total spending
    const totalSpending = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0)

    // Calculate total budget
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)

    // Calculate budget progress for each category
    const categoryProgress = budgets
      .map((budget) => {
        const actual = expensesByCategory[budget.category] || 0
        const percentage = budget.amount > 0 ? Math.min(100, (actual / budget.amount) * 100) : 0
        const isOverBudget = actual > budget.amount

        return {
          category: budget.category,
          categoryName: getCategoryName(budget.category),
          budgeted: budget.amount,
          actual,
          percentage,
          isOverBudget,
          remaining: budget.amount - actual,
        }
      })
      .sort((a, b) => b.percentage - a.percentage)

    // Find categories over budget
    const overBudgetCategories = categoryProgress.filter((cat) => cat.isOverBudget)

    // Find categories with high spending (>80% of budget)
    const highSpendingCategories = categoryProgress.filter((cat) => cat.percentage >= 80 && cat.percentage < 100)

    // Find categories with low spending (<20% of budget)
    const lowSpendingCategories = categoryProgress.filter((cat) => cat.percentage < 20 && cat.budgeted > 0)

    return {
      totalSpending,
      totalBudget,
      overallPercentage: totalBudget > 0 ? Math.min(100, (totalSpending / totalBudget) * 100) : 0,
      categoryProgress,
      overBudgetCategories,
      highSpendingCategories,
      lowSpendingCategories,
      monthName: format(monthStart, "MMMM yyyy"),
    }
  }, [transactions, budgets, month])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Budget Progress</CardTitle>
          <CardDescription>Your spending for {insights.monthName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>
                ${insights.totalSpending.toFixed(2)} of ${insights.totalBudget.toFixed(2)}
              </span>
              <span>{insights.overallPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={insights.overallPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {insights.overBudgetCategories.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
          <CardHeader>
            <div className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              <CardTitle className="text-red-700">Over Budget Categories</CardTitle>
            </div>
            <CardDescription>These categories have exceeded their budget</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.overBudgetCategories.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{category.categoryName}</span>
                    <span className="text-red-600">
                      ${category.actual.toFixed(2)} of ${category.budgeted.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={category.percentage} className="h-2 bg-red-200" indicatorClassName="bg-red-600" />
                  <p className="text-sm text-red-600">
                    <TrendingUp className="inline mr-1 h-4 w-4" />${Math.abs(category.remaining).toFixed(2)} over budget
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {insights.highSpendingCategories.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/10">
          <CardHeader>
            <div className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              <CardTitle className="text-amber-700">Approaching Budget Limit</CardTitle>
            </div>
            <CardDescription>These categories are close to their budget limit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.highSpendingCategories.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{category.categoryName}</span>
                    <span className="text-amber-600">
                      ${category.actual.toFixed(2)} of ${category.budgeted.toFixed(2)}
                    </span>
                  </div>
                  <Progress
                    value={category.percentage}
                    className="h-2 bg-amber-200"
                    indicatorClassName="bg-amber-600"
                  />
                  <p className="text-sm text-amber-600">
                    ${category.remaining.toFixed(2)} remaining ({(100 - category.percentage).toFixed(0)}%)
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {insights.lowSpendingCategories.length > 0 && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/10">
          <CardHeader>
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
              <CardTitle className="text-green-700">Under Budget Categories</CardTitle>
            </div>
            <CardDescription>You're well under budget in these categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.lowSpendingCategories.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{category.categoryName}</span>
                    <span className="text-green-600">
                      ${category.actual.toFixed(2)} of ${category.budgeted.toFixed(2)}
                    </span>
                  </div>
                  <Progress
                    value={category.percentage}
                    className="h-2 bg-green-200"
                    indicatorClassName="bg-green-600"
                  />
                  <p className="text-sm text-green-600">
                    <TrendingDown className="inline mr-1 h-4 w-4" />${category.remaining.toFixed(2)} remaining (
                    {(100 - category.percentage).toFixed(0)}%)
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
