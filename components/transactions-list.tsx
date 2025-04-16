"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Edit, ArrowUpRight, ArrowDownRight } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getCategoryName } from "@/lib/categories"

type Transaction = {
  id: string
  description: string
  amount: number
  date: Date
  type: "income" | "expense"
  category: string
  notes?: string
}

export function TransactionsList({ transactions }: { transactions: Transaction[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all")

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[180px]">
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as "all" | "income" | "expense")}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>{format(new Date(transaction.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryName(transaction.category)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {transaction.type === "income" ? (
                        <>
                          <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                          <span>Income</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                          <span>Expense</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell
                    className={`text-right ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                  >
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/transactions/${transaction.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
