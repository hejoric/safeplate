# SafePlate – Local Setup for Teammates

## 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd PatriotHack26
```

## 2. Create the API key file (required for backend)

**Create a file** `backend/.env` with this content (replace `YOUR_KEY_HERE` with the key shared by your teammate):

```
GEMINI_API_KEY=YOUR_KEY_HERE
DATABASE_URL=sqlite:///./safeplate.db
```

**Important:** The `.env` file is in `.gitignore` – it will NOT be committed. Never put your API key in any file that gets pushed to GitHub.

## 3. Run the app

**Terminal 1 – Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Terminal 2 – Frontend:**
```bash
cd safeplate
npm install
npm run dev
```

## 4. Open the app
- App: http://localhost:5173
- API docs: http://localhost:8000/docs

---

## Sharing the API key with teammates

Share the key via **private** channels only (Slack DM, Discord DM, in person). Do NOT put it in the repo, README, or public chat.
