"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function getTransactions() {
  try {
    const { db } = await connectToDatabase()
    const transactions = await db.collection("transactions").find({}).sort({ date: -1 }).toArray()

    return transactions.map((transaction) => ({
      id: transaction._id.toString(),
      description: transaction.description,
      amount: transaction.amount,
      date: new Date(transaction.date),
      type: transaction.type,
      category: transaction.category || "other-expense",
      notes: transaction.notes,
    }))
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    return []
  }
}

export async function getTransactionById(id: string) {
  try {
    const { db } = await connectToDatabase()
    const transaction = await db.collection("transactions").findOne({ _id: new ObjectId(id) })

    if (!transaction) return null

    return {
      id: transaction._id.toString(),
      description: transaction.description,
      amount: transaction.amount,
      date: new Date(transaction.date),
      type: transaction.type,
      category: transaction.category || "other-expense",
      notes: transaction.notes,
    }
  } catch (error) {
    console.error("Failed to fetch transaction:", error)
    return null
  }
}

export async function createTransaction(data: {
  description: string
  amount: number
  date: Date
  type: "income" | "expense"
  category: string
  notes?: string
}) {
  try {
    const { db } = await connectToDatabase()
    const result = await db.collection("transactions").insertOne({
      description: data.description,
      amount: data.amount,
      date: data.date,
      type: data.type,
      category: data.category,
      notes: data.notes,
      createdAt: new Date(),
    })

    revalidatePath("/")
    return { success: true, id: result.insertedId.toString() }
  } catch (error) {
    console.error("Failed to create transaction:", error)
    throw new Error("Failed to create transaction")
  }
}

export async function updateTransaction(
  id: string,
  data: {
    description: string
    amount: number
    date: Date
    type: "income" | "expense"
    category: string
    notes?: string
  },
) {
  try {
    const { db } = await connectToDatabase()
    await db.collection("transactions").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          description: data.description,
          amount: data.amount,
          date: data.date,
          type: data.type,
          category: data.category,
          notes: data.notes,
          updatedAt: new Date(),
        },
      },
    )

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to update transaction:", error)
    throw new Error("Failed to update transaction")
  }
}

export async function deleteTransaction(id: string) {
  try {
    const { db } = await connectToDatabase()
    await db.collection("transactions").deleteOne({ _id: new ObjectId(id) })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete transaction:", error)
    throw new Error("Failed to delete transaction")
  }
}
