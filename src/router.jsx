import { ROUTES } from "./lib/routes";
import DashBoard from "./pages/DashBoard";
import Preview from "./pages/Prieview";
import RootLayout from "./pages/RootLayout";
import { Route, Routes } from "react-router-dom";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.ROOT} element={<RootLayout />}>
      <Route path={ROUTES.DASHBOARD} element={<DashBoard/>}/>
      </Route>
      <Route path={ROUTES.PREVIEW} element={<Preview/>}/>
    </Routes>
  );
}
