
# 💰 Budget Buddy

### **Track Smart. Save Better.**

> A modern **personal finance management app** built with **React Native + Expo**, designed to help you track expenses, manage budgets, achieve savings goals, and understand your financial habits — all in one place.

🎙️ **The standout feature:** Interact with your finances using the built-in **Voice Assistant**.

> 🎤 *"Add expense £500 for food"*
> 🧮 *"How much have I spent this month?"*
> 💳 *"What's my remaining budget?"*
> 🧭 *"Open analytics"*

---

## 🌐 Live Demo

🖥️ **Web App:** (techtitans-budget-buddy.netlify.app)

📱 **Mobile:** Expo / Android APK


## ✨ Core Features

* 🎙️ **Voice Assistant** — Manage finances, check spending, and navigate using voice
* 💸 **Expense & Income Tracking** — Record and manage transactions effortlessly
* 📊 **Smart Dashboard** — Get a real-time overview of your financial health
* 📈 **Financial Analytics** — Visualise spending, income, and financial trends
* 🎯 **Savings Goals** — Set targets and monitor your progress
* 🗓️ **Financial Calendar** — Explore your income and expenses by date
* 🏅 **Achievements** — Build better financial habits through gamification
* 📤 **Data Export** — Export financial records as PDF or CSV
* 🌓 **Dark & Light Mode** — Personalise your experience
* 💾 **Local-First Storage** — Keep your core financial data available locally
* 📱 **Cross-Platform** — Built for Web and Android

---

## 🎙️ Voice Assistant

Budget Buddy makes personal finance management faster and more intuitive with **voice-powered interactions**.

```text
🎤 "Add expense 500 for food"
              ↓
💸  Expense Added

🎤 "How much did I spend this month?"
              ↓
📊  Spending Summary

🎤 "Open analytics"
              ↓
📈  Analytics Dashboard
```

### ⚡ Voice Capabilities

🎤 **Speech Recognition**
🧠 **Command Processing**
💸 **Financial Actions**
🔊 **Text-to-Speech Responses**
⌨️ **Text Input Fallback**
🧭 **Voice Navigation**

---

## 🛠️ Tech Stack

### ⚛️ Frontend

* React Native
* Expo SDK 54
* TypeScript
* Expo Router
* React Native Reanimated

### 🎙️ Voice Technology

* Expo Speech
* Web Speech Recognition API
* Custom Voice Command Parser

### 💾 Data & State

* React Context
* AsyncStorage

### ⚙️ Backend

* Python
* FastAPI
* MongoDB Integration Scaffold

### ☁️ Deployment

* Netlify
* Expo
* EAS Build

---

## 🚀 Getting Started

### 📥 1. Clone the Repository

```bash
git clone https://github.com/BudgetBuddyLAB/Budget_Buddy_13.git
cd Budget_Buddy_13
```

### ⚛️ 2. Start the Frontend

```bash
cd frontend
npm install
npx expo start
```

### 🖥️ 3. Run on Web

```bash
npx expo start --web
```

### 🐍 4. Start the Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn server:app --reload --port 8001
```

### 📦 5. Build Android APK

```bash
eas build --platform android
```

---

## 🏗️ Application Architecture

```text
                         👤 USER
                            │
                            ▼
                    🎙️ VOICE ASSISTANT
                            │
                            ▼
                 ⚛️ REACT NATIVE + EXPO
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
     📊 Dashboard     💳 Transactions    🎯 Goals
          │                 │                 │
          └─────────────────┼─────────────────┘
                            ▼
                    📈 Analytics
                            │
                            ▼
                    💾 Local Storage
                            │
                            ▼
                     ⚙️ FastAPI API
```

---

## 🔮 Future Roadmap

🤖 **AI-powered financial insights**
🧠 **Smart spending recommendations**
☁️ **Cloud synchronisation**
🔐 **Secure authentication**
📈 **AI-based expense prediction**
🏦 **Bank account integration**
🔔 **Smart financial reminders**

---

## 👨‍💻 Built With ❤️

### **Budget Buddy Team**

> 💰 **Your Money. Your Goals. Your Control.**

⭐ **Star the repository if you like the project!**
🍴 **Fork it. Build on it. Make it better.**

