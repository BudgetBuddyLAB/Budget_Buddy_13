# 💰 Budget Buddy

Budget Buddy is a personal finance tracking app built using **React Native (Expo)** for frontend and **FastAPI** for backend. It helps users track income, expenses, savings goals, and monthly budgets in a simple and clean UI.

---

## 🚀 Live Demo

🌐 Web App: https://techtitans-budget-buddy.netlify.app/ 
📱 Mobile App: Available via Expo / APK build

---

## 🛠️ Tech Stack

- Frontend: React Native (Expo)
- Backend: FastAPI (Python)
- Database: AsyncStorage / Local Storage (or MongoDB if used)
- Deployment: Netlify (Web), EAS Build (Mobile APK)

---

## 📦 Features

- Add income and expenses
- Monthly budget tracking
- Savings goals
- Transaction history
- Dashboard summary
- Cross-platform (Android + Web)

---

## 🧑‍💻 How to Run Locally

### Backend
```bash
cd backend
source venv/bin/activate
python3 -m uvicorn server:app --reload --port 8001
Frontend
cd frontend
npm install
npx expo start
🌐 Web Version
cd frontend
npx expo export --platform web

📱 APK Build
Built using Expo EAS:

eas build --platform android