import { useState, useEffect, useRef } from 'react'

const FEATURES = [
  {
    id: 'pattern-awareness',
    title: 'Early pattern awareness',
    description: 'Entries are reviewed for signs that you may need additional support.',
    icon: (
      <svg className="w-24 h-24 md:w-28 md:h-28 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'care-alerts',
    title: 'Care-centered alerts',
    description: 'When concerns appear, you get clear options to connect with support resources.',
    icon: (
      <svg className="w-24 h-24 md:w-28 md:h-28 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 'privacy',
    title: 'Private by default',
    description: 'Your journal remains yours, with focused safety features layered on top.',
    icon: (
      <svg className="w-24 h-24 md:w-28 md:h-28 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
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
          <div className="w-full min-h-[500px] md:min-h-[550px] flex items-center justify-center relative overflow-hidden">
            {/* Slide content with swipe animation */}
            <div
              key={current.id}
              className="absolute inset-0 flex flex-col items-center justify-center px-8 animate-slide-in text-center"
            >
              {/* Icon */}
              <div className="mb-8 md:mb-10 transform hover:scale-110 transition-transform duration-300">
                {current.icon}
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-5 md:mb-6 leading-tight">
                {current.title}
              </h2>
              <p className="text-xl md:text-2xl text-base-content/70 max-w-2xl leading-relaxed">
                {current.description}
              </p>
            </div>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center gap-6">
            {/* Prev button */}
            <button
              onClick={goToPrev}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-primary flex items-center justify-center transition-all ${
                isAnimating ? 'cursor-not-allowed opacity-50' : 'hover:bg-primary/10 hover:shadow-lg'
              }`}
              aria-label="Previous slide"
            >
              <svg
                className="w-6 h-6 md:w-7 md:h-7 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Slide indicators */}
            <div className="flex gap-3 md:gap-4">
              {FEATURES.map((feature, idx) => (
                <button
                  key={feature.id}
                  onClick={() => goToIndex(idx)}
                  className={`h-3 md:h-3.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'bg-primary w-10 md:w-12' : 'bg-base-content/30 w-3 md:w-3.5 hover:bg-base-content/50'
                  } ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={goToNext}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-primary flex items-center justify-center transition-all ${
                isAnimating ? 'cursor-not-allowed opacity-50' : 'hover:bg-primary/10 hover:shadow-lg'
              }`}
              aria-label="Next slide"
            >
              <svg
                className="w-6 h-6 md:w-7 md:h-7 text-primary"
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
