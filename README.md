# Personal Finance Tracker

A modern, feature-rich finance tracking application built with Next.js that helps users manage their budgets, track expenses and income, and gain insights into their spending habits.


## 📌 Features

- **Dashboard Overview**: View total expenses, income, balance, and top spending categories at a glance
- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Budget Planning**: Set monthly budgets for different spending categories
- **Visual Analytics**:
  - Monthly expense/income charts
  - Category-based pie charts
  - Budget vs. actual spending comparisons
- **Spending Insights**: Receive detailed insights on budget progress, overspending categories, and saving opportunities
- **Responsive Design**: Fully responsive interface that works on desktop and mobile devices
- **Dark Mode**: Support for both light and dark themes

## 🚀 Tech Stack

- **Framework**: [Next.js 15]
- **UI Components**: [shadcn/ui] with [Radix UI]
- **Styling**: [TailwindCSS]
- **Database**: [MongoDB]
- **Charts**: [Recharts]
- **Form Handling**: [React Hook Form] with [Zod]
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Theme Switching**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Notifications**: [sonner](https://sonner.emilkowal.ski/)

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18 or newer)
- MongoDB (local or Atlas)
- pnpm, npm or yarn

### Step 1: Clone the repository
```bash
git clone https://github.com/saptarshi11/Finance-Tracker.git
cd Finance-Tracker
```

### Step 2: Install dependencies
```bash
pnpm install
# or
npm install
# or
yarn install
```

### Step 3: Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
```

### Step 4: Run the development server
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
finance-tracker/
├── app/                     # Next.js app router
│   ├── budgets/             # Budget pages
│   ├── transactions/        # Transaction pages
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # UI components from shadcn
│   ├── budget-form.tsx      # Budget form component
│   └── ...                  # Other components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions and API
│   ├── budgets.ts           # Budget operations
│   ├── transactions.ts      # Transaction operations
│   └── ...                  # Other utility files
├── public/                  # Static assets
└── styles/                  # Global styles
```

## 📊 Features In Detail

### Dashboard
- View summary of your financial situation
- Recent transactions
- Monthly expense trends
- Categorized spending breakdown

### Transactions
- Add new transactions (income or expenses)
- Categorize by predefined categories
- Edit or delete existing transactions
- Filter and search capabilities

### Budgets
- Set monthly budgets by category
- Visual comparison of budgeted vs. actual spending
- Budget progress indicators
- Alerts for overspending categories

### Insights
- Spending pattern analysis
- Budget adherence metrics
- Savings opportunities
- Top expense categories

## 🛠️ Development

### Build for production
```bash
pnpm build
# or
npm run build
# or
yarn build
```

### Run production build
```bash
pnpm start
# or
npm start
# or
yarn start
```

## 🧪 Testing
```bash
pnpm test
# or
npm run test
# or
yarn test
```

## 📬 Contact

saptarshimukherjee5300@gmail.com
Project Link: [https://github.com/saptarshi11/Finance-Tracker](https://github.com/saptarshi11/Finance-Tracker)
