import { ICONS, ICON_OPTIONS } from "@/constants/iconRegistry"

export default function IconPicker({ value, onChange, label = "아이콘" }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">
        {ICON_OPTIONS.map((opt) => {
          const Icon = ICONS[opt.key]
          const selected = value === opt.key
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onChange(opt.key)}
              className={`p-2 border rounded-lg w-10 h-10 flex items-center justify-center
                ${selected ? "bg-gray-200 border-gray-400" : "border-gray-200 hover:bg-gray-50"}`}
              aria-pressed={selected}
              title={opt.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
