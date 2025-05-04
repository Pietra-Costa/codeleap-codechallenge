import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useAuth } from "../../../context/authContext";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";
import CustomToast from "../../../components/toast/toast";
import { motion, AnimatePresence } from "framer-motion";

const LoginPage = () => {
  const { user, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/main");
  }, [user, navigate]);

  const handleLogin = async e => {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmitting(true);

    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      setIsLoading(false);
      setIsSubmitting(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err) {
      setError("Erro ao fazer login");
      toast.error("Erro ao fazer login!");
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };

  const handleGoogleLogin = async e => {
    e.preventDefault();
    setIsLoading(true);

    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError("Erro no login com Google");
      console.error(error);
      toast.error("Erro no login com Google!");
    } finally {
      setIsLoading(false);
    }
  };

  if (user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center h-dvh"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white w-[500px] h-auto rounded-2xl p-[24px] relative overflow-hidden shadow-lg"
      >
        {isLoading && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#7695EC] via-[#9ab1ff] to-[#7695EC]"
          />
        )}

        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-[22px] font-display font-bold mb-6"
        >
          Welcome to CodeLeap Network!
        </motion.h2>

        <motion.p
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[16px] font-normal mb-2"
        >
          Please enter your username:
        </motion.p>

        <form onSubmit={handleLogin}>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <input
              type="email"
              placeholder="Username"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mb-2 border border-[#777777] rounded-lg w-full h-8 placeholder:text-[#CCCCCC] placeholder:text-[14px] p-2 focus:ring-2 focus:ring-[#7695EC] focus:border-transparent transition-all duration-200"
            />
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mb-4 border border-[#777777] rounded-lg w-full h-8 placeholder:text-[#CCCCCC] placeholder:text-[14px] p-2 focus:ring-2 focus:ring-[#7695EC] focus:border-transparent transition-all duration-200"
            />
          </motion.div>

          <motion.div
            className="flex justify-between items-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-[#777777] border p-2 rounded-[50%] flex items-center justify-center w-10 h-10 disabled:opacity-50 hover:bg-gray-100 transition-colors"
            >
              <FaGoogle className="text-[#7695EC] w-5 h-5" />
            </motion.button>

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
                  Enter
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </form>

        <motion.div
          className="flex justify-center items-center mt-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-[14px] text-[#757575cc]">
            Doesn't have an account?
            <span className="hover:text-[#7695EC] transition-colors">
              {" "}
              <Link to="/register"> Register Now </Link>{" "}
            </span>
          </p>
        </motion.div>
      </motion.div>
      <CustomToast />
    </motion.div>
  );
};

export default LoginPage;
