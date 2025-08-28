"use client"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

const AuthContext = createContext(null);

// Backend API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://organic-adventure-9v6qxj669gp2pw75-8000.app.github.dev";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    // Fetch user data from backend
    const fetchUser = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'GET',
                credentials: 'include' // Include cookies
            });
            console.log(response)
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setIsAuthenticated(true);
                return true;
            } else {
                setUser(null);
                setIsAuthenticated(false);
                return false;
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
            setUser(null);
            setIsAuthenticated(false);
            return false;
        }
    }, []);

    // Check authentication status on app load
    const checkAuthStatus = useCallback(async () => {
        try {
            const success = await fetchUser();
            return success;
        } catch (error) {
            console.error("Authentication check failed:", error);
            setUser(null);
            setIsAuthenticated(false);
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchUser]);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);
    
    const signup = async (formData) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            
            console.log(response)
            if (response.ok) {
                // After successful signup, fetch user data
                const success = await fetchUser();
                if (success) {
                    router.push('/dashboard');
                    return true;
                }
            } else {
                const error = await response.json();
                throw new Error(error.detail || error.message || 'Signup failed');
            }
            return false;
        } catch (err) {
            console.error("Signup failed:", err);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const signin = async (formData) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                // After successful signin, fetch user data
                const success = await fetchUser();
                if (success) {
                    router.push('/dashboard');
                    return true;
                }
            } else {
                const error = await response.json();
                throw new Error(error.detail || error.message || 'Signin failed');
            }
            return false;
        } catch (err) {
            console.error("Signin failed:", err);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const signout = async () => {
        try {
            await fetch(`${API_BASE_URL}/auth/signout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (err) {
            console.error("Signout API call failed:", err);
        } finally {
            // Always clear local state regardless of API call success
            setUser(null);
            setIsAuthenticated(false);
            router.push('/sign-in');
        }
    }

    // Refresh token function (can be called when needed)
    const refreshToken = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include'
            });
            
            if (response.ok) {
                // Token refreshed successfully, fetch updated user data
                await fetchUser();
                return true;
            } else {
                // Refresh failed, user needs to login again
                setUser(null);
                setIsAuthenticated(false);
                router.push('/sign-in');
                return false;
            }
        } catch (error) {
            console.error("Token refresh failed:", error);
            setUser(null);
            setIsAuthenticated(false);
            router.push('/sign-in');
            return false;
        }
    }

    const value = {
        user,
        loading,
        isAuthenticated,
        signin,
        signout,
        signup,
        fetchUser,
        refreshToken,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
