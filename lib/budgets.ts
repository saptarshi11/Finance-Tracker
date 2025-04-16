"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export type Budget = {
  id: string
  category: string
  amount: number
  month: string // Format: "YYYY-MM"
  createdAt: Date
  updatedAt?: Date
}

export async function getBudgets(month?: string) {
  try {
    const { db } = await connectToDatabase()

    const query = month ? { month } : {}

    const budgets = await db.collection("budgets").find(query).sort({ category: 1 }).toArray()

    return budgets.map((budget) => ({
      id: budget._id.toString(),
      category: budget.category,
      amount: budget.amount,
      month: budget.month,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    }))
  } catch (error) {
    console.error("Failed to fetch budgets:", error)
    return []
  }
}

export async function getBudgetById(id: string) {
  try {
    const { db } = await connectToDatabase()
    const budget = await db.collection("budgets").findOne({ _id: new ObjectId(id) })

    if (!budget) return null

    return {
      id: budget._id.toString(),
      category: budget.category,
      amount: budget.amount,
      month: budget.month,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    }
  } catch (error) {
    console.error("Failed to fetch budget:", error)
    return null
  }
}

export async function createBudget(data: {
  category: string
  amount: number
  month: string
}) {
  try {
    const { db } = await connectToDatabase()

    // Check if budget for this category and month already exists
    const existingBudget = await db.collection("budgets").findOne({
      category: data.category,
      month: data.month,
    })

    if (existingBudget) {
      // Update existing budget
      await db.collection("budgets").updateOne(
        { _id: existingBudget._id },
        {
          $set: {
            amount: data.amount,
            updatedAt: new Date(),
          },
        },
      )

      revalidatePath("/budgets")
      return { success: true, id: existingBudget._id.toString() }
    }

    // Create new budget
    const result = await db.collection("budgets").insertOne({
      category: data.category,
      amount: data.amount,
      month: data.month,
      createdAt: new Date(),
    })

    revalidatePath("/budgets")
    return { success: true, id: result.insertedId.toString() }
  } catch (error) {
    console.error("Failed to create budget:", error)
    throw new Error("Failed to create budget")
  }
}

export async function updateBudget(
  id: string,
  data: {
    amount: number
  },
) {
  try {
    const { db } = await connectToDatabase()
    await db.collection("budgets").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          amount: data.amount,
          updatedAt: new Date(),
        },
      },
    )

    revalidatePath("/budgets")
    return { success: true }
  } catch (error) {
    console.error("Failed to update budget:", error)
    throw new Error("Failed to update budget")
  }
}

export async function deleteBudget(id: string) {
  try {
    const { db } = await connectToDatabase()
    await db.collection("budgets").deleteOne({ _id: new ObjectId(id) })

    revalidatePath("/budgets")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete budget:", error)
    throw new Error("Failed to delete budget")
  }
}
