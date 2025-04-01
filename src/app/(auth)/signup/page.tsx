"use client";

import { useState, useRef } from "react";
import { FaBookmark, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { User, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useLoader from "@/hooks/user-loader";
import { baseUrl } from "@/constant";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

// Define form schema with Zod
const formSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    fullname: z.string().min(2, "Full name is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    password2: z.string(),
    image: z.any().optional(),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  });

type FormValues = z.infer<typeof formSchema>;

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const { isLoading, startLoading, stopLoading } = useLoader();
  const [showPreview, setShowPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { saveTokens } = useAuth();
  // Initialize form with defaultValues including image
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      fullname: "",
      password: "",
      password2: "",
      image: "",
    },
    mode: "onChange",
  });

  // Validate image
  const validateImage = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return false;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return false;
    }
    return true;
  };

  // Update handleImageChange with validation
  const handleImageChange = (file: File | null) => {
    if (file && !validateImage(file)) {
      return;
    }
    setSelectedImage(file);
    form.setValue("image", file); // Update this line

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.onerror = () => {
        toast.error("Error reading image file");
        setSelectedImage(null);
        setImagePreview(null);
        form.setValue("image", null); // Add this line
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      form.setValue("image", null); // Add this line
    }
  };

  // Submit the final form
  const handleFinalSubmit = async () => {
    const formData = form.getValues();
    console.log("Form submitted:", formData);

    const dataForm = new FormData();
    dataForm.append("email", formData.email);
    dataForm.append("username", formData.username);
    dataForm.append("fullname", formData.fullname);
    dataForm.append("password", formData.password);
    dataForm.append("password2", formData.password2);
    if (selectedImage) {
      dataForm.append("profile_picture", selectedImage); // Changed from 'image' to 'profile_picture'
    }

    startLoading();
    try {
      const response = await axios.post(`${baseUrl}/api/register/`, dataForm, {
        headers: {
          "Content-Type": "multipart/form-data", // Add this header for file upload
        },
      });
      console.log(response.data);

      // Store tokens if they're returned from the API
      if (response.data.tokens) {
        saveTokens(response.data.tokens.access, response.data.tokens.refresh);
        localStorage.setItem("access_token", response.data.tokens.access);
        localStorage.setItem("refresh_token", response.data.tokens.refresh);
      }

      toast.success("Account created successfully!");
      router.push("/login");
      setTimeout(() => {
        setShowPreview(false);
      }, 1500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorData = error.response.data;
          if (typeof errorData === "object") {
            Object.entries(errorData).forEach(([field, message]) => {
              toast.error(`${field}: ${message}`);
            });
          } else {
            toast.error(
              typeof errorData === "string"
                ? errorData
                : "An error occurred during signup"
            );
          }
        } else if (error.request) {
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

  const validateStep = () => {
    switch (step) {
      case 1:
        return form.trigger(["email", "username"]);
      case 2:
        return form.trigger(["fullname", "password", "password2"]);
      case 3:
        return form.trigger(["image"]);
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        setShowPreview(true);
      }
    }
  };

  // Enhanced image preview component
  const ImagePreviewSection = () => (
    <div className="relative w-full aspect-square max-w-xs mx-auto mb-4">
      <div
        className="relative flex items-center justify-center w-full h-64 bg-white/10 rounded-lg overflow-hidden cursor-pointer hover:bg-white/20 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-20 h-20 text-gray-400" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
          <Upload className="w-10 h-10 text-white" />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          handleImageChange(file);
        }}
        accept="image/*"
      />
      <p className="mt-2 text-sm text-white/70">Max image size: 5MB</p>
    </div>
  );

  // Render form steps with React Hook Form
  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal text-white">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="w-full px-4 py-2 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal text-white">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
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
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-white">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-white">
                    Password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                  {field.value && (
                    <div className="mt-2 space-y-1">
                      <p
                        className={`text-xs ${
                          field.value.length >= 8
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        • Minimum 8 characters {field.value.length >= 8 && "✓"}
                      </p>
                      <p
                        className={`text-xs ${
                          /[A-Z]/.test(field.value)
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        • At least one uppercase letter{" "}
                        {/[A-Z]/.test(field.value) && "✓"}
                      </p>
                      <p
                        className={`text-xs ${
                          /[a-z]/.test(field.value)
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        • At least one lowercase letter{" "}
                        {/[a-z]/.test(field.value) && "✓"}
                      </p>
                      <p
                        className={`text-xs ${
                          /[0-9]/.test(field.value)
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        • At least one number {/[0-9]/.test(field.value) && "✓"}
                      </p>
                      <p
                        className={`text-xs ${
                          /[^A-Za-z0-9]/.test(field.value)
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        • At least one special character{" "}
                        {/[^A-Za-z0-9]/.test(field.value) && "✓"}
                      </p>
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-white">
                    Confirm Password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                  {field.value && form.getValues().password && (
                    <p
                      className={`text-xs mt-1 ${
                        field.value === form.getValues().password
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {field.value === form.getValues().password
                        ? "✓ Passwords match"
                        : "✗ Passwords do not match"}
                    </p>
                  )}
                </FormItem>
              )}
            />
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ImagePreviewSection />

            <p className="text-xs text-white/70 mt-2">
              Upload a profile picture (optional). Max size: 5MB
            </p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Preview modal for final confirmation
  const PreviewModal = () => {
    if (!showPreview) return null;

    const formData = form.getValues();

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPreview(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-white rounded-2xl overflow-hidden max-w-md w-full mx-4 shadow-xl"
          >
            <div className="relative">
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full text-gray-800 hover:bg-white"
              >
                <FaTimes />
              </button>

              {imagePreview ? (
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
              ) : (
                <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-400">
                        {formData.fullname.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

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
                <Button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg"
                  asChild
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? "Creating Account..." : "Confirm & Submit"}
                  </motion.button>
                </Button>

                <Button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-2 rounded-lg"
                  variant="outline"
                  asChild
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Edit Information
                  </motion.button>
                </Button>
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
        className="min-h-full w-full bg-cover bg-[position:12%] lg:bg-center relative"
        style={{ backgroundImage: `url('/pc1.jpeg')` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between mx-auto min-h-screen w-full px-4 md:px-6 py-8">
          {/* Left side quote */}
          <div className="text-white text-center md:text-start md:ml-12 max-w-md font-['Abril_Fatface'] space-y-4 mb-8 md:mb-0">
            <h2 className="text-4xl md:text-6xl 2xl:text-7xl font-normal leading-tight">
              &ldquo;in everything give thanks;&rdquo;
            </h2>
            <p className="text-lg md:text-xl text-white font-normal font-['Outfit']">
              FOR THIS IS THE WILL OF GOD IN CHRIST JESUS FOR YOU.
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2 font-semibold">
              <FaBookmark className="text-red-600" />1 Thessalonians 5:18 NKJV
            </p>
          </div>

          {/* Form */}
          <div className="md:bg-transparent mx-auto p-4 md:p-8 rounded-xl max-w-md w-full">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                Create an Account
              </h3>
              <p className="text-sm text-white/80">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Log in
                </Link>
              </p>
            </div>

            <Form {...form}>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <AnimatePresence>{renderFormStep()}</AnimatePresence>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                      transition-colors duration-200 font-medium"
                    asChild
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {step === 3 ? "Create account" : "Next"}
                    </motion.button>
                  </Button>

                  {step > 1 && (
                    <Button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
                        transition-colors duration-200"
                      variant="secondary"
                      asChild
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Back
                      </motion.button>
                    </Button>
                  )}
                </div>
              </form>
            </Form>

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
