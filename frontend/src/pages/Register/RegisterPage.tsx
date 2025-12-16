import { Button, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { apiService } from "../../services";

type RegisterProps = {
    isSignUp: boolean;
};

function Register({ isSignUp }: RegisterProps): React.JSX.Element {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "signup-name") {
            setFormData(prev => ({ ...prev, username: value }));
        } else if (id === "signup-email") {
            setFormData(prev => ({ ...prev, email: value }));
        } else if (id === "signup-password") {
            setFormData(prev => ({ ...prev, password: value }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { username?: string; email?: string; password?: string } = {};
        
        if (!formData.username) {
            newErrors.username = "Kullanıcı adı gereklidir";
        } else if (formData.username.length < 3) {
            newErrors.username = "Kullanıcı adı en az 3 karakter olmalıdır";
        }
        
        if (!formData.email) {
            newErrors.email = "Email gereklidir";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Geçerli bir email adresi girin";
        }
        
        if (!formData.password) {
            newErrors.password = "Şifre gereklidir";
        } else if (formData.password.length < 6) {
            newErrors.password = "Şifre en az 6 karakter olmalıdır";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        const response = await apiService.register(
            formData.username,
            formData.email,
            formData.password
        );
        
        if (response.success) {
            setFormData({ username: "", email: "", password: "" });
            setErrors({});
        }
        
        setIsLoading(false);
    };

    return (
        <section className={`absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center p-12 bg-white transition-all duration-500 ease-in-out ${isSignUp ? "translate-x-full opacity-100 z-10" : "opacity-0 z-0"}`} aria-label="Sign up form" aria-hidden={!isSignUp}>
            <form className="flex flex-col gap-4 h-full justify-center text-center" onSubmit={handleSubmit} noValidate>
                <h1 className="text-3xl font-bold mb-4 text-[#659EB3]">Create Account</h1>
                <p className="text-sm text-[#8B7B8E] mb-6">use your email for registration</p>
                
                <div>
                    <label htmlFor="signup-name" className="block text-sm font-medium text-[#8B7B8E] mb-2">Username <span className="text-red-600" aria-label="required">*</span></label>
                    <TextInput 
                        id="signup-name" 
                        type="text" 
                        placeholder="Enter your username" 
                        required 
                        className="bg-[#659EB3]/10 text-[#4E5C6B] placeholder:text-[#8B7B8E]/60 border-[#659EB3]/30"
                        value={formData.username}
                        onChange={handleInputChange}
                        aria-label="Username"
                        aria-invalid={!!errors.username}
                        aria-describedby={errors.username ? "signup-name-error" : undefined}
                    />
                    {errors.username && (
                        <p id="signup-name-error" className="text-red-600 text-sm mt-1" role="alert">
                            {errors.username}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium text-[#8B7B8E] mb-2">Email Address <span className="text-red-600" aria-label="required">*</span></label>
                    <TextInput 
                        id="signup-email" 
                        type="email" 
                        placeholder="Enter your email" 
                        required 
                        className="bg-[#659EB3]/10 text-[#4E5C6B] placeholder:text-[#8B7B8E]/60 border-[#659EB3]/30"
                        value={formData.email}
                        onChange={handleInputChange}
                        aria-label="Email address"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "signup-email-error" : undefined}
                    />
                    {errors.email && (
                        <p id="signup-email-error" className="text-red-600 text-sm mt-1" role="alert">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium text-[#8B7B8E] mb-2">Password <span className="text-red-600" aria-label="required">*</span></label>
                    <TextInput 
                        id="signup-password" 
                        type="password" 
                        placeholder="Enter your password" 
                        required 
                        className="bg-[#659EB3]/10 text-[#4E5C6B] placeholder:text-[#8B7B8E]/60 border-[#659EB3]/30"
                        value={formData.password}
                        onChange={handleInputChange}
                        aria-label="Password"
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? "signup-password-error" : undefined}
                    />
                    {errors.password && (
                        <p id="signup-password-error" className="text-red-600 text-sm mt-1" role="alert">
                            {errors.password}
                        </p>
                    )}
                </div>

                <Button 
                    type="submit" 
                    className="bg-[#659EB3] hover:bg-[#5A8BA0] mt-4 border-0 transition-transform active:scale-95 text-[#FFFCEF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B7B8E]"
                    disabled={isLoading}
                    aria-busy={isLoading}
                >
                    {isLoading ? "Kaydediliyor..." : "Sign Up"}
                </Button>
            </form>
        </section>
    );
}

export default Register;