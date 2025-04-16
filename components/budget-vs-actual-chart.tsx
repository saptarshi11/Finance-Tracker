"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { getCategoryById, getCategoryName } from "@/lib/categories"
import type { Budget } from "@/lib/budgets"

type Transaction = {
  id: string
  description: string
  amount: number
  date: Date
  type: "income" | "expense"
  category: string
}

export function BudgetVsActualChart({
  transactions,
  budgets,
  month,
}: {
  transactions: Transaction[]
  budgets: Budget[]
  month: string
}) {
  const chartData = useMemo(() => {
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

    // Create data for chart
    return budgets
      .map((budget) => {
        const actual = expensesByCategory[budget.category] || 0
        const remaining = Math.max(0, budget.amount - actual)
        const overspent = actual > budget.amount ? actual - budget.amount : 0
        const category = getCategoryById(budget.category)

        return {
          name: getCategoryName(budget.category),
          budgeted: budget.amount,
          actual,
          remaining,
          overspent,
          color: category.color,
          id: budget.category,
        }
      })
      .sort((a, b) => b.actual - a.actual) // Sort by actual spending
  }, [transactions, budgets, month])

  // Handle empty data
  if (chartData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No budget data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, ""]} />
        <Legend />
        <Bar dataKey="budgeted" name="Budgeted" fill="#94a3b8" />
        <Bar dataKey="actual" name="Actual" fill="#ef4444">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
