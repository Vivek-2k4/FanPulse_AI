import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  ChevronDown,
  CircleHelp,
  Clock3,
  Crosshair,
  Gauge,
  LoaderCircle,
  Radio,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react'
import './App.css'
import ReactMarkdown from 'react-markdown'

const API_BASE = 'http://localhost:5000/api'

const SECTION_IDS = ['overview', 'analytics', 'simulator']

function calculateWinProbability(match) {
  const balls = match.ballsRemaining
  const runs = match.runsRemaining
  const wickets = match.wicketsRemaining

  if (runs <= 0) return 100
  if (balls <= 0 || wickets <= 0) return 0

  const ballsUsed = Math.max(1, match.ballsCompleted)
  const currentRunRate = (match.score * 6) / ballsUsed
  const requiredRunRate = balls > 0 ? (runs * 6) / balls : 99

  const scoringFactor = (currentRunRate - requiredRunRate) * 3.5
  const wicketFactor = (wickets - 5) * 3
  const probability = 50 + scoringFactor + wicketFactor

  return Math.round(Math.min(95, Math.max(5, probability)))
}

function formatOvers(overs, balls) {
  return `${overs}.${balls}`
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  accent = 'green',
}) {
  return (
    <article className={`metric-card accent-${accent}`}>
      <div className="metric-top">
        <span>{label}</span>
        <div className="metric-icon">
          <Icon size={18} />
        </div>
      </div>

      <div className="metric-value">{value}</div>
      <div className="metric-detail">{detail}</div>
    </article>
  )
}

