import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {

  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await signup(form);

      toast.success("Account created successfully");

      navigate("/login");

    } catch (err) {

      toast.error(err.response?.data?.message || "Signup failed");

    }
  };

  return (

    <div className="min-h-screen flex">

      {/* LEFT ILLUSTRATION */}

      <div className="hidden lg:flex w-1/2 bg-orange-400 items-center justify-center relative overflow-hidden">

        <div className="absolute w-[600px] h-[600px] bg-orange-300 rounded-full bottom-[-200px] left-[-200px]" />

    

      </div>

      {/* RIGHT FORM */}

      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white">

        <div className="w-full max-w-md p-10">

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>

          <p className="text-gray-500 mb-6">
            Signup to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              placeholder="Name"
              required
              className="w-full border-b-2 p-3 focus:outline-none focus:border-orange-400"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              required
              className="w-full border-b-2 p-3 focus:outline-none focus:border-orange-400"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              required
              className="w-full border-b-2 p-3 focus:outline-none focus:border-orange-400"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full transition"
            >
              SIGNUP
            </button>

          </form>

          <p className="text-center mt-6 text-gray-600">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-green-600 font-semibold"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>

  );
}