import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import CustomToast from "../../../components/toast/toast";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (10 + Math.random() * 15);
      });
    }, 300);
    return interval;
  };

  const handleSignup = async e => {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmitting(true);
    const progressInterval = simulateProgress();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      navigate("/main");
    } catch (err) {
      console.error("Erro ao criar conta:", err.message);
      setError("Erro ao criar conta. Tente novamente.");
      toast.error(
        err.message.includes("weak-password")
          ? "Senha muito fraca (mínimo 6 caracteres)"
          : err.message.includes("email-already-in-use")
          ? "Este email já está em uso"
          : "Erro ao criar conta"
      );
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center h-screen bg-[#DDDDDD]"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white w-[500px] h-auto rounded-2xl p-[24px] relative overflow-hidden shadow-xl"
      >
        {isLoading && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-[#7695EC] via-[#9ab1ff] to-[#7695EC]"
          />
        )}

        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-[22px] font-display font-bold mb-6 text-gray-800"
        >
          Create your account!
        </motion.h2>

        <motion.p
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[16px] font-normal mb-2 text-gray-600"
        >
          Please create a username and password
        </motion.p>

        <form onSubmit={handleSignup} className="space-y-4">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7695EC] focus:border-transparent transition-all"
              required
            />
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7695EC] focus:border-transparent transition-all"
              required
              minLength={6}
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm overflow-hidden"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="flex justify-end pt-2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.button
                  key="submitting"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  type="submit"
                  disabled
                  className="w-[111px] h-[32px] uppercase text-white rounded-lg bg-[#7695EC] flex items-center justify-center"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                </motion.button>
              ) : (
                <motion.button
                  key="normal"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  type="submit"
                  disabled={!email || !password || isLoading}
                  whileHover={
                    !email || !password || isLoading ? {} : { scale: 1.05 }
                  }
                  whileTap={
                    !email || !password || isLoading ? {} : { scale: 0.95 }
                  }
                  className={`w-[111px] h-[32px] uppercase text-white rounded-lg ${
                    !email || !password || isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#7695EC] hover:bg-[#6785d6]"
                  }`}
                >
                  Create
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </form>

        <motion.div
          className="mt-6 text-center"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#7695EC] hover:underline font-medium transition-colors"
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      </motion.div>
      <CustomToast />
    </motion.div>
  );
};

export default RegisterPage;
