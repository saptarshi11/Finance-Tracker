"use client"

import { useMemo } from "react"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type Transaction = {
  id: string
  description: string
  amount: number
  date: Date
  type: "income" | "expense"
}

export function MonthlyExpensesChart({ transactions }: { transactions: Transaction[] }) {
  const chartData = useMemo(() => {
    // Get the last 6 months
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i)
      return {
        month: format(date, "MMM"),
        startDate: startOfMonth(date),
        endDate: endOfMonth(date),
        expenses: 0,
        income: 0,
      }
    }).reverse()

    // Calculate expenses and income for each month
    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date)
      const month = months.find((m) => transactionDate >= m.startDate && transactionDate <= m.endDate)

      if (month) {
        if (transaction.type === "expense") {
          month.expenses += transaction.amount
        } else {
          month.income += transaction.amount
        }
      }
    })

    return months.map((m) => ({
      month: m.month,
      expenses: Number.parseFloat(m.expenses.toFixed(2)),
      income: Number.parseFloat(m.income.toFixed(2)),
    }))
  }, [transactions])

  // Handle empty data
  if (chartData.every((d) => d.expenses === 0 && d.income === 0)) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No transaction data available</p>
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
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value}`, ""]} labelFormatter={(label) => `Month: ${label}`} />
        <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
        <Bar dataKey="income" name="Income" fill="#22c55e" />
      </BarChart>
    </ResponsiveContainer>
  )
}
