"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { createTransaction, updateTransaction, deleteTransaction } from "@/lib/transactions"
import { CATEGORIES } from "@/lib/categories"

const formSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  date: z.date(),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  notes: z.string().optional(),
})

type TransactionFormValues = z.infer<typeof formSchema>

export function TransactionForm({
  transaction,
}: {
  transaction?: {
    id: string
    description: string
    amount: number
    date: Date
    type: "income" | "expense"
    category: string
    notes?: string
  }
} = {}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [transactionType, setTransactionType] = useState<"income" | "expense">(transaction?.type || "expense")

  const defaultValues: Partial<TransactionFormValues> = {
    description: transaction?.description || "",
    amount: transaction?.amount || 0,
    date: transaction?.date || new Date(),
    type: transaction?.type || "expense",
    category: transaction?.category || "",
    notes: transaction?.notes || "",
  }

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Filter categories based on transaction type
  const filteredCategories = CATEGORIES.filter((category) => category.type === transactionType)

  // Handle transaction type change
  const handleTypeChange = (value: "income" | "expense") => {
    setTransactionType(value)
    form.setValue("type", value)
    // Reset category when type changes
    form.setValue("category", "")
  }

  async function onSubmit(values: TransactionFormValues) {
    try {
      if (transaction) {
        await updateTransaction(transaction.id, values)
        toast({
          title: "Transaction updated",
          description: "Your transaction has been updated successfully.",
        })
      } else {
        await createTransaction(values)
        toast({
          title: "Transaction created",
          description: "Your transaction has been created successfully.",
        })
      }
      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function onDelete() {
    if (!transaction) return

    try {
      setIsDeleting(true)
      await deleteTransaction(transaction.id)
      toast({
        title: "Transaction deleted",
        description: "Your transaction has been deleted successfully.",
      })
      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Groceries, Salary, etc." {...field} />
              </FormControl>
              <FormDescription>A short description of the transaction.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormDescription>The amount of the transaction.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
              <FormDescription>The date of the transaction.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={(value) => handleTypeChange(value as "income" | "expense")}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Whether this is an income or expense.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>The category of the transaction.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional details about the transaction..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Optional notes about the transaction.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            {transaction ? "Update" : "Create"} Transaction
          </Button>
          {transaction && (
            <Button type="button" variant="destructive" onClick={onDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
