"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { getCategoryById } from "@/lib/categories"

type Transaction = {
  id: string
  description: string
  amount: number
  date: Date
  type: "income" | "expense"
  category: string
}

export function CategoryPieChart({ transactions }: { transactions: Transaction[] }) {
  const chartData = useMemo(() => {
    // Only use expense transactions for the pie chart
    const expenseTransactions = transactions.filter((t) => t.type === "expense")

    // Group by category and sum amounts
    const categoryMap = new Map<string, number>()

    expenseTransactions.forEach((transaction) => {
      const { category, amount } = transaction
      const currentAmount = categoryMap.get(category) || 0
      categoryMap.set(category, currentAmount + amount)
    })

    // Convert to array for chart
    return Array.from(categoryMap.entries())
      .map(([categoryId, amount]) => {
        const category = getCategoryById(categoryId)
        return {
          name: category.name,
          value: amount,
          color: category.color,
          id: categoryId,
        }
      })
      .sort((a, b) => b.value - a.value) // Sort by amount descending
  }, [transactions])

  // Handle empty data
  if (chartData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No expense data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, ""]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
