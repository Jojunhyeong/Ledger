import { ROUTES } from "./lib/routes";
import DashBoard from "./pages/DashBoard";
import Preview from "./pages/Prieview";
import RootLayout from "./pages/RootLayout";
import { Route, Routes } from "react-router-dom";
import Transaction from "./pages/Transaction";
import Budget from "./pages/Budget";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.ROOT} element={<RootLayout />}>
      <Route path={ROUTES.DASHBOARD} element={<DashBoard/>}/>
       <Route path={ROUTES.TRANSACTION} element={<Transaction/>}/>
       <Route path={ROUTES.BUDGET} element={<Budget/>}/>
      </Route>
      <Route path={ROUTES.PREVIEW} element={<Preview/>}/>
    </Routes>
  );
}
