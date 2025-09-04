import { Coffee, HeartPulse, Music, ShoppingCart, TramFront, Utensils, Wallet } from "lucide-react";

export const ICONS = {
    utensils: Utensils,
    coffee: Coffee,
    cart: ShoppingCart,
    tram: TramFront,
    health: HeartPulse,
    leisure: Music,
    wallet: Wallet,
}

export const ICON_OPTIONS = [
    {key: "utensils", label: "식비"},
    {key: "coffee", label: "카페/간식"},
    {key: "cart", label: "생활/쇼핑"},
    {key: "tram", label: "교통"},
    {key: "health", label: "건강/의료"},
    {key: "leisure", label: "여가/문화"},
    {key: "wallet", label: "금융/기타"},
]