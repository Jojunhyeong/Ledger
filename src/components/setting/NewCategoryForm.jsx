import { X } from 'lucide-react'
import IconPicker from '@/components/common/IconPicker'
import { useCategoryStore } from '@/store/useCategoryStore'
import { useState } from 'react'

export default function NewCategoryForm({ open, onClose }) {
  const upsertCategory = useCategoryStore((s) => s.upsert)

  const [name, setName] = useState('')
  const [iconKey, setIconKey] = useState('')

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !iconKey) return alert('이름/아이콘을 입력하세요.')

    try {
      await upsertCategory({ name: name.trim(), icon_key: iconKey })
      resetAndClose()
    } catch (err) {
      alert(err.message)
    }
  }

  const resetAndClose = () => {
    setName('')
    setIconKey('')
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   bg-white w-96 rounded-xl shadow-xl"
      >
        <button
          type="button"
          aria-label="닫기"
          onClick={resetAndClose}
          className="absolute right-2 top-2 p-3 rounded hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col p-5 gap-4">
          <div className="text-lg font-semibold">새 카테고리 추가</div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">아이콘</label>
            <IconPicker value={iconKey} onChange={setIconKey} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">카테고리 이름</label>
            <input
              className="border rounded p-2 border-gray-400"
              placeholder="예: 식비"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <button className="mt-2 h-10 rounded-md bg-blue-500 text-white">
            추가
          </button>
        </form>
      </div>
    </div>
  )
}
