import { Link } from 'react-router-dom'
import FeaturesCarousel from '../components/FeaturesCarousel'
import RotatingWordLoop from '../components/RotatingWordLoop'
import heroImage from '../assets/pexels-rdne-6414641.jpg'

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      <section
        className="relative min-h-[72vh] border-b border-base-200 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-neutral/65" aria-hidden="true" />
        <div className="relative px-4 py-16 md:py-24 min-h-[72vh] flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80 mb-3">SafePlate</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              <span className="block">A calm place to track</span>
              <span className="block mt-2 text-secondary-content">
                <RotatingWordLoop words={['meals', 'mood', 'progress']} />
              </span>
            </h1>
            <p className="mt-5 text-lg text-white/90 max-w-2xl mx-auto">
              A simple daily check-in helps you notice patterns and care for yourself with clarity.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link to="/journal" className="btn btn-primary btn-lg">
                Open Journal
              </Link>
              <Link to="/resources" className="btn btn-outline btn-lg border-white/60 text-white hover:bg-white/10">
                View Support Resources
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="w-full max-w-2xl mx-auto border-2 border-primary/40 rounded-box p-8 md:p-10 bg-base-300 text-center">
            <h2 className="text-xl font-bold mb-3">Today’s focus</h2>
            <p className="text-base text-base-content/80 mb-6">
              Start with one small step. Calm, steady progress is enough.
            </p>
            <ul className="space-y-4 text-base-content leading-relaxed">
              <li>• Record one meal or snack without judgment.</li>
              <li>• Check in on mood and energy.</li>
              <li>• Write one sentence about what helped today.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-1 text-center">How SafePlate supports you</h2>
          <FeaturesCarousel />
        </div>
      </section>
    </div>
  )
}
