import Header from "./Header";

export default function Layout({children}) {
    return (
        <div className="w-full min-h-screen bg-gray-100 mb-14 md:mb-0">
            <Header/>
            {children}
        </div>
    )
}