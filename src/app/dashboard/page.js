"use client"
import { useAuth } from "@/context/AuthContext"

export default function DashboardPage(){
    const {user} = useAuth();
    return (
        <>
        <p> Hellow {user?.username}! You are logged In. </p>
        </>
    )
}