import { ROUTES } from "./lib/routes";
import DashBoard from "./pages/DashBoard";
import Preview from "./pages/Prieview";
import RootLayout from "./pages/RootLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import Transaction from "./pages/Transaction";
import Budget from "./pages/Budget";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Setting from "./pages/Setting";

export default function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to ={ROUTES.SIGNIN} replace/>}/>
      <Route path={ROUTES.SIGNUP} element={<SignUp/>}/>
      <Route path={ROUTES.SIGNIN} element={<SignIn/>}/>
      <Route path={ROUTES.ROOT} element={<RootLayout />}>
      <Route path={ROUTES.DASHBOARD} element={<DashBoard/>}/>
       <Route path={ROUTES.TRANSACTION} element={<Transaction/>}/>
       <Route path={ROUTES.BUDGET} element={<Budget/>}/>
       <Route path={ROUTES.SETTING} element={<Setting/>}/>
      </Route>
      <Route path={ROUTES.PREVIEW} element={<Preview/>}/>
    </Routes>
  );
}
