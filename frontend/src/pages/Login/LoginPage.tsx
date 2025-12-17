import { Button, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Register from "../Register/RegisterPage";
import { apiService } from "../../services";
import { useUser, type User } from "../../context/UserContext";
import { setCookie } from "../../cookieManager/cookieManager";


function Login(): React.JSX.Element {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const location = useLocation();
    const navigate = useNavigate();
    const {setContext} = useUser();

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
        
        if (response.success && response.data) {
            setLoginData({ email: "", password: "" });
            setErrors({});
            
            setCookie("access_token", response.data.accessToken);

            const userData: User = {
                id: response.data.userId,
                access_token: response.data.accessToken,
                email: loginData.email,
                role: response.data.role,
            };
            
            setContext(userData);
            navigate('/home');
        } else {
            setErrors({ email: response.message || 'Giriş başarısız' });
            console.error('Login failed:', response.error);
        }
        
        setIsLoading(false);
    };

            return (
        <main className="min-h-screen bg-[#FFFCEF] flex items-center justify-center px-4" style={{position:"absolute", width:"100%", height:"100%", alignItems:"center", top:"0", left:"0"}}>
            <section className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl min-h-[600px] transition-all duration-500`} role="main">
                
                <Register isSignUp={isSignUp} ></Register>
                
                <section className={`absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center p-12 bg-white transition-all duration-500 ease-in-out z-2 ${isSignUp ? "translate-x-full opacity-0" : "opacity-100"}`} aria-hidden={isSignUp}>
                    <form className="flex flex-col gap-4 h-full justify-center text-center" onSubmit={handleLogin} noValidate>
                        <h1 className="text-3xl font-bold mb-4 text-[#659EB3]">Giriş Yap</h1>
                        
                        <div>
                            <label htmlFor="signin-email" className="block text-sm font-medium text-[#8B7B8E] mb-2">E-posta Adresi <span className="text-red-600" aria-label="required">*</span></label>
                            <TextInput 
                                id="signin-email" 
                                type="email" 
                                placeholder="E-postanızı girin" 
                                required 
                                className="bg-[#659EB3]/10 text-[#4E5C6B] placeholder:text-[#8B7B8E]/60 border-[#659EB3]/30"
                                value={loginData.email}
                                onChange={handleInputChange}
                                aria-label="Email adresi"
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? "signin-email-error" : undefined}
                                autoFocus
                            />
                            {errors.email && (
                                <p id="signin-email-error" className="text-red-600 text-sm mt-1" role="alert">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="signin-password" className="block text-sm font-medium text-[#8B7B8E] mb-2">Şifre <span className="text-red-600" aria-label="required">*</span></label>
                            <TextInput 
                                id="signin-password" 
                                type="password" 
                                placeholder="Şifrenizi girin" 
                                required 
                                className="bg-[#659EB3]/10 text-[#4E5C6B] placeholder:text-[#8B7B8E]/60 border-[#659EB3]/30"
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
                        
                        <a href="#" className="text-sm text-[#8B7B8E] hover:text-[#659EB3] mt-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#659EB3] rounded px-2 py-1">Şifremi Unuttum</a>
                        <Button 
                            type="submit" 
                            className="bg-[#659EB3] hover:bg-[#5A8BA0] mt-4 border-0 transition-transform active:scale-95 text-[#FFFCEF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B7B8E]"
                            disabled={isLoading}
                            aria-busy={isLoading}
                        >
                            {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                        </Button>
                    </form>
                </section>

                <section className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-500 ease-in-out z-20 ${isSignUp ? "-translate-x-full" : ""}`} aria-label="Authentication mode toggle">
                    <div className={`bg-[#659EB3] text-white relative -left-full h-full w-[200%] transform transition-transform duration-500 ease-in-out flex items-center justify-center ${isSignUp ? "translate-x-1/2" : "translate-x-0"}`}>
                        
                        <article className={`w-1/2 h-full flex flex-col items-center justify-center px-12 text-center transform transition-transform duration-500 ease-in-out ${isSignUp ? "translate-x-0" : "-translate-x-[20%]"}`} aria-hidden={isSignUp}>
                            <h2 className="text-3xl font-bold mb-4">Hoşgeldiniz</h2>
                            <p className="mb-8">Kişisel bilgilerinizi girin</p>
                            <button 
                                onClick={() => handleToggle(false)} 
                                className="border-2 border-white text-white rounded-full px-12 py-3 font-bold uppercase tracking-wider hover:bg-white hover:text-[#659EB3] transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                                aria-pressed={!isSignUp}
                                aria-label="Switch to sign in mode"
                            >
                                Giriş Yap
                            </button>
                        </article>

                        <article className={`w-1/2 h-full flex flex-col items-center justify-center px-12 text-center transform transition-transform duration-500 ease-in-out ${isSignUp ? "translate-x-[20%]" : "translate-x-0"}`} aria-hidden={!isSignUp}>
                            <h2 className="text-3xl font-bold mb-4">Merhaba</h2>
                            <button 
                                onClick={() => handleToggle(true)} 
                                className="border-2 border-white text-white rounded-full px-12 py-3 font-bold uppercase tracking-wider hover:bg-white hover:text-[#659EB3] transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                                aria-pressed={isSignUp}
                                aria-label="Switch to sign up mode"
                            >
                                Kayıt Ol
                            </button>
                        </article>

                    </div>
                </section>

            </section>
        </main>
    );
}

export default Login;