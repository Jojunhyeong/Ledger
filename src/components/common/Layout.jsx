import Header from "./Header";

export default function Layout({children}) {
    return (
        <div className="w-full min-h-screen bg-gray-100">
            <Header/>
            {children}
        </div>
    )
}