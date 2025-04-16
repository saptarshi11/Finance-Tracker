import { format } from "date-fns"
import { BudgetForm } from "@/components/budget-form"

export default function NewBudgetPage() {
  // Get current month in YYYY-MM format
  const currentMonth = format(new Date(), "yyyy-MM")

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto w-full max-w-md">
          <h1 className="mb-6 text-2xl font-bold">Create New Budget</h1>
          <BudgetForm currentMonth={currentMonth} />
        </div>
      </main>
    </div>
  )
}
