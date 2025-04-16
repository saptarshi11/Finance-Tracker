"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionsList } from "@/components/transactions-list"
import { MonthlyExpensesChart } from "@/components/monthly-expenses-chart"
import { CategoryPieChart } from "@/components/category-pie-chart"

type Transaction = {
  id: string
  description: string
  amount: number
  date: Date
  type: "income" | "expense"
  category: string
  notes?: string
}

type DashboardProps = {
  data: {
    transactions: Transaction[]
    recentTransactions: Transaction[]
    totalExpenses: number
    totalIncome: number
    balance: number
    topExpenseCategory: string
  }
  topCategoryName: string
}

export function DashboardClient({ data, topCategoryName }: DashboardProps) {
  const { transactions, recentTransactions, totalExpenses, totalIncome, balance } = data

  return (
    <Tabs defaultValue="dashboard" className="space-y-4">
      <TabsList>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${balance.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topCategoryName}</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Monthly Expenses</CardTitle>
              <CardDescription>Your spending pattern over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <MonthlyExpensesChart transactions={transactions} />
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
              <CardDescription>Breakdown of your expenses by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <CategoryPieChart transactions={transactions} />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your most recent financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionsList transactions={recentTransactions} />
            <div className="mt-4 flex justify-center">
              <Link href="#" onClick={() => document.querySelector('[data-value="transactions"]')?.click()}>
                <Button variant="outline">View All Transactions</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="transactions" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>Manage your financial transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionsList transactions={transactions} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
