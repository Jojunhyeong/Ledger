import Layout from "@/components/common/Layout";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";

export default function RootLayout() {
    return(
        <Layout>
            <ErrorBoundary fallback={<p>오류가 발생했습니다.</p>}>
                <Suspense fallback={<div className="p-6">로딩중...</div>}>
                    <Outlet/>
                </Suspense>
            </ErrorBoundary>
        </Layout>
    )
}