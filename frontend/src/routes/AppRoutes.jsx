import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Goals from "../pages/Goals.jsx";
import GoalDetail from "../pages/GoalDetail.jsx";
import Reports from "../pages/Reports.jsx";
import ReportDetail from "../pages/ReportDetail.jsx";
import Profile from "../pages/Profile.jsx";

const protectedElement = (element) => (
    <ProtectedRoute>{element}</ProtectedRoute>
);

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route
                    path="dashboard"
                    element={protectedElement(<Dashboard />)}
                />
                <Route path="goals" element={protectedElement(<Goals />)} />
                <Route
                    path="goals/:id"
                    element={protectedElement(<GoalDetail />)}
                />
                <Route path="reports" element={protectedElement(<Reports />)} />
                <Route
                    path="reports/:id"
                    element={protectedElement(<ReportDetail />)}
                />
                <Route path="profile" element={protectedElement(<Profile />)} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}
