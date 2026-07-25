
# 💰 Budget Buddy

### **Track Smart. Save Better.**

> **Budget Buddy** is a modern, cross-platform personal finance management application built with **React Native + Expo**, designed to make expense tracking, budgeting, savings, and financial insights simple and intuitive.

What makes Budget Buddy different is its **AI-style Voice Assistant experience**, allowing users to interact with their finances using natural voice commands such as:

> 🎙️ *"Add expense 500 for food"*
> 🎙️ *"How much have I spent this month?"*
> 🎙️ *"What is my remaining budget?"*
> 🎙️ *"Show today's expenses"*
> 🎙️ *"Open analytics"*

The application combines **personal finance tracking, analytics, savings goals, gamification, voice interaction, and a clean modern UI** into a single cross-platform experience.

---

## 🌐 Live Demo

### 🖥️ Web Application

**Live Demo:**
https://techtitans-budget-buddy.netlify.app/

### 📱 Mobile Application

Built with **Expo** and can be run through Expo development tools or packaged as an Android APK using **EAS Build**.

---

# ✨ Why Budget Buddy?

Managing personal finances shouldn't feel complicated.

Budget Buddy is designed around a simple idea:

> **Track your money effortlessly → Understand your spending → Build better financial habits.**

Instead of manually navigating through multiple screens for every action, users can quickly interact with their finances using the **Voice Assistant**, while dashboards and analytics provide a clear overview of their financial health.

---

# 🚀 Key Features

## 🎙️ Voice Assistant — The Highlight Feature

Budget Buddy includes a floating **Voice Assistant** that allows users to control and query their finances using voice commands.

### Supported Commands

#### 💸 Add Expenses

```text
"Add expense 500 for food"
```

Automatically creates an expense transaction with the detected amount and category.

#### 💰 Add Income

```text
"Add income 30000"
```

Adds an income transaction directly to the user's financial records.

#### 📊 Check Spending

```text
"How much have I spent this month?"
```

Returns the total expenses for the current month.

#### 📅 Today's Expenses

```text
"Show today's expenses"
```

Provides the total amount spent during the current day.

#### 💳 Check Remaining Budget

```text
"What is my remaining budget?"
```

Returns the remaining amount from the configured monthly budget.

#### 🧭 Navigate Through the App

```text
"Open analytics"
"Open goals"
"Open profile"
"Go to home"
```

The assistant can navigate users to different sections of the application.

### 🔊 Text-to-Speech Responses

The assistant doesn't just process commands — it also responds using speech.

For example:

> **User:** "How much have I spent this month?"

> **Budget Buddy:** "You spent ₹12,500 this month."

Voice responses are powered by **Expo Speech**.

### 🌐 Cross-Platform Voice Experience

* **Web:** Uses browser-based Speech Recognition where supported.
* **Mobile:** Provides a text-command fallback when native speech recognition is unavailable in the current Expo environment.
* **Text fallback:** Users can type commands manually if voice recognition isn't supported.

This ensures the assistant remains usable across different environments.

---

# 📊 Personal Finance Dashboard

The home dashboard provides a quick overview of the user's financial activity.

### Dashboard includes:

* 💰 Total Balance
* 📈 Monthly Income
* 📉 Monthly Expenses
* 💵 Savings
* 🎯 Monthly Budget
* 🔄 Budget Progress Ring
* 🏷️ Spending by Category
* 🧾 Recent Transactions
* ⚡ Quick Actions

Users can understand their current financial situation without navigating through multiple screens.

---

# 💳 Smart Transaction Management

Budget Buddy provides complete transaction management.

### Users can:

* ➕ Add income
* ➖ Add expenses
* ✏️ Edit transactions
* 🗑️ Delete transactions
* 🏷️ Assign categories
* 💳 Select payment methods
* 😊 Track spending mood
* 📝 Add transaction notes
* 📅 View transaction dates

Transactions are automatically reflected throughout the dashboard and analytics system.

---

# 📈 Financial Analytics

The Analytics section helps users understand their spending behaviour.

### Analytics includes:

* 📊 Category-based expense breakdown
* 📅 Weekly analysis
* 📆 Monthly analysis
* 🗓️ Yearly analysis
* 📉 Monthly expense trends
* 📈 Income vs Expense comparison
* 😊 Mood-based spending analysis
* 💡 Smart financial insights

The analytics dashboard transforms raw transactions into easy-to-understand visual information.

---

# 🎯 Savings Goals

Users can create and manage personalized savings goals.

### Goal management includes:

* 🎯 Create savings goals
* 💰 Set target amounts
* 📊 Track progress
* ➕ Deposit money
* ➖ Withdraw money
* 📅 Set deadlines
* ⭐ Set priorities
* 🗑️ Delete goals
* 🔄 Animated progress indicators

