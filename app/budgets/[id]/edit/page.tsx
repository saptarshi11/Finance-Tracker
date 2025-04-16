import { notFound } from "next/navigation"
import { BudgetForm } from "@/components/budget-form"
import { getBudgetById } from "@/lib/budgets"

export default async function EditBudgetPage({ params }: { params: { id: string } }) {
  const budget = await getBudgetById(params.id)

  if (!budget) {
    notFound()
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto w-full max-w-md">
          <h1 className="mb-6 text-2xl font-bold">Edit Budget</h1>
          <BudgetForm budget={budget} currentMonth={budget.month} />
        </div>
      </main>
    </div>
  )
}
