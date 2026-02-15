import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FeaturesCarousel from '../components/FeaturesCarousel'
import RotatingWordLoop from '../components/RotatingWordLoop'
import heroImage from '../assets/pexels-rdne-6414641.jpg'
import { getTodayFocusProgress } from '../utils/todayFocusProgress'

export default function Home() {
  const navigate = useNavigate()
  const [todayProgress, setTodayProgress] = useState(() => getTodayFocusProgress())

  const todayFocusSteps = [
    {
      id: 1,
      target: 'meal',
      text: 'Log one meal or snack, no judgment.',
    },
    {
      id: 2,
      target: 'mood-energy',
      text: 'Rate your mood and energy, then write one sentence about what helped.',
    },
  ]

  const handleFocusStep = (target) => {
    navigate('/journal', { state: { focusTarget: target } })
  }

  useEffect(() => {
    const refreshProgress = () => {
      setTodayProgress(getTodayFocusProgress())
    }

    refreshProgress()
    window.addEventListener('focus', refreshProgress)
    window.addEventListener('storage', refreshProgress)
    document.addEventListener('visibilitychange', refreshProgress)

    return () => {
      window.removeEventListener('focus', refreshProgress)
      window.removeEventListener('storage', refreshProgress)
      document.removeEventListener('visibilitychange', refreshProgress)
    }
  }, [])

  const completionByTarget = {
    meal: todayProgress.steps.meal,
    'mood-energy': todayProgress.steps.checkin,
  }

  const completedCount = Object.values(completionByTarget).filter(Boolean).length

  return (
    <div className="min-h-screen bg-base-100">
      <section
        className="relative min-h-[62vh] border-b border-base-200 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-neutral/65" aria-hidden="true" />
        <div className="relative px-4 py-14 md:py-20 min-h-[62vh] flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-10 md:mb-12">SafePlate</h1>
            <p className="text-3xl md:text-4xl text-white leading-tight">
              <span className="block font-normal text-2xl md:text-3xl">A calm place to track</span>
              <span className="block mt-2 text-white font-bold">
                <RotatingWordLoop words={['meals', 'mood', 'progress']} />
              </span>
            </p>
            <p className="mt-4 text-lg text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] max-w-2xl mx-auto">
              A simple daily check-in helps you notice patterns and care for yourself with clarity.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <Link to="/journal" className="btn btn-primary btn-lg text-lg px-7 py-3 h-auto">
                Open Journal
              </Link>
              <Link to="/resources" className="btn btn-outline btn-lg text-lg px-7 py-3 h-auto border-white/60 text-white hover:bg-white/10">
                View Support Resources
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Focus & CTA Side by Side */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-7">
            {/* Today's Focus */}
            <section className="rounded-[1.1rem] p-6 md:p-7 bg-base-200/85 border border-[rgba(210,190,150,0.18)] shadow-[0_14px_34px_-24px_rgba(0,0,0,0.72)] text-left">
              <header className="flex items-start justify-between gap-3">
                <h3 className="text-[1.32rem] md:text-[1.38rem] leading-[1.25] font-semibold text-base-content">Today&apos;s focus</h3>
                <span className="inline-flex items-center rounded-full border border-[rgba(210,190,150,0.35)] bg-[rgba(210,190,150,0.08)] px-3 py-1.5 text-[0.9rem] leading-none text-base-content/85">
                  Quick
                </span>
              </header>

              <p className="mt-[10px] text-[1.02rem] md:text-[1.06rem] leading-[1.62] text-base-content/85 max-w-[36ch]">
                Pick one small step. Calm progress is enough.
              </p>

              <ul className="mt-4 space-y-3.5" aria-label="Today&apos;s journal steps">
                {todayFocusSteps.map((step) => (
                  <li key={step.id}>
                    {(() => {
                      const isDone = completionByTarget[step.target]
                      return (
                    <button
                      type="button"
                      onClick={() => handleFocusStep(step.target)}
                      className={`w-full min-h-[48px] rounded-xl border px-3.5 py-3 text-left flex items-center gap-3 transition-colors active:bg-base-100/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/55 ${isDone ? 'border-primary/45 bg-primary/12 hover:bg-primary/18' : 'border-primary/20 bg-base-100/25 hover:bg-base-100/45'}`}
                    >
                      <span className={`h-7 w-7 shrink-0 rounded-full border text-[0.95rem] font-semibold text-base-content inline-flex items-center justify-center ${isDone ? 'border-primary/65 bg-primary/30' : 'border-primary/45 bg-primary/15'}`} aria-hidden="true">
                        {isDone ? '✓' : step.id}
                      </span>
                      <span className="flex-1 text-[1rem] leading-[1.5] text-base-content">{step.text}</span>
                      <span className="inline-flex items-center gap-1 text-[0.93rem] text-base-content/75">
                        {isDone ? 'Done' : 'Start'}
                        <span aria-hidden="true">›</span>
                      </span>
                    </button>
                      )
                    })()}
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-3 border-t border-[rgba(210,190,150,0.14)] flex items-center justify-between gap-3">
                <p className="text-[0.95rem] text-base-content/75">{completedCount} of 2 done today</p>
                <div className="flex items-center gap-2" aria-hidden="true">
                  <span className={`h-2.5 w-2.5 rounded-full border border-primary/45 ${todayProgress.steps.meal ? 'bg-primary/60' : 'bg-transparent'}`} />
                  <span className={`h-2.5 w-2.5 rounded-full border border-primary/45 ${todayProgress.steps.checkin ? 'bg-primary/60' : 'bg-transparent'}`} />
                </div>
              </div>
            </section>

            {/* Ready to Start CTA */}
            <div className="rounded-box p-7 md:p-9 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 text-center flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ready to start your journey?</h2>
              <p className="text-base md:text-lg text-base-content/70 mb-5 leading-relaxed">
                Take the first step toward mindful self-care. Your journal is waiting.
              </p>
              <div className="flex flex-col items-center gap-3 md:gap-4">
                <Link
                  to="/journal"
                  className="btn btn-primary btn-lg text-lg px-7 py-3 h-auto shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Start Your First Entry
                </Link>
                <p className="text-sm text-base-content/50">Free • Private • Safe</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with gradient background */}
      <section className="px-4 py-3 md:py-4 bg-gradient-to-b from-base-100 via-primary/5 to-base-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 items-center min-h-[500px]">
            {/* Left side - Title and Description */}
            <div className="md:col-span-2 flex flex-col justify-center h-full">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
                How SafePlate supports you
              </h2>
              <p className="text-lg md:text-xl text-base-content/60 leading-relaxed">
                Built with care, designed for your wellbeing
              </p>
            </div>

            {/* Right side - Carousel */}
            <div className="md:col-span-3">
              <FeaturesCarousel />
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
