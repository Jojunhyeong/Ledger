// SettingList.jsx
import { useEffect, useState } from "react";
import SettingCard from "./SettingCard";
import NewCategoryForm from "./NewCategoryForm";
import { useCategoryStore } from "@/store/useCategoryStore";
import { ICONS } from "@/constants/iconRegistry";

export default function SettingList() {
  const [open, setOpen] = useState(false);
  const items = useCategoryStore((s) => s.items);
  const fetchAll = useCategoryStore((s) => s.fetchAll);
  const deleteCategory = useCategoryStore((s) => s.delete)

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDelete = async (id) => {
    if(!window.confirm('이 카테고리를 삭제할까요?'))return
    try {
        await deleteCategory(id)
    } catch (e) {
        console.error(e)
        alert("삭제에 실패했습니다.")
    }
  }

  return (
    <div className="overflow-auto mt-4 bg-white rounded-lg flex flex-col md:min-w-256 px-4 min-w-72 pb-10 mb-14">
      <div className="py-3 font-semibold">카테고리 관리</div>

      <div className="flex justify-between items-center">
        <div className="text-sm">카테고리 목록</div>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-500 text-white text-xs items-center flex px-2 py-1 rounded-xs disabled:opacity-50 whitespace-nowrap h-5"
        >
          + 추가
        </button>
      </div>

      <div className="mt-2 ">
        {items.map((c) => {
          const Icon = ICONS[c.icon_key] ?? ICONS["wallet"]; // fallback 아이콘
          return (
            <SettingCard
              key={c.id}
              icon={Icon}
              name={c.name}
              onDelete={() => handleDelete(c.id)}
            />
          );
        })}
      </div>

      <NewCategoryForm open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
