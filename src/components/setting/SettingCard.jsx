
export default function SettingCard({ icon: Icon, name, onDelete}) {
  return (

    <div className="w-full bg-gray-100 h-10 flex justify-between rounded-lg p-3 text-xs mt-3">
      <div className="flex gap-3 items-center">
        <Icon className="w-4"/>
      <div>{name}</div>
      </div>
      <button onClick={onDelete}>🗑️</button>
    </div>
  )
}
