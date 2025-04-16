"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { createBudget, updateBudget, deleteBudget } from "@/lib/budgets"
import { CATEGORIES } from "@/lib/categories"

const formSchema = z.object({
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  month: z.string().min(1, {
    message: "Please select a month.",
  }),
})

type BudgetFormValues = z.infer<typeof formSchema>

export function BudgetForm(
  {
    budget,
    currentMonth,
  }: {
    budget?: {
      id: string
      category: string
      amount: number
      month: string
    }
    currentMonth: string
  } = { currentMonth: format(new Date(), "yyyy-MM") },
) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter to only show expense categories
  const expenseCategories = CATEGORIES.filter((category) => category.type === "expense")

  const defaultValues: Partial<BudgetFormValues> = {
    category: budget?.category || "",
    amount: budget?.amount || 0,
    month: budget?.month || currentMonth,
  }

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: BudgetFormValues) {
    try {
      if (budget) {
        await updateBudget(budget.id, { amount: values.amount })
        toast({
          title: "Budget updated",
          description: "Your budget has been updated successfully.",
        })
      } else {
        await createBudget(values)
        toast({
          title: "Budget created",
          description: "Your budget has been created successfully.",
        })
      }
      router.push("/budgets")
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
    if (!budget) return

    try {
      setIsDeleting(true)
      await deleteBudget(budget.id)
      toast({
        title: "Budget deleted",
        description: "Your budget has been deleted successfully.",
      })
      router.push("/budgets")
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

  // Generate month options (current month and next 11 months)
  const getMonthOptions = () => {
    const options = []
    const now = new Date()

    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1)
      const value = format(date, "yyyy-MM")
      const label = format(date, "MMMM yyyy")
      options.push({ value, label })
    }

    return options
  }

  const monthOptions = getMonthOptions()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!!budget} // Disable if editing existing budget
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>The expense category for this budget.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormDescription>The maximum amount you want to spend in this category.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Month</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!!budget} // Disable if editing existing budget
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a month" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {monthOptions.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>The month for this budget.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            {budget ? "Update" : "Create"} Budget
          </Button>
          {budget && (
            <Button type="button" variant="destructive" onClick={onDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
