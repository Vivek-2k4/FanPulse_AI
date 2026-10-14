# 🏏 FanPulse AI

### AI-Powered Cricket Insights for Every Fan

**FanPulse AI** is an AI-powered cricket analytics prototype that helps fans understand the pressure, possibilities, and tactical implications of a cricket match situation.

Instead of simply displaying a scorecard, FanPulse AI combines match statistics, hypothetical over simulation, and Gemini-generated analysis to explain what a situation means and what the batting team needs to do next.

🔗 **Live Demo:** [FanPulse AI](https://fan-pulse-ai-roan.vercel.app/)  
⚙️ **Backend API:** [FanPulse AI API](https://fanpulse-ai-api.onrender.com/)  
💻 **Source Code:** [GitHub Repository](https://github.com/Vivek-2k4/FanPulse_AI)

---

## 💡 The Problem

During a close cricket match, fans often see the score, wickets, and required run rate but may struggle to understand the pressure behind those numbers.

Questions like *"How difficult is this chase?", "What happens if the team scores 12 runs in the next over?"* and *"What should the batting team focus on?"* require more than a conventional scorecard.

## 🚀 The Solution

FanPulse AI turns cricket match statistics into understandable insights.

It combines a cricket match dashboard, a hypothetical scenario simulator, and an AI match analyst to help fans explore possible situations and understand their implications.

## ✨ Key Features

### 📊 Match Situation Dashboard
- Displays the current score, target, overs, and wickets.
- Calculates runs remaining, balls remaining, wickets remaining, and required run rate.
- Presents key match metrics in an easy-to-understand interface.

### 🤖 AI Match Analyst
- Uses Google's Gemini model to generate contextual cricket analysis.
- Explains the current match situation and pressure factors.
- Highlights practical takeaways and priorities for the next phase.
- Uses the supplied match data rather than inventing player statistics or match events.

### 🎯 Hypothetical Over Simulator
- Explore different possible over outcomes by selecting runs scored and wickets lost.
- Calculates the resulting score, remaining runs, balls remaining, and required run rate.
- Shows whether the hypothetical scenario continues the chase or ends the innings.
- Lets fans explore alternative possibilities without changing the underlying match state.

### 📈 Match Pressure Indicators
- Makes the chase easier to interpret through calculated match metrics.
- Includes a heuristic win-probability indicator as a visual estimate, not an official prediction.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, Vite |
| Styling | Tailwind CSS, custom CSS |
| Icons | Lucide React |
| AI Integration | Google Gemini API, `@google/genai` |
| Backend | Node.js, Express.js |
| API Communication | REST APIs |
| Deployment | Vercel (frontend), Render (backend) |

## 🏗️ Architecture

```text
                    ┌─────────────────────────┐
                    │       FanPulse AI       │
                    │    React + Vite UI      │
                    └────────────┬────────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌─────────────────────────┐
                    │    Express.js Backend   │
                    │                         │
                    │  Match Data & Metrics   │
                    │  Scenario Simulation    │
                    │  AI Insights Service    │
                    └───────┬─────────┬───────┘
                            │         │
                   ┌────────▼───┐ ┌───▼────────────┐
                   │ Scenario   │ │ Google Gemini │
                   │ Engine     │ │ API            │
                   └────────────┘ └────────────────┘
```

The frontend communicates with the Express backend through REST endpoints. The backend calculates match metrics, evaluates hypothetical scenarios, and calls Gemini when AI-generated analysis is requested.

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- A Google Gemini API key for AI-generated insights

### 1. Clone the repository

```bash
git clone https://github.com/Vivek-2k4/FanPulse_AI.git
cd FanPulse_AI
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3-flash-preview
```

Replace `your_gemini_api_key` with your own API key. Never commit the `.env` file or expose your API key in frontend code.

Start the backend:

```bash
npm run dev
```

The backend should run at `http://localhost:5000`.

Verify it by opening:

- Health check: `http://localhost:5000/api/health`
- Match data: `http://localhost:5000/api/match`

### 3. Set up the frontend

Open another terminal from the project root:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite, typically `http://localhost:5173`.

## 🔌 API Endpoints

The backend exposes the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Checks backend availability |
| `GET` | `/api/match` | Returns the current simulated match data and calculated metrics |
| `POST` | `/api/match/simulate` | Simulates a hypothetical over |
| `POST` | `/api/match/insights` | Generates AI-powered match analysis using Gemini |

### Example: Simulate an Over

**Request**

```http
POST /api/match/simulate
Content-Type: application/json
```

```json
{
  "runsScored": 12,
  "wicketsLost": 1
}
```

The backend evaluates the hypothetical over and returns the resulting match metrics without modifying the original match state.

### Example: Generate AI Insights

```http
POST /api/match/insights
Content-Type: application/json
```

The endpoint uses the current match context to request a concise analysis from Gemini and returns the generated insights alongside the model and match data used.

## 🌐 Deployment

The project is deployed as two services:

- **Frontend:** Vercel — [Open FanPulse AI](https://fan-pulse-ai-roan.vercel.app/)
- **Backend:** Render — [Open Backend API](https://fanpulse-ai-api.onrender.com/)

The frontend uses the `VITE_API_BASE_URL` environment variable to communicate with the deployed backend.

Configure `VITE_API_BASE_URL` in Vercel with your backend's base URL, without appending `/api`. Configure `GEMINI_API_KEY` and `GEMINI_MODEL` securely in Render.

## 🧪 Current Scope and Limitations

FanPulse AI is a working prototype built around **simulated cricket match data**.

- It does not currently consume a live cricket score feed.
- Match metrics are calculated from the supplied simulated match state.
- The win-probability indicator is heuristic-based and should not be interpreted as a statistically validated prediction.
- AI-generated analysis is based on the available match context and does not guarantee future match outcomes.

The prototype demonstrates how match data, interactive simulations, and generative AI can work together to make cricket situations easier for fans to understand.

## 🔮 Future Improvements

- Integrate a reliable, licensed live cricket data provider.
- Update match situations automatically as live scores change.
- Improve win-probability estimation using historical match data.
- Incorporate player-level statistics and contextual performance data.
- Personalize insights around the match situations fans care about most.

## 👨‍💻 Built With

Built as an exploration of how AI and interactive software can improve the experience of following cricket.

**FanPulse AI — More than a scorecard. Understand the game.**