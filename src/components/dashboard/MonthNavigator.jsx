import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MonthNavigator() {
    return(
        <div className="flex items-center mt-6">
            <ChevronLeft className="w-10 justify-center h-6 text-gray-500"/>
            <div className="text-xl font-semibold">2025년 8월</div>
            <ChevronRight className="w-10 h-6 text-gray-500"/>
        </div>
    )
}