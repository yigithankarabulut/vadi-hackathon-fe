import { Button, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Register from "../Register/RegisterPage";
import { apiService } from "../../services";

function Login(): React.JSX.Element {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === "/register") {
            setIsSignUp(true);
        } else {
            setIsSignUp(false);
        }
    }, [location.pathname]);

    const handleToggle = (signUp: boolean) => {
        setIsSignUp(signUp);
        navigate(signUp ? "/register" : "/login", { replace: true });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "signin-email") {
            setLoginData(prev => ({ ...prev, email: value }));
        } else if (id === "signin-password") {
            setLoginData(prev => ({ ...prev, password: value }));
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        const response = await apiService.login(loginData.email, loginData.password);
        
        if (response.success) {
            setLoginData({ email: "", password: "" });
            // localStorage.setItem('token', response.data?.token);
            // navigate('/dashboard');
        }
        
        setIsLoading(false);
    };

            return (
        <main className="min-h-screen bg-[#7F94A6] flex items-center justify-center px-4" style={{position:"absolute", width:"100%", height:"100%", alignItems:"center", top:"0", left:"0"}}>
            <section className={`relative bg-[#E0D4C0] rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl min-h-[600px] transition-all duration-500`}>
                
                <Register isSignUp={isSignUp} ></Register>
                
                <section className={`absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center p-12 bg-[#E0D4C0] transition-all duration-500 ease-in-out z-2 ${isSignUp ? "translate-x-full opacity-0" : "opacity-100"}`}>
                    <form className="flex flex-col gap-4 h-full justify-center text-center" onSubmit={handleLogin}>
                        <h1 className="text-3xl font-bold mb-4 text-[#4E0000]">Sign In</h1>
                        <p className="text-sm text-[#13273F] mb-2">use your email password</p>
                        
                        <div>
                            <label htmlFor="signin-email" className="sr-only">Email</label>
                            <TextInput 
                                id="signin-email" 
                                type="email" 
                                placeholder="Email" 
                                required 
                                className="bg-[#13273F] text-[#E0D4C0] placeholder:text-[#E0D4C0]/60"
                                value={loginData.email}
                                onChange={handleInputChange}
                                aria-label="Email address"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="signin-password" className="sr-only">Password</label>
                            <TextInput 
                                id="signin-password" 
                                type="password" 
                                placeholder="Password" 
                                required 
                                className="bg-[#13273F] text-[#E0D4C0] placeholder:text-[#E0D4C0]/60"
                                value={loginData.password}
                                onChange={handleInputChange}
                                aria-label="Password"
                            />
                        </div>
                        
                        <a href="#" className="text-sm text-[#13273F] hover:text-[#4E0000] mt-2 font-medium">Forgot your password?</a>
                        <Button 
                            type="submit" 
                            className="bg-[#13273F] hover:bg-[#0f1f33] mt-4 border-0 transition-transform active:scale-95 text-[#E0D4C0]"
                            disabled={isLoading}
                            aria-busy={isLoading}
                        >
                            {isLoading ? "Giriş yapılıyor..." : "Sign In"}
                        </Button>
                    </form>
                </section>

                <section className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-500 ease-in-out z-20 ${isSignUp ? "-translate-x-full" : ""}`} aria-label="Toggle authentication modes">
                    <div className={`bg-[#4E0000] text-[#E0D4C0] relative -left-full h-full w-[200%] transform transition-transform duration-500 ease-in-out flex items-center justify-center ${isSignUp ? "translate-x-1/2" : "translate-x-0"}`}>
                        
                        <article className={`w-1/2 h-full flex flex-col items-center justify-center px-12 text-center transform transition-transform duration-500 ease-in-out ${isSignUp ? "translate-x-0" : "-translate-x-[20%]"}`}>
                            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                            <p className="mb-8 text-[#E0D4C0]">To keep connected with us please login with your personal info</p>
                            <button 
                                onClick={() => handleToggle(false)} 
                                className="border-2 border-[#E0D4C0] text-[#E0D4C0] rounded-full px-12 py-3 font-bold uppercase tracking-wider hover:bg-[#E0D4C0] hover:text-[#4E0000] transition-colors"
                                aria-pressed={!isSignUp}
                            >
                                Sign In
                            </button>
                        </article>

                        <article className={`w-1/2 h-full flex flex-col items-center justify-center px-12 text-center transform transition-transform duration-500 ease-in-out ${isSignUp ? "translate-x-[20%]" : "translate-x-0"}`}>
                            <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
                            <p className="mb-8 text-[#E0D4C0]">Enter your personal details and start journey with us</p>
                            <button 
                                onClick={() => handleToggle(true)} 
                                className="border-2 border-[#E0D4C0] text-[#E0D4C0] rounded-full px-12 py-3 font-bold uppercase tracking-wider hover:bg-[#E0D4C0] hover:text-[#4E0000] transition-colors"
                                aria-pressed={isSignUp}
                            >
                                Sign Up
                            </button>
                        </article>

                    </div>
                </section>

            </section>
        </main>
    );
}

export default Login;