"use client"
import { createContext, useContext, useState, useEffect } from "react"
import api from "@/lib/api"

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await api.get("/auth/me");
            setUser(res.data);
            return true;
        } catch {
            setUser(null);
            return false;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    const signup = async (formData) => {
        try {
            await api.post("/auth/signup", formData);
            await fetchUser();
            return true; // signup successful
        } catch (err) {
            console.error("Signup failed:", err);
            return false;
        }
    }

    const signin = async (formData) => {
        try {
            await api.post("/auth/signin", formData);
            await fetchUser();
            return true; 
        } catch (err) {
            console.error("Signin failed:", err);
            return false;
        }
    }

    const signout = async () => {
        try {
            await api.post("/auth/signout");
            setUser(null);
            window.location.href = "/sign-in"; // note: use '=' not '()'
            return true;
        } catch (err) {
            console.error("Signout failed:", err);
            return false;
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, signin, signout, signup }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
