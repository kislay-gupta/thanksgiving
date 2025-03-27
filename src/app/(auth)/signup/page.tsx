"use client";

import { useState } from "react";
import {
  FaBookmark,
  FaTimes,
  FaCamera,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useLoader from "@/hooks/user-loader";
import { baseUrl } from "@/constant";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
const SignupPage = () => {
  const [step, setStep] = useState(1);
  const { isLoading, startLoading, stopLoading } = useLoader();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullname: "",
    password: "",
    password2: "",
    image: null as File | null,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      // Create image preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Add validation state
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    fullname: "",
    password: "",
    password2: "",
    image: "",
  });

  const validateStep = () => {
    const newErrors = { ...errors };
    let isValid = true;

    switch (step) {
      case 1:
        if (!formData.email) {
          newErrors.email = "Email is required";
          isValid = false;
        }
        if (!formData.username) {
          newErrors.username = "Username is required";
          isValid = false;
        }
        break;
      case 2:
        if (!formData.fullname) {
          newErrors.fullname = "Full name is required";
          isValid = false;
        }
        if (!formData.password) {
          newErrors.password = "Password is required";
          isValid = false;
        }
        if (!formData.password2) {
          newErrors.password2 = "Please confirm your password";
          isValid = false;
        }
        if (formData.password !== formData.password2) {
          newErrors.password2 = "Passwords do not match";
          isValid = false;
        }
        break;
      case 3:
        if (!formData.image) {
          newErrors.image = "Profile image is required";
          isValid = false;
        }
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Update handleSubmit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateStep()) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        setShowPreview(true);
      }
    }
  };

  const handleFinalSubmit = async () => {
    console.log("Form submitted:", formData);
    const dataForm = new FormData();
    dataForm.append("email", formData.email);
    dataForm.append("username", formData.username);
    dataForm.append("fullname", formData.fullname);
    dataForm.append("password", formData.password);
    dataForm.append("password2", formData.password2);
    if (formData.image) {
      dataForm.append("image", formData.image);
    }
    startLoading();
    try {
      const response = await axios.post(`${baseUrl}/api/register/`, dataForm);
      console.log(response.data);
      toast.success("Account created successfully!");
      setShowPreview(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Handle specific error messages from the backend
          const errorData = error.response.data;
          if (typeof errorData === "object") {
            // If the error response contains field-specific errors
            Object.entries(errorData).forEach(([field, message]) => {
              toast.error(`${field}: ${message}`);
            });
          } else {
            // If it's a general error message
            toast.error(errorData.toString());
          }
        } else if (error.request) {
          // Network error
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error("An unexpected error occurred.");
        }
      } else {
        toast.error("An unexpected error occurred during signup.");
      }
    } finally {
      stopLoading();
    }
  };

  // Add new state for drag and drop
  const [isDragging, setIsDragging] = useState(false);

  // Enhanced image preview component
  const ImagePreviewSection = () => (
    <div className="relative w-full aspect-square max-w-xs mx-auto mb-4">
      {imagePreview ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-full rounded-lg overflow-hidden"
        >
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => {
              setImagePreview(null);
              setFormData((prev) => ({ ...prev, image: null }));
            }}
            className="absolute top-2 right-2 bg-red-500 p-2 rounded-full text-white"
          >
            <FaTimes />
          </button>
        </motion.div>
      ) : (
        <motion.div
          className={`w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 ${
            isDragging ? "border-blue-500 bg-blue-50/10" : "border-gray-300"
          }`}
          animate={{ borderColor: isDragging ? "#3B82F6" : "#D1D5DB" }}
        >
          <FaCamera className="text-4xl text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 text-center">
            Drag & Drop your image here or click to browse
          </p>
        </motion.div>
      )}
    </div>
  );

  // Update case 3 in renderFormStep
  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
                htmlFor="username"
                className="text-sm font-normal text-white"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              />
            </motion.div>
          </AnimatePresence>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <label
              htmlFor="fullname"
              className="text-sm font-normal text-white"
            >
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            />
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
            <label
              htmlFor="password2"
              className="text-sm font-normal text-white"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="text-xs flex flex-1/3 gap-4 text-white">
              <p>• Use 8 or more characters</p>
              <p>• One uppercase & one lowercase character</p>
              <p>• One special character & one number</p>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <label htmlFor="image" className="text-sm font-normal text-white">
              Profile Image
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith("image/")) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                    setFormData((prev) => ({ ...prev, image: file }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            >
              <ImagePreviewSection />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                id="image-upload"
              />
              <motion.label
                htmlFor="image-upload"
                className="w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Choose File
              </motion.label>
            </div>
          </motion.div>
        );
    }
  };

  // Enhanced PreviewModal
  const PreviewModal = () => {
    if (!showPreview) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-white rounded-2xl overflow-hidden max-w-md w-full mx-4 shadow-xl"
          >
            {imagePreview && (
              <div className="w-full h-48 relative">
                <img
                  src={imagePreview}
                  alt="Profile Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                  />
                </div>
              </div>
            )}

            <div className="pt-20 px-8 pb-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-6"
              >
                <h3 className="text-2xl font-bold">{formData.fullname}</h3>
                <p className="text-gray-500">@{formData.username}</p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 flex gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFinalSubmit}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  Confirm & Submit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPreview(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-2 rounded-lg"
                >
                  Edit Information
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      <div
        className="min-h-full w-full bg-cover bg-center relative" // Removed -mt-16
        style={{ backgroundImage: `url('/pc1.jpeg')` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-around min-h-screen w-full px-6 py-8">
          {/* Left side quote */}
          <div className="text-white text-start max-w-md font-['Abril_Fatface'] space-y-4">
            <h2 className="text-6xl sm:text-7xl font-normal leading-tight">
              &ldquo;in everything give thanks;&rdquo;
            </h2>
            <p className="text-xl text-white font-normal font-['Outfit']">
              FOR THIS IS THE WILL OF GOD IN CHRIST JESUS FOR YOU.
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <FaBookmark className="text-red-600" />1 Thessalonians 5:18 NKJV
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-md w-full">
            <div className="mb-6">
              <h1 className="text-blue-500 text-4xl font-bold font-['Outfit'] mb-4">
                GratitudeSphere
              </h1>
              <h3 className="text-xl font-semibold text-white mb-2">
                Create an Account
              </h3>
              <p className="text-sm text-white/80">
                Already have an account?{" "}
                <Link
                  href="/"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Log in
                </Link>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <AnimatePresence>{renderFormStep()}</AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                    transition-colors duration-200 font-medium"
                >
                  {step === 3 ? "Create account" : "Next"}
                </button>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
                      transition-colors duration-200"
                  >
                    Back
                  </button>
                )}
              </div>
            </form>

            <p className="text-xs text-white/60 mt-6">
              By creating an account, you agree to the{" "}
              <span className="text-blue-400 cursor-pointer hover:text-blue-300">
                Terms of Use
              </span>{" "}
              and{" "}
              <span className="text-blue-400 cursor-pointer hover:text-blue-300">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      </div>
      <PreviewModal />
    </>
  );
};

export default SignupPage;
