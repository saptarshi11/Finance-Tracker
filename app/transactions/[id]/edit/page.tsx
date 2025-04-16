import { notFound } from "next/navigation"

import { TransactionForm } from "@/components/transaction-form"
import { getTransactionById } from "@/lib/transactions"

export default async function EditTransactionPage({ params }: { params: { id: string } }) {
  const transaction = await getTransactionById(params.id)

  if (!transaction) {
    notFound()
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto w-full max-w-md">
          <h1 className="mb-6 text-2xl font-bold">Edit Transaction</h1>
          <TransactionForm transaction={transaction} />
        </div>
      </main>
    </div>
  )
}