A dedicated aggregate progress view provides an overview of total savings progress.

---

# 📅 Financial Calendar

Budget Buddy includes a dedicated calendar view to help users understand their financial activity over time.

### Calendar features:

* 📅 Monthly calendar navigation
* 🟢 Income indicators
* 🔴 Expense indicators
* 👆 Tap a date to view transactions
* ⏮️ Previous month
* ⏭️ Next month
* 📍 Jump to today

This makes it easier to identify spending patterns and important financial activity on specific dates.

---

# 🏆 Achievements & Gamification

Budget Buddy encourages users to build better financial habits through a lightweight achievement system.

Users can unlock achievement badges based on their financial activity and progress.

This adds a motivational layer to traditional expense tracking.

---

# 📤 Data Export

Users can export their financial data for external use and record keeping.

Supported export options include:

* 📄 PDF Financial Reports
* 📊 CSV Data Export

On supported platforms, exported data can be downloaded or shared using the platform's native sharing capabilities.

---

# 🌙 Personalization & Settings

Budget Buddy supports a personalized user experience with:

* ☀️ Light Mode
* 🌙 Dark Mode
* 🌓 System Theme
* 💰 Monthly Budget Configuration
* 💱 Currency Settings
* 🔔 Notification Settings
* 🔐 PIN Lock UI
* 📅 Calendar Preferences
* 👤 Profile Management
* 📊 Financial Statistics
* 📤 Data Export
* 🔄 Reset Application Data

Theme preferences are persisted locally for a consistent experience.

---

# 🧠 Smart Financial Overview

Budget Buddy automatically calculates important financial metrics from user transactions.

The application dynamically tracks:

```text
Total Income
      ↓
Total Expenses
      ↓
Remaining Balance
      ↓
Savings
      ↓
Budget Utilization
      ↓
Spending Patterns
      ↓
Financial Insights
```

This gives users a real-time understanding of their financial position.

---

# 🛠️ Tech Stack

## Frontend

* **React Native**
* **Expo SDK 54**
* **TypeScript**
* **Expo Router**
* **React Native Reanimated**
* **React Native SVG**
* **Expo Linear Gradient**
* **Expo Vector Icons**
* **React Native Gifted Charts**
* **Gorhom Bottom Sheet**

## Voice Assistant

* **Expo Speech** — Text-to-Speech
* **Web Speech Recognition API** — Speech-to-Text on supported browsers
* **Custom Command Parser** — Interprets financial voice commands
* **Text Input Fallback** — Alternative interaction when speech recognition is unavailable

## State & Data

* **React Context**
* **AsyncStorage**
* Local-first data persistence

## Backend

* **Python**
* **FastAPI**
* **MongoDB integration scaffold**

> The current application primarily uses local storage for the core finance experience. The FastAPI/MongoDB layer is available as a backend scaffold for future cloud-based functionality.

## Deployment

* **Netlify** — Web deployment
* **Expo** — Development and testing
* **EAS Build** — Android APK builds

---

# 🏗️ Project Architecture

```text
Budget_Buddy
│
├── backend
│   ├── server.py
│   ├── requirements.txt
│   └── .env
│
├── frontend
│   │
│   ├── app
│   │   ├── onboarding.tsx
│   │   ├── login.tsx
│   │   ├── calendar.tsx
│   │   │
│   │   └── (tabs)
│   │       ├── index.tsx
│   │       ├── analytics.tsx
│   │       ├── goals.tsx
│   │       └── profile.tsx
│   │
│   ├── src
│   │   ├── components
│   │   │   ├── AddTransactionSheet.tsx
│   │   │   ├── BudgetRing.tsx
│   │   │   ├── CategoryTile.tsx
│   │   │   ├── CustomTabBar.tsx
│   │   │   ├── GoalCard.tsx
│   │   │   ├── TransactionRow.tsx
│   │   │   └── VoiceAssistant.tsx
│   │   │
│   │   ├── constants
│   │   ├── hooks
│   │   ├── store
│   │   ├── theme
│   │   ├── types
│   │   └── utils
│   │
│   ├── assets
│   ├── app.json
│   ├── eas.json
│   └── package.json
│
├── memory
│   └── PRD.md
│
├── tests
│
└── README.md
```

---

# ⚡ Getting Started

## Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Python 3
* Expo CLI / Expo tooling
* Git

For Android development:

* Android Studio
* Android SDK

---

# 📥 Clone the Repository

```bash
git clone https://github.com/BudgetBuddyLAB/Budget_Buddy_13.git

cd Budget_Buddy_13
```

---

# 🖥️ Run the Frontend

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

You can then open the application using:

* 📱 Expo Go
* 🤖 Android Emulator
* 🌐 Web Browser

---

# 🌐 Run the Web Application

