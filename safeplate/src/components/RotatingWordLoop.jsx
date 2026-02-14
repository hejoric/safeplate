const DEFAULT_WORDS = ['meals', 'mood', 'progress']

export default function RotatingWordLoop({ words = DEFAULT_WORDS }) {
  const safeWords = Array.isArray(words) && words.length > 0 ? words : DEFAULT_WORDS
  const longestWordLength = safeWords.reduce((max, currentWord) => {
    return Math.max(max, currentWord.length)
  }, 0)
  const widthInCh = Math.max(longestWordLength + 1, 8)
  const loopWords = [...safeWords, safeWords[0]]

  return (
    <span className="hero-word-loop" style={{ '--word-loop-width': `${widthInCh}ch` }}>
      <span
        className="hero-word-loop__viewport"
        tabIndex={0}
        aria-label={`Rotating words: ${safeWords.join(', ')}`}
      >
        <span className="hero-word-loop__track" aria-hidden="true">
          {loopWords.map((word, index) => (
            <span className="hero-word-loop__word" key={`${word}-${index}`}>
              {word}
            </span>
          ))}
        </span>
      </span>
    </span>
  )
}
