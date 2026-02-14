export default function MoodSlider({ value, onChange }) {
  const emojis = ['😞', '😟', '😐', '🙂', '😊']
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">Mood</span>
        <span className="label-text-alt">{emojis[value - 1]} {value}/5</span>
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
        {emojis.map((emoji, i) => (
          <span key={i}>{emoji}</span>
        ))}
      </div>
    </div>
  )
}
