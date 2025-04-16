export const CATEGORIES = [
  // Income categories
  { id: "salary", name: "Salary", type: "income", color: "#22c55e" },
  { id: "freelance", name: "Freelance", type: "income", color: "#10b981" },
  { id: "investments", name: "Investments", type: "income", color: "#059669" },
  { id: "gifts", name: "Gifts", type: "income", color: "#34d399" },
  { id: "other-income", name: "Other Income", type: "income", color: "#6ee7b7" },

  // Expense categories
  { id: "housing", name: "Housing", type: "expense", color: "#ef4444" },
  { id: "food", name: "Food & Dining", type: "expense", color: "#f97316" },
  { id: "transportation", name: "Transportation", type: "expense", color: "#f59e0b" },
  { id: "utilities", name: "Utilities", type: "expense", color: "#eab308" },
  { id: "healthcare", name: "Healthcare", type: "expense", color: "#84cc16" },
  { id: "entertainment", name: "Entertainment", type: "expense", color: "#3b82f6" },
  { id: "shopping", name: "Shopping", type: "expense", color: "#8b5cf6" },
  { id: "education", name: "Education", type: "expense", color: "#a855f7" },
  { id: "personal", name: "Personal Care", type: "expense", color: "#d946ef" },
  { id: "travel", name: "Travel", type: "expense", color: "#ec4899" },
  { id: "debt", name: "Debt Payments", type: "expense", color: "#f43f5e" },
  { id: "other-expense", name: "Other Expenses", type: "expense", color: "#94a3b8" },
]

export function getCategoryById(id: string) {
  return (
    CATEGORIES.find((category) => category.id === id) || {
      id: "unknown",
      name: "Unknown",
      type: "expense",
      color: "#94a3b8",
    }
  )
}

export function getCategoryColor(id: string) {
  return getCategoryById(id).color
}

export function getCategoryName(id: string) {
  return getCategoryById(id).name
}