function App() {
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')
  const [runs, setRuns] = useState(12)
  const [wickets, setWickets] = useState(0)
  const [simulation, setSimulation] = useState(null)
  const [simLoading, setSimLoading] = useState(false)
  const [simError, setSimError] = useState('')
  const [activeSection, setActiveSection] = useState('overview')
  const [aiInsights, setAiInsights] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  async function fetchMatch() {
    setLoading(true)
    setApiError('')

    try {
      const response = await fetch(`${API_BASE}/match`)

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      const payload = await response.json()

      if (!payload.success) {
        throw new Error(payload.error || 'Unable to load match')
      }

      setMatch(payload.data)
    } catch {
      setApiError(
        'Unable to connect to the backend. Start the server on port 5000 and refresh.',
      )
    } finally {
      setLoading(false)
    }
  }

  // Fetch match data when the dashboard mounts.

  async function generateAIInsights() {
    setAiLoading(true)
    setAiError('')

    try {
      const response = await fetch(`${API_BASE}/match/insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const payload = await response.json()

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.error || 'Unable to generate AI insights.',
        )
      }

      setAiInsights(payload.data)
    } catch (error) {
      setAiError(
        error.message || 'Unable to connect to the AI analyst.',
      )
    } finally {
      setAiLoading(false)
    }
  }

  useEffect(() => {
    fetchMatch()
  }, [])

  // Keep the sidebar highlight synchronized with the visible section.
  useEffect(() => {
    let animationFrameId = null

    const updateActiveSection = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }

      animationFrameId = requestAnimationFrame(() => {
        const scrollPosition = window.scrollY
        const viewportHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight

        // If the user reaches the bottom, activate the last section.
        if (
          scrollPosition + viewportHeight >=
          documentHeight - 5
        ) {
          const lastSection = SECTION_IDS[SECTION_IDS.length - 1]
          const lastElement = document.getElementById(lastSection)

          if (lastElement) {
            setActiveSection(lastSection)
            return
          }
        }

        // Use a marker inside the viewport to determine the active section.
        const marker = viewportHeight * 0.35
        let currentSection = SECTION_IDS[0]

        for (const id of SECTION_IDS) {
          const section = document.getElementById(id)

          if (
            section &&
            section.getBoundingClientRect().top <= marker
          ) {
            currentSection = id
          }
        }

        setActiveSection((previous) =>
          previous === currentSection ? previous : currentSection,
        )
      })
    }

    // Listen for normal page scrolling.
    window.addEventListener('scroll', updateActiveSection, {
      passive: true,
    })

    // Also handle viewport resizing and initial page position.
    window.addEventListener('resize', updateActiveSection)
    updateActiveSection()

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  const winProbability = useMemo(
    () => (match ? calculateWinProbability(match) : 0),
    [match],
  )

  const requiredRate = match?.requiredRunRate ?? 0

  const currentRate =
    match && match.ballsCompleted > 0
      ? (match.score * 6) / match.ballsCompleted
      : 0

  const projectedScore = match
    ? Math.round(
        match.score + (currentRate * match.ballsRemaining) / 6,
      )
    : 0

  async function simulateScenario(event) {
    event.preventDefault()
    setSimLoading(true)
    setSimError('')
    setSimulation(null)

    try {
      const response = await fetch(`${API_BASE}/match/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          runsScored: Number(runs),
          wicketsLost: Number(wickets),
        }),
      })

      const payload = await response.json()

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Simulation failed')
      }

      setSimulation(payload.data.result)
    } catch (error) {
      setSimError(
        error.message || 'Unable to simulate this scenario.',
      )
    } finally {
      setSimLoading(false)
    }
  }

  const insights = match
    ? [
        {
          icon: Gauge,
          title: 'Required scoring rate',
          text:
            requiredRate > currentRate
              ? `India needs ${requiredRate.toFixed(2)} runs per over, above its current rate of ${currentRate.toFixed(2)}.`
              : 'India is currently scoring at or above the required rate.',
          type: requiredRate > currentRate ? 'warning' : 'positive',
        },
        {
          icon: Shield,
          title: 'Wickets in hand',
          text: `${match.wicketsRemaining} wickets remain. Preserving wickets could help India accelerate in the final overs.`,
          type: 'neutral',
        },
        {
          icon: Target,
          title: 'Projected finish',
          text: `At the current scoring rate, India would finish around ${projectedScore} runs.`,
          type: 'neutral',
        },
      ]
    : []

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#overview"
          aria-label="FanPulse AI home"
          onClick={() => setActiveSection('overview')}
        >
          <div className="brand-mark">
            <Activity size={23} strokeWidth={2.5} />
          </div>

          <div>
            <div className="brand-name">
              FanPulse<span>AI</span>
            </div>
            <div className="brand-caption">CRICKET INTELLIGENCE</div>
          </div>
        </a>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="side-nav">
          <a
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            href="#overview"
            onClick={() => setActiveSection('overview')}
          >
            <Activity size={18} />
            Match center
          </a>

          <a
            className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
            href="#analytics"
            onClick={() => setActiveSection('analytics')}
          >
            <TrendingUp size={18} />
            Analytics
          </a>

          <a
            className={`nav-item ${activeSection === 'simulator' ? 'active' : ''}`}
            href="#simulator"
            onClick={() => setActiveSection('simulator')}
          >
            <Crosshair size={18} />
            Scenario lab
          </a>
        </nav>

        <div className="sidebar-label competition-label">
          COMPETITION
        </div>

        <div className="competition-card">
          <div className="competition-icon">🏏</div>

          <div>
            <div className="competition-name">
              International T20
            </div>
            <div className="competition-sub">
              India vs Australia
            </div>
          </div>

          <span className="competition-dot" />
        </div>

        <div className="sidebar-bottom">
          <div className="status-row">
            <span className="status-dot" />
            <span>Analytics engine ready</span>
          </div>

          <div className="profile">
            <div className="avatar">FP</div>

            <div className="profile-copy">
              <strong>FanPulse Analyst</strong>
              <span>Demo workspace</span>
            </div>

            <ChevronDown size={16} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="breadcrumb">
              Workspace <span>/</span> Match center
            </div>

            <h1>Match intelligence</h1>

            <p className="page-subtitle">
              Real-time match context. Smarter scenario analysis.
            </p>
          </div>

          <div className="topbar-actions">
            <div className="system-status">
              <span className="status-dot" />
              SIMULATION MODE
            </div>

            <button
              className="icon-button"
              onClick={fetchMatch}
              disabled={loading}
              aria-label="Refresh match"
              title="Refresh match data"
            >
              <RefreshCw
                size={17}
                className={loading ? 'spin' : ''}
              />
            </button>
          </div>
        </header>

        {apiError && (
          <div className="error-banner" role="alert">
            <CircleHelp size={19} />

            <div>
              <strong>Backend connection needed</strong>
              <p>{apiError}</p>
            </div>

            <button
              className="button-secondary"
              onClick={fetchMatch}
            >
              Retry
            </button>
          </div>
        )}

        {loading && !match ? (
          <div className="loading-state">
            <LoaderCircle size={28} className="spin" />
            <span>Loading match intelligence...</span>
          </div>
        ) : match ? (
          <>
            <section className="match-hero" id="overview">
              <div className="hero-topline">
                <div className="match-label">
                  <span className="live-indicator" />
                  {match.status} <span className="label-divider">/</span>{' '}
                  {match.format} INTERNATIONAL
                </div>

                <div className="match-id">
                  MATCH ID: {match.id}
                </div>
              </div>

              <div className="teams-scoreboard">
                <div className="team-block">
                  <div className="team-flag india-flag">
                    <span>🇮🇳</span>
                  </div>

                  <div className="team-name">India</div>
                  <div className="team-role">BATTING</div>
                </div>

                <div className="score-block">
                  <div className="score-main">
                    {match.score}
                    <span>/{match.wickets}</span>
                  </div>

                  <div className="overs-label">
                    OVERS{' '}
                    {formatOvers(
                      match.oversCompleted,
                      match.ballsInCurrentOver,
                    )}
                  </div>

                  <div className="score-divider">
                    <span />
                    <span className="versus">VS</span>
                    <span />
                  </div>

                  <div className="target-line">
                    Target <strong>{match.target}</strong>
                  </div>
                </div>

                <div className="team-block opponent">
                  <div className="team-flag australia-flag">
                    <span>🇦🇺</span>
                  </div>

                  <div className="team-name">Australia</div>
                  <div className="team-role">BOWLING</div>
                </div>
              </div>

              <div className="match-footer">
                <div>
                  <Clock3 size={15} />
                  <span>
                    {match.ballsRemaining} balls remaining
                  </span>
                </div>

                <div className="footer-separator" />

                <div>
                  <Target size={15} />
                  <span>
                    {match.runsRemaining} runs to win
                  </span>
                </div>

                <div className="footer-separator" />

                <div>
                  <Radio size={15} />
                  <span>Demo match data</span>
                </div>
              </div>
            </section>

            <section
              className="section-block"
              id="analytics"
            >
              <div className="section-heading">
                <div>
                  <div className="eyebrow">MATCH SNAPSHOT</div>
                  <h2>At a glance</h2>
                </div>

                <span className="section-note">
                  Calculated from current match state
                </span>
              </div>

              <div className="metrics-grid">
                <MetricCard
                  label="Required run rate"
                  value={requiredRate.toFixed(2)}
                  detail="Runs per over needed"
                  icon={Gauge}
                  accent="orange"
                />

                <MetricCard
                  label="Current run rate"
                  value={currentRate.toFixed(2)}
                  detail="Runs per over scored"
                  icon={Activity}
                  accent="blue"
                />

                <MetricCard
                  label="Runs remaining"
                  value={match.runsRemaining}
                  detail={`${match.ballsRemaining} balls to chase`}
                  icon={Target}
                  accent="purple"
                />

                <MetricCard
                  label="Projected total"
                  value={projectedScore}
                  detail="At current scoring rate"
                  icon={TrendingUp}
                  accent="green"
                />
              </div>
            </section>

            <div className="dashboard-grid">
              <section className="panel probability-panel">
                <div className="panel-heading">
                  <div>
                    <div className="eyebrow">
                      OUTCOME ESTIMATE
                    </div>
                    <h2>Win probability</h2>
                  </div>

                  <div className="heading-icon">
                    <BrainCircuit size={20} />
                  </div>
                </div>

                <div className="probability-display">
                  <div
                    className="probability-ring"
                    style={{
                      '--probability': `${winProbability}%`,
                    }}
                  >
                    <div className="probability-inner">
                      <span className="probability-number">
                        {winProbability}%
                      </span>
                      <span className="probability-caption">
                        INDIA
                      </span>
                    </div>
                  </div>

                  <div className="probability-summary">
                    <div className="probability-team">
                      <span className="mini-flag">🇮🇳</span>
                      <strong>India</strong>
                      <span>{winProbability}%</span>
                    </div>

                    <div className="probability-bar">
                      <span
                        style={{ width: `${winProbability}%` }}
                      />
                    </div>

                    <div className="probability-team australia-probability">
                      <span className="mini-flag">🇦🇺</span>
                      <strong>Australia</strong>
                      <span>{100 - winProbability}%</span>
                    </div>

                    <div className="probability-bar australia-bar">
                      <span
                        style={{
                          width: `${100 - winProbability}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="model-notice">
                  <Sparkles size={16} />
                  <p>
                    <strong>Heuristic estimate.</strong> This is a
                    simple illustrative calculation, not a trained
                    or historically validated prediction model.
                  </p>
                </div>
              </section>

              <section className="panel insights-panel">
                <div className="panel-heading">
                  <div>
                    <div className="eyebrow">
                      RULE-BASED ANALYSIS
                    </div>
                    <h2>Match insights</h2>
                  </div>

                  <div className="heading-icon">
                    <Zap size={20} />
                  </div>
                </div>

                <div className="insight-list">
                  {insights.map((insight) => {
                    const Icon = insight.icon

                    return (
                      <article
                        className="insight-item"
                        key={insight.title}
                      >
                        <div
                          className={`insight-icon insight-${insight.type}`}
                        >
                          <Icon size={17} />
                        </div>

                        <div className="insight-copy">
                          <h3>{insight.title}</h3>
                          <p>{insight.text}</p>
                        </div>

                        {insight.type === 'positive' ? (
                          <ArrowUpRight
                            size={17}
                            className="insight-arrow"
                          />
                        ) : insight.type === 'warning' ? (
                          <ArrowDownRight
                            size={17}
                            className="insight-arrow"
                          />
                        ) : null}
                      </article>
                    )
                  })}
                </div>

                <div className="insight-footnote">
                  <CircleHelp size={14} />
                  <span>
                    Insights update when match data is refreshed.
                  </span>
                </div>
              </section>

              <section className="panel ai-analyst-panel">
                <div className="panel-heading">
                  <div>
                    <div className="eyebrow">POWERED BY GEMINI</div>
                    <h2>AI Match Analyst</h2>
                  </div>

                  <div className="heading-icon">
                    <BrainCircuit size={20} />
                  </div>
                </div>

                <p className="ai-analyst-description">
                  Get an AI-generated breakdown of the match situation,
                  scoring pressure, and the next phase of the chase.
                </p>

                <button
                  type="button"
                  className="simulate-button ai-generate-button"
                  onClick={generateAIInsights}
                  disabled={aiLoading || loading || !match}
                >
                  {aiLoading ? (
                    <LoaderCircle size={17} className="spin" />
                  ) : (
                    <Sparkles size={17} />
                  )}

                  {aiLoading
                    ? 'Analyzing match...'
                    : aiInsights
                      ? 'Refresh AI analysis'
                      : 'Generate AI insights'}
                </button>

                {aiError && (
                  <div className="simulation-error" role="alert">
                    {aiError}
                  </div>
                )}

                {aiLoading && !aiInsights && (
                  <div className="ai-loading-state" role="status">
                    <LoaderCircle size={20} className="spin" />

                    <div>
                      <strong>Analyzing match conditions</strong>
                      <p>Gemini is preparing your cricket insights...</p>
                    </div>
                  </div>
                )}

                {aiInsights && (
                  <div className="ai-analysis-result">
                    <div className="ai-analysis-meta">
                      <span>
                        <span className="status-dot" />
                        Analysis generated
                      </span>

                      <span>{aiInsights.model}</span>
                    </div>

                    <div className="ai-analysis-text">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1>{children}</h1>,
                          h2: ({ children }) => <h2>{children}</h2>,
                          h3: ({ children }) => <h3>{children}</h3>,
                          p: ({ children }) => <p>{children}</p>,
                          strong: ({ children }) => <strong>{children}</strong>,
                          em: ({ children }) => <em>{children}</em>,
                          ul: ({ children }) => <ul>{children}</ul>,
                          ol: ({ children }) => <ol>{children}</ol>,
                          li: ({ children }) => <li>{children}</li>,
                        }}
                      >
                        {aiInsights.insights}
                      </ReactMarkdown>
                    </div>

                    <div className="ai-analysis-footer">
                      <Sparkles size={15} />

                      <span>
                        AI-generated analysis based on the supplied match data.
                        This is not a guaranteed prediction of the outcome.
                      </span>
                    </div>
                  </div>
                )}
              </section>

            </div>

            <section
              className="panel simulator-panel"
              id="simulator"
            >
              <div className="simulator-heading">
                <div>
                  <div className="eyebrow">
                    WHAT-IF ANALYSIS
                  </div>
                  <h2>Scenario lab</h2>
                  <p>
                    Explore how a hypothetical over could change
                    the chase.
                  </p>
                </div>

                <div className="simulator-badge">
                  <Crosshair size={15} /> OVER SIMULATOR
                </div>
              </div>

              <form
                onSubmit={simulateScenario}
                className="simulator-form"
              >
                <div className="input-group">
                  <label htmlFor="runs">
                    Runs scored in next over
                  </label>

                  <div className="range-value">
                    {runs} <span>runs</span>
                  </div>

                  <input
                    id="runs"
                    type="range"
                    min="0"
                    max="36"
                    step="1"
                    value={runs}
                    onChange={(event) =>
                      setRuns(Number(event.target.value))
                    }
                    className="runs-range"
                  />

                  <div className="range-labels">
                    <span>0 runs</span>
                    <span>36 runs</span>
                  </div>
                </div>

                <div className="input-group wicket-group">
                  <label htmlFor="wickets">
                    Wickets lost in next over
                  </label>

                  <div className="wicket-options">
                    {[0, 1, 2, 3, 4, 5, 6].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`wicket-option ${
                          wickets === value ? 'selected' : ''
                        }`}
                        onClick={() => setWickets(value)}
                        aria-pressed={wickets === value}
                      >
                        {value}
                      </button>
                    ))}
                  </div>

                  <div className="field-hint">
                    Select wickets lost during the over.
                  </div>
                </div>

                <button
                  type="submit"
                  className="simulate-button"
                  disabled={simLoading}
                >
                  {simLoading ? (
                    <LoaderCircle size={17} className="spin" />
                  ) : (
                    <Zap size={17} />
                  )}

                  {simLoading
                    ? 'Simulating...'
                    : 'Simulate scenario'}
                </button>
              </form>

              {simError && (
                <div
                  className="simulation-error"
                  role="alert"
                >
                  {simError}
                </div>
              )}

              {simulation && (
                <div className="simulation-result">
                  <div className="result-heading">
                    <div className="result-success">
                      <Trophy size={19} />
                    </div>

                    <div>
                      <h3>Scenario result</h3>
                      <p>{simulation.result}</p>
                    </div>
                  </div>

                  <div className="result-metrics">
                    <div>
                      <span>New score</span>
                      <strong>
                        {simulation.score}/{simulation.wickets}
                      </strong>
                    </div>

                    <div>
                      <span>Overs completed</span>
                      <strong>
                        {formatOvers(
                          simulation.oversCompleted,
                          simulation.ballsInCurrentOver,
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Runs to win</span>
                      <strong>{simulation.runsRemaining}</strong>
                    </div>

                    <div>
                      <span>Balls remaining</span>
                      <strong>{simulation.ballsRemaining}</strong>
                    </div>

                    <div>
                      <span>New required rate</span>
                      <strong>
                        {simulation.requiredRunRate == null
                          ? '—'
                          : simulation.requiredRunRate.toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  <p className="simulation-disclaimer">
                    This result is hypothetical and does not change
                    the underlying match data.
                  </p>
                </div>
              )}
            </section>

            <footer className="page-footer">
              <div className="footer-brand">
                <Activity size={16} /> FanPulse AI
              </div>

              <span>
                Cricket intelligence, made actionable.
              </span>

              <span className="footer-mode">
                DEMO ENVIRONMENT
              </span>
            </footer>
          </>
        ) : null}
      </main>
    </div>
  )
}

export default App