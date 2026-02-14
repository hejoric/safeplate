import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="hero min-h-[60vh] bg-gradient-to-b from-sage/20 to-base-100">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-darkgray">
              Recovery Is a Journey. We're Here to Keep It Safe.
            </h1>
            <p className="py-6 text-lg text-base-content/80">
              AI-powered wellness tracking with built-in safety monitoring. 
              Log your journey, get compassionate support, and stay protected.
            </p>
            <Link to="/journal" className="btn btn-primary btn-lg bg-sage border-sage hover:bg-sage/90">
              Start Your Journal
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-lg border border-base-200">
              <div className="card-body">
                <div className="text-4xl mb-2">🛡️</div>
                <h2 className="card-title">AI Safety Monitoring</h2>
                <p>Real-time detection of harmful content. We catch concerning patterns before they escalate.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-lg border border-base-200">
              <div className="card-body">
                <div className="text-4xl mb-2">💚</div>
                <h2 className="card-title">Compassionate Support</h2>
                <p>Gentle interventions when you need them. Personalized encouragement, never judgment.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-lg border border-base-200">
              <div className="card-body">
                <div className="text-4xl mb-2">🔒</div>
                <h2 className="card-title">Privacy First</h2>
                <p>Your journal stays private. Alerts only when critical. You're in control.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
