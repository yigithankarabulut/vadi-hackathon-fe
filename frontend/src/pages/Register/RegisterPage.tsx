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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        const response = await apiService.register(
            formData.username,
            formData.email,
            formData.password
        );
        
        if (response.success) {
            setFormData({ username: "", email: "", password: "" });
        }
        
        setIsLoading(false);
    };

    return (
        <section className={`absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center p-12 bg-[#E0D4C0] transition-all duration-500 ease-in-out ${isSignUp ? "translate-x-full opacity-100 z-10" : "opacity-0 z-0"}`} aria-label="Sign up form">
            <form className="flex flex-col gap-4 h-full justify-center text-center" onSubmit={handleSubmit}>
                <h1 className="text-3xl font-bold mb-4 text-[#4E0000]">Create Account</h1>
                <p className="text-sm text-[#13273F] mb-2">use your email for registration</p>
                
                <div>
                    <label htmlFor="signup-name" className="sr-only">Username</label>
                    <TextInput 
                        id="signup-name" 
                        type="text" 
                        placeholder="Username" 
                        required 
                        className="bg-[#13273F] text-[#E0D4C0] placeholder:text-[#E0D4C0]/60"
                        value={formData.username}
                        onChange={handleInputChange}
                        aria-label="Username"
                    />
                </div>

                <div>
                    <label htmlFor="signup-email" className="sr-only">Email address</label>
                    <TextInput 
                        id="signup-email" 
                        type="email" 
                        placeholder="Email" 
                        required 
                        className="bg-[#13273F] text-[#E0D4C0] placeholder:text-[#E0D4C0]/60"
                        value={formData.email}
                        onChange={handleInputChange}
                        aria-label="Email address"
                    />
                </div>

                <div>
                    <label htmlFor="signup-password" className="sr-only">Password</label>
                    <TextInput 
                        id="signup-password" 
                        type="password" 
                        placeholder="Password" 
                        required 
                        className="bg-[#13273F] text-[#E0D4C0] placeholder:text-[#E0D4C0]/60"
                        value={formData.password}
                        onChange={handleInputChange}
                        aria-label="Password"
                    />
                </div>

                <Button 
                    type="submit" 
                    className="bg-[#13273F] hover:bg-[#0f1f33] mt-4 border-0 transition-transform active:scale-95 text-[#E0D4C0]"
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