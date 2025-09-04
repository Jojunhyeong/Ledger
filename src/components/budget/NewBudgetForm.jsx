import { X } from "lucide-react"
import IconPicker from "@/components/common/IconPicker"
import { useBudgetStore } from "@/store/useBudgetStore"
import { useCategoryStore } from "@/store/useCategoryStore"
import { useEffect, useState } from "react"

export default function NewBudgetForm({ open, onClose }) {
  const addBudget = useBudgetStore((s) => s.addBudget)
  const { items: categories, fetchAll } = useCategoryStore()

  const [mode, setMode] = useState("existing") // 'existing' | 'new'
  const [categoryId, setCategoryId] = useState("")
  const [name, setName] = useState("")
  const [iconKey, setIconKey] = useState("")
  const [limitAmount, setLimitAmount] = useState(0)

  useEffect(() => { fetchAll() }, [fetchAll])
  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (mode === "existing") {
      if (!categoryId) return alert("카테고리를 선택하세요.")
      try {
        await addBudget({ categoryId, limit_amount: limitAmount })
        resetAndClose()
      } catch (e) { alert(e.message) }
      return
    }

    // mode === 'new'
    if (!name.trim() || !iconKey) return alert("이름/아이콘을 선택하세요.")
    try {
      await addBudget({ name: name.trim(), icon_key: iconKey, limit_amount: limitAmount })
      resetAndClose()
    } catch (e) { alert(e.message) }
  }

  const resetAndClose = () => {
    setMode("existing"); setCategoryId(""); setName(""); setIconKey(""); setLimitAmount(0)
    onClose?.()
  }

  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                    bg-white w-96 rounded-xl shadow-xl">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute right-2 top-2 p-3 rounded hover:bg-gray-100"
      >
        <X size={18} />
      </button>

      <form onSubmit={handleSubmit} className="flex flex-col p-5 gap-4">
        <div className="text-lg font-semibold">새 예산 추가</div>

        {/* 모드 선택 */}
        <div className="flex gap-2">
          <button type="button"
            onClick={() => setMode("existing")}
            className={`px-3 py-1 rounded border ${mode === "existing" ? "bg-gray-200" : ""}`}>
            기존 카테고리
          </button>
          <button type="button"
            onClick={() => setMode("new")}
            className={`px-3 py-1 rounded border ${mode === "new" ? "bg-gray-200" : ""}`}>
            새 카테고리
          </button>
        </div>

        {mode === "existing" ? (
          <div className="flex flex-col gap-1">
            <label className="text-sm">카테고리</label>
            <select
              className="border rounded p-2"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">선택하세요</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm">아이콘</label>
              <IconPicker value={iconKey} onChange={setIconKey} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm">카테고리 이름</label>
              <input
                className="border rounded p-2"
                placeholder="예: 식비"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm">예산 금액</label>
          <input
            type="text"
            className="border rounded p-2"
            value={limitAmount}
            onChange={(e) => setLimitAmount(Number(e.target.value || 0))}
            min={0}
          />
        </div>

        <button className="mt-2 h-10 rounded-md bg-black text-white">추가</button>
      </form>
    </div>
  )
}
