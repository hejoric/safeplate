export default function EnergySlider({ value, onChange, disabled = false }) {
  const levels = ['🪫', '🔋', '🔋', '🔋', '⚡']

  return (
    <fieldset className="form-control gap-[1.1rem]">
      <legend className="flex items-center justify-between gap-3 w-full">
        <label htmlFor="energy-range" className="label-text text-[1.15rem] md:text-[1.2rem] font-semibold text-base-content">Energy</label>
        <span className="rounded-full bg-primary/20 text-base-content text-[1.08rem] font-semibold px-4 py-2 min-h-[2.5rem] inline-flex items-center">
          {value} of 5
        </span>
      </legend>

      <div className="grid grid-cols-[58px_minmax(0,1fr)_58px] items-center gap-3">
        <span className="text-[0.99rem] text-base-content/75">Low</span>
        <input
          id="energy-range"
          type="range"
          min="1"
          max="5"
          step="1"
          value={value}
          disabled={disabled}
          aria-label={`Energy ${value} of 5`}
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={value}
          aria-valuetext={`Energy ${value} of 5`}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="sp-range w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        />
        <span className="text-[0.99rem] text-base-content/75 text-right">High</span>
      </div>

      <div className="grid grid-cols-[58px_minmax(0,1fr)_58px] items-center gap-3">
        <span aria-hidden="true" />
        <div className="flex items-center justify-between" role="radiogroup" aria-label="Energy rating options">
          {levels.map((icon, index) => {
            const rating = index + 1
            const isSelected = value === rating

            return (
              <button
                key={`${icon}-${rating}`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`Set energy to ${rating} of 5`}
                disabled={disabled}
                onClick={() => onChange(rating)}
                className={`h-[var(--sp-rating-target)] w-[var(--sp-rating-target)] rounded-xl text-[2.05rem] md:text-[2.2rem] leading-none border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                  isSelected ? 'bg-primary/20 border-primary/50 ring-1 ring-primary/40' : 'bg-transparent border-transparent hover:border-primary/30 hover:bg-primary/10'
                }`}
              >
                <span aria-hidden="true">{icon}</span>
              </button>
            )
          })}
        </div>
        <span aria-hidden="true" />
      </div>
    </fieldset>
  )
}