```bash
cd frontend
npx expo start --web
```

Alternatively, create a production web export:

```bash
npx expo export --platform web
```

---

# 🐍 Run the FastAPI Backend

Navigate to the backend:

```bash
cd backend
```

Create and activate a virtual environment:

### macOS / Linux

```bash
python3 -m venv venv

source venv/bin/activate
```

### Windows

```bash
python -m venv venv

venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
python3 -m uvicorn server:app --reload --port 8001
```

The backend will be available at:

```text
http://127.0.0.1:8001
```

FastAPI interactive documentation:

```text
http://127.0.0.1:8001/docs
```

---

# 📱 Build Android APK

Install EAS CLI if required:

```bash
npm install -g eas-cli
```

Login to your Expo account:

```bash
eas login
```

Navigate to the frontend:

```bash
cd frontend
```

Build the Android application:

```bash
eas build --platform android
```

For local development and testing, Expo Go can also be used.

---

# 🔐 Environment Variables

If backend or external services require environment variables, configure them in the backend environment.

Example:

```env
MONGO_URL=your_mongodb_connection_string
DB_NAME=your_database_name
```

> Never commit real API keys, database credentials, or secrets to GitHub.

---

# 💾 Data Storage

Budget Buddy currently follows a **local-first architecture** for the core finance experience.

User data is persisted locally using:

```text
AsyncStorage
```

The application stores information such as:

* User profile
* Transactions
* Monthly budget
* Savings goals
* Theme preferences

This allows the application to work without requiring a cloud account for the core tracking experience.

---

# 🎙️ Voice Assistant Architecture

The Voice Assistant follows this general flow:

```text
User Speaks
     │
     ▼
Speech Recognition
     │
     ▼
Transcript
     │
     ▼
Command Parser
     │
     ├───────────────┐
     │               │
     ▼               ▼
Financial Action   Navigation
     │               │
     ▼               ▼
Update Store      Change Screen
     │
     ▼
Generate Response
     │
     ▼
Text-to-Speech
     │
     ▼
User Hears Response
```

Example:

```text
"Add expense 500 for food"
          │
          ▼
Detect Amount → ₹500
          │
          ▼
Detect Type → Expense
          │
          ▼
Detect Category → Food
          │
          ▼
Create Transaction
          │
          ▼
Update Dashboard
          │
          ▼
"Added expense of ₹500 for food."
```

---

# 🧪 Testing

The project contains testing and test-report directories for tracking application validation and development iterations.

Before creating a production build, it is recommended to test:

* Transaction creation
* Transaction editing
* Transaction deletion
* Budget calculations
* Savings goals
* Analytics calculations
* Calendar transactions
* Voice commands
* Text fallback commands
* Data persistence
* Theme switching
* Export functionality
* Web compatibility
* Android compatibility

---

# 🔮 Future Roadmap

Budget Buddy can be further enhanced with:

* 🤖 LLM-powered natural language financial assistant
* 🧠 AI-powered spending recommendations
* ☁️ Cloud synchronization
* 🔐 Secure authentication
* 👥 Multi-device account support
* 📊 Advanced financial forecasting
* 📈 AI-based expense prediction
* 🏦 Bank account integration
* 💳 Automatic transaction categorization
* 🔔 Real-time financial reminders
* 📱 Native Android/iOS speech recognition
* 🌍 Multi-currency support
* 🛡️ Biometric authentication
* 📤 Automated monthly financial reports

---

# 🎯 Project Highlights

| Feature                  | Status |
| ------------------------ | ------ |
| Expense Tracking         | ✅      |
| Income Tracking          | ✅      |
| Budget Management        | ✅      |
| Savings Goals            | ✅      |
| Transaction History      | ✅      |
| Analytics Dashboard      | ✅      |
| Financial Calendar       | ✅      |
| Voice Assistant          | ✅      |
| Text-to-Speech           | ✅      |
| Voice Command Processing | ✅      |
| Text Command Fallback    | ✅      |
| Dark Mode                | ✅      |
| Achievements             | ✅      |
| PDF Export               | ✅      |
| CSV Export               | ✅      |
| Cross-Platform UI        | ✅      |
| Android Build Support    | ✅      |
| Web Deployment           | ✅      |

---

# 👨‍💻 Developed By

### **Budget Buddy Team**

Built with ❤️ using **React Native, Expo, TypeScript, Python, and FastAPI**.

---

# ⭐ Support the Project

If you find **Budget Buddy** useful or interesting:

⭐ Star the repository
🍴 Fork the project
🐛 Report issues
💡 Suggest new features
🤝 Contribute to the project

---

## 📜 License

This project is available for educational and development purposes.

---

### 💰 Budget Buddy

> **Track Smart. Save Better.**
>
> *Your money. Your goals. Your control.*

