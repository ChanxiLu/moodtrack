import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";
import Main from "@/components/Main";
import { useAuth } from "@/context/AuthContext";

export const metadata = {
    title: "Moodtrack · Dashboard",
};


export default function DashboardPage(){

    return (
        <Main>
            <Dashboard />
        </Main>
    )
}   