"use client";
import { useState } from "react";
import { FaBookmark, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import useLoader from "@/hooks/user-loader";
import { baseUrl } from "@/constant";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "universal-cookie";
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

      // Log the actual response data structure to understand what we're receiving
      console.log("Response data structure:", response);

      if (response.status === 200 && response.data) {
        // Manually set the cookies since they're not being set automatically
        const cookies = new Cookies();

        // Check for different possible token formats in the response
        const accessToken =
          response.data.access ||
          response.data.access_token ||
          response.data.token ||
          (response.data.tokens && response.data.tokens.access);

        const refreshToken =
          response.data.refresh ||
          response.data.refresh_token ||
          (response.data.tokens && response.data.tokens.refresh);

        if (accessToken) {
          console.log(
            "Setting access token:",
            accessToken.substring(0, 10) + "..."
          );
          cookies.set("access_token", accessToken, {
            path: "/",
            sameSite: "lax",
          });
        } else {
          console.error("No access token found in response data");
        }

        if (refreshToken) {
          console.log(
            "Setting refresh token:",
            refreshToken.substring(0, 10) + "..."
          );
          cookies.set("refresh_token", refreshToken, {
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        }

        // Verify cookies were set
        console.log("Cookies after setting:", {
          access: cookies.get("access_token"),
          refresh: cookies.get("refresh_token"),
        });

        toast.success("Login successful!");
        router.push("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorData = error.response.data;
          if (typeof errorData === "object") {
            Object.entries(errorData).forEach(([field, message]) => {
              toast.error(`${field}: ${message}`);
            });
          } else {
            toast.error(errorData.toString());
          }
        } else if (error.request) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    } finally {
      stopLoading();
    }
  };

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url('/pc1.jpeg')` }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 flex items-center justify-around h-full w-full p-10">
        <div className="text-white text-start max-w-md font-['Abril_Fatface']">
          <h2 className="text-7xl font-normal leading-tight">
            &ldquo;in everything give thanks;&rdquo;
          </h2>
          <p className="text-white font-normal font-['Outfit']">
            FOR THIS IS THE WILL OF GOD IN CHRIST JESUS FOR YOU.
          </p>
          <p className="mt-2 flex gap-1 font-semibold">
            <FaBookmark className="text-red-600 my-auto" />1 Thessalonians 5:18
            NKJV
          </p>
        </div>

        <div className="bg-white/5 p-8 rounded-lg font-['Poppins'] max-w-5/12 w-full">
          <div className="justify-start text-blue-600 text-4xl font-bold font-['Outfit'] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">
            GratitudeSphere
          </div>
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
