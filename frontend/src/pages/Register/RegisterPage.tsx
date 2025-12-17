import { Button, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { apiService } from "../../services";
import { useNavigate } from "react-router-dom";

type RegisterProps = {
    isSignUp: boolean;
};

function Register({ isSignUp }: RegisterProps): React.JSX.Element {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ first_name?: string; last_name?: string; email?: string; password?: string; confirmPassword?: string; general?: string }>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "signup-name") {
            setFormData(prev => ({ ...prev, first_name: value }));
        } else if (id === "signup-lastname") {
            setFormData(prev => ({ ...prev, last_name: value }));
        } else if (id === "signup-email") {
            setFormData(prev => ({ ...prev, email: value }));
        } else if (id === "signup-password") {
            setFormData(prev => ({ ...prev, password: value }));
        } else if (id === "signup-confirm-password") {
            setFormData(prev => ({ ...prev, confirmPassword: value }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { first_name?: string; last_name?: string; email?: string; password?: string; confirmPassword?: string } = {};
        
        if (!formData.first_name) {
            newErrors.first_name = "Ad gereklidir";
        } else if (formData.first_name.length < 2) {
            newErrors.first_name = "Ad en az 2 karakter olmalıdır";
        }

        if (!formData.last_name) {
            newErrors.last_name = "Soyadı gereklidir";
        } else if (formData.last_name.length < 2) {
            newErrors.last_name = "Soyadı en az 2 karakter olmalıdır";
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
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Şifre tekrarı gereklidir";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Şifreler eşleşmiyor";
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
            formData.email,
            formData.password,
            formData.first_name,
            formData.last_name,
            "user"
        );
        
        if (response.success) {
            setFormData({ first_name: "", last_name: "", email: "", password: "", confirmPassword: "" });
            setErrors({});

            navigate('/login');
        } else {
            setErrors({ general: response.message || "Kayıt başarısız" });
            console.error('Registration failed:', response.error);
        }
        
        setIsLoading(false);
    };

    return (
        <section className={`absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center p-12 bg-white transition-all duration-500 ease-in-out ${isSignUp ? "translate-x-full opacity-100 z-10" : "opacity-0 z-0"}`} aria-label="Kayıt Ol" aria-hidden={!isSignUp}>
            <form className="flex flex-col gap-4 h-full justify-center text-center overflow-y-auto max-h-[90vh]" onSubmit={handleSubmit} noValidate>
                <h1 className="text-3xl font-bold mb-4 text-[#659EB3]">Hesap Oluştur</h1>
                <p className="text-sm text-[#8B7B8E] mb-6">Yeni hesabınızı oluşturmak için bilgilerinizi girin</p>
                
                {errors.general && (
                    <p className="text-red-600 text-sm bg-red-50 p-2 rounded" role="alert">
                        {errors.general}
                    </p>
                )}

                <div>
                    <label htmlFor="signup-name" className="block text-sm font-medium text-[#8B7B8E] mb-2">Ad <span className="text-red-600" aria-label="required">*</span></label>
                    <TextInput 
                        id="signup-name" 
                        type="text" 
                        placeholder="Adınızı girin" 
                        required 
                        className="bg-[#659EB3]/10 text-[#4E5C6B] placeholder:text-[#8B7B8E]/60 border-[#659EB3]/30"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        aria-label="First name"
                        aria-invalid={!!errors.first_name}
                        aria-describedby={errors.first_name ? "signup-name-error" : undefined}
                        autoFocus
                    />
                    {errors.first_name && (
                        <p id="signup-name-error" className="text-red-600 text-sm mt-1" role="alert">
                            {errors.first_name}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="signup-lastname" className="block text-sm font-medium text-[#8B7B8E] mb-2">Soyadı <span className="text-red-600" aria-label="required">*</span></label>
                    <TextInput 
                        id="signup-lastname" 
                        type="text" 
                        placeholder="Soyadınızı girin" 
                        required 
                        className="bg-[#659EB3]/10 text-[#4E5C6B] placeholder:text-[#8B7B8E]/60 border-[#659EB3]/30"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        aria-label="Last name"
                        aria-invalid={!!errors.last_name}
                        aria-describedby={errors.last_name ? "signup-lastname-error" : undefined}
                    />
                    {errors.last_name && (
                        <p id="signup-lastname-error" className="text-red-600 text-sm mt-1" role="alert">
                            {errors.last_name}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium text-[#8B7B8E] mb-2">E-posta <span className="text-red-600" aria-label="required">*</span></label>
                    <TextInput 
                        id="signup-email" 
                        type="email" 
                        placeholder="E-postanızı girin" 
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
                    <label htmlFor="signup-password" className="block text-sm font-medium text-[#8B7B8E] mb-2">Şifre <span className="text-red-600" aria-label="required">*</span></label>
                    <TextInput 
                        id="signup-password" 
                        type="password" 
                        placeholder="Şifrenizi girin" 
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

                <div>
                    <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-[#8B7B8E] mb-2">Şifre Tekrarı <span className="text-red-600" aria-label="required">*</span></label>
                    <TextInput 
                        id="signup-confirm-password" 
                        type="password" 
                        placeholder="Yeniden şifrenizi girin" 
                        required 
                        className="bg-[#659EB3]/10 text-[#4E5C6B] placeholder:text-[#8B7B8E]/60 border-[#659EB3]/30"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        aria-label="Confirm password"
                        aria-invalid={!!errors.confirmPassword}
                        aria-describedby={errors.confirmPassword ? "signup-confirm-password-error" : undefined}
                    />
                    {errors.confirmPassword && (
                        <p id="signup-confirm-password-error" className="text-red-600 text-sm mt-1" role="alert">
                            {errors.confirmPassword}
                        </p>
                    )}
                </div>

                <Button 
                    type="submit" 
                    className="bg-[#659EB3] hover:bg-[#5A8BA0] mt-4 border-0 transition-transform active:scale-95 text-[#FFFCEF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B7B8E]"
                    disabled={isLoading}
                    aria-busy={isLoading}
                >
                    {isLoading ? "Kaydediliyor..." : "Kayıt Ol"}
                </Button>
            </form>
        </section>
    );
}

export default Register;