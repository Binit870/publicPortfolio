import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {

    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const user = await login(form);

            toast.success("Login successful");

            if (user.role === "superadmin") {
                navigate("/superadmin/dashboard");
            }
            else if (user.role === "admin") {
                navigate("/admin/dashboard");
            }
            else {
                navigate("/");
            }

        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        }
    };

    return (

        <div className="min-h-screen flex">

            {/* LEFT ILLUSTRATION */}
            <div className="flex w-full lg:w-1/2 items-center justify-center bg-white">

                <div className="w-full max-w-md p-10">

                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome
                    </h2>

                    <p className="text-gray-500 mb-6">
                        Login to your account
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>

                            <input
                                type="email"
                                placeholder="Email"
                                required
                                className="w-full border-b-2 p-3 focus:outline-none focus:border-green-500"
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />

                        </div>

                        <div>

                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full border-b-2 p-3 focus:outline-none focus:border-green-500"
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                            />

                        </div>

                        <div className="flex justify-end text-sm text-gray-500">
                            Forgot password?
                        </div>

                        <button
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full transition"
                        >
                            LOGIN
                        </button>

                    </form>

                    <p className="text-center mt-6 text-gray-600">

                        Don't have an account?{" "}

                        <Link
                            to="/signup"
                            className="text-orange-500 font-semibold"
                        >
                            Signup
                        </Link>

                    </p>

                </div>

            </div>
            <div className="hidden lg:flex w-1/2 bg-green-500 items-center justify-center relative overflow-hidden">

                <div className="absolute w-[600px] h-[600px] bg-green-400 rounded-full bottom-[-200px] right-[-200px]" />

            </div>
        </div>

    );
}