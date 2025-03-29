"use client";
import { useState } from "react";
import { FaBookmark, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import useLoader from "@/hooks/user-loader";
import { baseUrl } from "@/constant";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const LoginPage = () => {
  const { isLoading, startLoading, stopLoading } = useLoader();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    startLoading();
    try {
      const response = await axios.post(`${baseUrl}/api/login/`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = response.data;
      console.log("Response data structure:", data);

      toast.success("Login successful!");
      router.push("/");
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorData = error.response.data;
          toast.error(errorData.error || "Login failed. Please try again.");
        } else {
          toast.error("Network error. Please check your connection.");
        }
      } else {
        console.error("Error during login:", error);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      stopLoading();
    }
  };

  return (
    <div
      className="relative h-screen w-full bg-[position:12%]  bg-no-repeat bg-cover  bg-accent lg:bg-center"
      style={{ backgroundImage: `url('/pc1.jpeg')` }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center md:justify-between mx-auto min-h-screen w-full px-4 md:px-6 py-4 md:py-8">
        <div className="text-white text-center md:text-start md:ml-12 max-w-md font-['Abril_Fatface'] space-y-4 mb-8 md:mb-0">
          <h2 className="text-4xl md:text-6xl 2xl:text-7xl font-normal leading-tight">
            &ldquo;in everything give thanks;&rdquo;
          </h2>
          <p className="text-lg md:text-xl text-white font-normal font-['Outfit']">
            FOR THIS IS THE WILL OF GOD IN CHRIST JESUS FOR YOU.
          </p>
          <p className="flex items-center justify-center md:justify-start gap-2 font-semibold">
            <FaBookmark className="text-red-600 my-auto" />1 Thessalonians 5:18
            NKJV
          </p>
        </div>

        <div className=" md:bg-transparent mx-auto p-4 md:p-8 rounded-xl max-w-md w-full">
          <h3 className="text-xl font-semibold text-white">Welcome Back</h3>
          <p className="text-sm p-0.5 text-white">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline text-blue-600">
              Sign up
            </Link>
          </p>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label htmlFor="email" className="text-sm font-normal text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}

              <label
                htmlFor="password"
                className="text-sm font-normal text-white"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </motion.div>

            <div className="flex justify-between items-center">
              <label className="flex items-center text-sm text-white">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-sm text-blue-600">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
