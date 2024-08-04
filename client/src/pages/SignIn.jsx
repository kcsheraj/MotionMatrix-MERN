import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/dashboard");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
      <div className="p-8 max-w-md w-full bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/50">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-900">
          Sign In
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="bg-slate-100 p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="bg-slate-100 p-3 rounded-lg"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          <OAuth />
        </form>
        <div className="flex gap-2 mt-5 justify-center">
          <p>Don't have an account?</p>
          <Link to="/sign-up">
            <span className="text-blue-500 font-medium">Sign Up</span>
          </Link>
        </div>
        <p className="text-red-700 mt-5 text-center">
          {error ? error.message || "Something went wrong!" : ""}
        </p>
      </div>
    </div>
  );
}
