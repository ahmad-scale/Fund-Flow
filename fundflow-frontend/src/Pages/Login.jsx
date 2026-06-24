import { useState } from "react";
import { loginUser } from "../services/Authapi";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);

      console.log(localStorage.getItem("token"));
      console.log(localStorage.getItem("user"));

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      console.log(data);

      alert("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <form id="login-form" onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            autoComplete="email"
            required
            className="w-full border p-3 rounded mb-4"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="current-password"
            required
            className="w-full border p-3 rounded mb-4"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            Login
          </button>

        </form>
      </div>
    </div >
  );
}
