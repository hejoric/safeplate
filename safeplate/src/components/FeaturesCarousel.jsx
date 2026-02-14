import { useState, useEffect, useRef } from 'react'

const FEATURES = [
  {
    id: 'pattern-awareness',
    title: 'Early pattern awareness',
    description: 'Entries are reviewed for signs that you may need additional support.',
  },
  {
    id: 'care-alerts',
    title: 'Care-centered alerts',
    description: 'When concerns appear, you get clear options to connect with support resources.',
  },
  {
    id: 'privacy',
    title: 'Private by default',
    description: 'Your journal remains yours, with focused safety features layered on top.',
  },
]

const ANIMATION_DURATION = 600 // ms
const AUTO_ADVANCE_INTERVAL = 8000 // ms
const MANUAL_INTERACTION_COOLDOWN = 3000 // ms before auto-advance resumes

export default function FeaturesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const lastInteractionRef = useRef(Date.now())

  // Auto-advance carousel, but respect cooldown after manual interaction
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceLastInteraction = Date.now() - lastInteractionRef.current
      // Only auto-advance if cooldown has passed
      if (timeSinceLastInteraction > MANUAL_INTERACTION_COOLDOWN) {
        advance()
      }
    }, AUTO_ADVANCE_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  const advance = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentIndex((prev) => (prev + 1) % FEATURES.length)
      setTimeout(() => setIsAnimating(false), ANIMATION_DURATION)
    }
  }

  const goToNext = () => {
    if (!isAnimating) {
      lastInteractionRef.current = Date.now()
      setIsAnimating(true)
      setCurrentIndex((prev) => (prev + 1) % FEATURES.length)
      setTimeout(() => setIsAnimating(false), ANIMATION_DURATION)
    }
  }

  const goToPrev = () => {
    if (!isAnimating) {
      lastInteractionRef.current = Date.now()
      setIsAnimating(true)
      setCurrentIndex((prev) => (prev - 1 + FEATURES.length) % FEATURES.length)
      setTimeout(() => setIsAnimating(false), ANIMATION_DURATION)
    }
  }

  const goToIndex = (idx) => {
    if (!isAnimating && idx !== currentIndex) {
      lastInteractionRef.current = Date.now()
      setIsAnimating(true)
      setCurrentIndex(idx)
      setTimeout(() => setIsAnimating(false), ANIMATION_DURATION)
    }
  }

  const current = FEATURES[currentIndex]

  return (
    <div className="w-full pt-1 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-8">
          {/* Carousel container */}
          <div className="w-full min-h-[300px] flex items-center justify-center relative overflow-hidden">
            {/* Slide content with swipe animation */}
            <div
              key={current.id}
              className="absolute inset-0 flex flex-col items-center justify-center px-8 animate-slide-in text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {current.title}
              </h2>
              <p className="text-lg text-yellow-50 max-w-2xl">
                {current.description}
              </p>
            </div>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center gap-6">
            {/* Prev button */}
            <button
              onClick={goToPrev}
              className={`w-12 h-12 rounded-full border-2 border-yellow-50 flex items-center justify-center transition-colors ${
                isAnimating ? 'cursor-not-allowed opacity-50' : 'hover:bg-yellow-50/10'
              }`}
              aria-label="Previous slide"
            >
              <svg
                className="w-5 h-5 text-yellow-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Slide indicators */}
            <div className="flex gap-3">
              {FEATURES.map((feature, idx) => (
                <button
                  key={feature.id}
                  onClick={() => goToIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'bg-yellow-50 w-8' : 'bg-yellow-50/40 w-2'
                  } ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={goToNext}
              className={`w-12 h-12 rounded-full border-2 border-yellow-50 flex items-center justify-center transition-colors ${
                isAnimating ? 'cursor-not-allowed opacity-50' : 'hover:bg-yellow-50/10'
              }`}
              aria-label="Next slide"
            >
              <svg
                className="w-5 h-5 text-yellow-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Swipe animation keyframes */}
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
