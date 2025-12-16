import { Button, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Register from "../Register/RegisterPage";
import { apiService } from "../../services";

function Login(): React.JSX.Element {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
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

    const validateForm = (): boolean => {
        const newErrors: { email?: string; password?: string } = {};
        
        if (!loginData.email) {
            newErrors.email = "Email gereklidir";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
            newErrors.email = "Geçerli bir email adresi girin";
        }
        
        if (!loginData.password) {
            newErrors.password = "Şifre gereklidir";
        } else if (loginData.password.length < 6) {
            newErrors.password = "Şifre en az 6 karakter olmalıdır";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        const response = await apiService.login(loginData.email, loginData.password);
        
        if (response.success) {
            setLoginData({ email: "", password: "" });
            setErrors({});
            // localStorage.setItem('token', response.data?.token);
            // navigate('/dashboard');
        }
        
        setIsLoading(false);
    };

            return (
        <main className="min-h-screen bg-[#7F94A6] flex items-center justify-center px-4" style={{position:"absolute", width:"100%", height:"100%", alignItems:"center", top:"0", left:"0"}}>
            <section className={`relative bg-[#E0D4C0] rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl min-h-[600px] transition-all duration-500`} role="main">
                
                <Register isSignUp={isSignUp} ></Register>
                
                <section className={`absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center p-12 bg-[#E0D4C0] transition-all duration-500 ease-in-out z-2 ${isSignUp ? "translate-x-full opacity-0" : "opacity-100"}`} aria-hidden={isSignUp}>
                    <form className="flex flex-col gap-4 h-full justify-center text-center" onSubmit={handleLogin} noValidate>
                        <h1 className="text-3xl font-bold mb-4 text-[#4E0000]">Sign In</h1>
                        <p className="text-sm text-[#13273F] mb-6">use your email password</p>
                        
                        <div>
                            <label htmlFor="signin-email" className="block text-sm font-medium text-[#13273F] mb-2">Email Address <span className="text-red-600" aria-label="required">*</span></label>
                            <TextInput 
                                id="signin-email" 
                                type="email" 
                                placeholder="Enter your email" 
                                required 
                                className="bg-[#13273F] text-[#E0D4C0] placeholder:text-[#E0D4C0]/60"
                                value={loginData.email}
                                onChange={handleInputChange}
                                aria-label="Email address"
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? "signin-email-error" : undefined}
                            />
                            {errors.email && (
                                <p id="signin-email-error" className="text-red-600 text-sm mt-1" role="alert">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="signin-password" className="block text-sm font-medium text-[#13273F] mb-2">Password <span className="text-red-600" aria-label="required">*</span></label>
                            <TextInput 
                                id="signin-password" 
                                type="password" 
                                placeholder="Enter your password" 
                                required 
                                className="bg-[#13273F] text-[#E0D4C0] placeholder:text-[#E0D4C0]/60"
                                value={loginData.password}
                                onChange={handleInputChange}
                                aria-label="Password"
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? "signin-password-error" : undefined}
                            />
                            {errors.password && (
                                <p id="signin-password-error" className="text-red-600 text-sm mt-1" role="alert">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        
                        <a href="#" className="text-sm text-[#13273F] hover:text-[#4E0000] mt-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4E0000] rounded px-2 py-1">Forgot your password?</a>
                        <Button 
                            type="submit" 
                            className="bg-[#13273F] hover:bg-[#0f1f33] mt-4 border-0 transition-transform active:scale-95 text-[#E0D4C0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4E0000]"
                            disabled={isLoading}
                            aria-busy={isLoading}
                        >
                            {isLoading ? "Giriş yapılıyor..." : "Sign In"}
                        </Button>
                    </form>
                </section>

                <section className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-500 ease-in-out z-20 ${isSignUp ? "-translate-x-full" : ""}`} aria-label="Authentication mode toggle">
                    <div className={`bg-[#4E0000] text-[#E0D4C0] relative -left-full h-full w-[200%] transform transition-transform duration-500 ease-in-out flex items-center justify-center ${isSignUp ? "translate-x-1/2" : "translate-x-0"}`}>
                        
                        <article className={`w-1/2 h-full flex flex-col items-center justify-center px-12 text-center transform transition-transform duration-500 ease-in-out ${isSignUp ? "translate-x-0" : "-translate-x-[20%]"}`} aria-hidden={isSignUp}>
                            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                            <p className="mb-8 text-[#E0D4C0]">To keep connected with us please login with your personal info</p>
                            <button 
                                onClick={() => handleToggle(false)} 
                                className="border-2 border-[#E0D4C0] text-[#E0D4C0] rounded-full px-12 py-3 font-bold uppercase tracking-wider hover:bg-[#E0D4C0] hover:text-[#4E0000] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E0D4C0]"
                                aria-pressed={!isSignUp}
                                aria-label="Switch to sign in mode"
                            >
                                Sign In
                            </button>
                        </article>

                        <article className={`w-1/2 h-full flex flex-col items-center justify-center px-12 text-center transform transition-transform duration-500 ease-in-out ${isSignUp ? "translate-x-[20%]" : "translate-x-0"}`} aria-hidden={!isSignUp}>
                            <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
                            <p className="mb-8 text-[#E0D4C0]">Enter your personal details and start journey with us</p>
                            <button 
                                onClick={() => handleToggle(true)} 
                                className="border-2 border-[#E0D4C0] text-[#E0D4C0] rounded-full px-12 py-3 font-bold uppercase tracking-wider hover:bg-[#E0D4C0] hover:text-[#4E0000] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E0D4C0]"
                                aria-pressed={isSignUp}
                                aria-label="Switch to sign up mode"
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