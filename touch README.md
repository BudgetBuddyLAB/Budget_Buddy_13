# 💰 Budget Buddy

A full-stack personal finance tracker built with:

- Frontend: React Native (Expo)
- Backend: FastAPI (Python)
- Database: MongoDB (Motor Async Driver)
- Storage (offline fallback): AsyncStorage

---

## 🚀 Features

- Track income & expenses
- Monthly budget overview
- Savings goals
- Transaction history
- Offline-first data storage
- Cross-platform (Web / Mobile)

---

## 🧠 Project Structure
budget_buddy-main/
│
├── backend/
│ ├── server.py
│ ├── requirements.txt
│ └── venv/
│
├── frontend/
│ ├── app/
│ ├── src/
│ ├── package.json
│ └── app.json
│
└── README.md

---

## ⚙️ Backend Setup (FastAPI)

### Install dependencies

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

Run server
python3 -m uvicorn server:app --reload --port 8001
Backend runs at:

http://localhost:8001
📱 Frontend Setup (Expo)
Install dependencies
cd frontend
npm install
Start app
npx expo start
Then press:

w → Web

a → Android

i → iOS

🔌 API Endpoints
Method	Endpoint	Description
GET	/api/	Health check
POST	/api/status	Create status entry
GET	/api/status	Get status entries
🧪 Environment Variables
Create a .env file in backend:

MONGO_URL=your_mongodb_connection_string
DB_NAME=budget_buddy
👨‍💻 Run Summary
cd backend
source venv/bin/activate
uvicorn server:app --reload --port 8001
Frontend
cd frontend
npx expo start

---

# If you want next upgrade

I can also help you:
- connect frontend → backend (real MongoDB sync)
- deploy backend online (Render / Railway)
- deploy Expo web build
- add login system

Just tell me 👍