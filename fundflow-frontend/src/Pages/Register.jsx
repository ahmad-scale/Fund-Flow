import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/Authapi";


export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const data = await registerUser(formData);

            console.log(data);

            alert("Registration Successful");
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Registration Failed"
            );
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Create Account
                </h1>

                <form id="register-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        autoComplete="name"
                        required
                        className="w-full border p-3 rounded mb-4"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        autoComplete="email"
                        required
                        className="w-full border p-3 rounded mb-4"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                        className="w-full border p-3 rounded mb-4"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
                    >
                        Register
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-blue-600 underline-offset-4 hover:text-blue-700 hover:underline"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
