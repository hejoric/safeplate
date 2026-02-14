export default function EnergySlider({ value, onChange }) {
  const labels = ['🔋 Low', '🔋', '🔋', '🔋', '🔋 High']
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">Energy Level</span>
        <span className="label-text-alt">{labels[value - 1]} {value}/5</span>
      </label>
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="range range-primary range-sm"
      />
      <div className="flex justify-between text-xs px-2 mt-1">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  )
}
