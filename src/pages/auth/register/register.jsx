import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import CustomToast from "../../../components/toast/toast";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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
    const progressInterval = simulateProgress();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // console.log("Usuário registrado com sucesso:", user);
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
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#DDDDDD]">
      <div className="bg-white w-[500px] h-auto rounded-2xl p-[24px] relative overflow-hidden shadow-xl">
        {isLoading && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-100 overflow-hidden">
            <div
              className="h-full relative"
              style={{
                width: `${progress}%`,
                transition: "width 0.4s cubic-bezier(0.65, 0, 0.35, 1)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#7695EC] via-[#9ab1ff] to-[#7695EC] animate-gradient-flow" />
            </div>
          </div>
        )}

        <h2 className="text-[22px] font-display font-bold mb-6 text-gray-800">
          Create your account!
        </h2>
        <p className="text-[16px] font-normal mb-2 text-gray-600">
          Please create a username and password
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7695EC] focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7695EC] focus:border-transparent transition-all"
              required
              minLength={6}
            />
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!email || !password || isLoading}
              className={`w-[111px] h-[32px]  uppercase text-white rounded-lg flex items-center justify-center ${
                !email || !password || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#7695EC] hover:bg-[#6785d6] active:bg-[#5a7bd9]"
              } transition-colors`}
            >
              {isLoading ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#7695EC] hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>

        <style jsx global>{`
          @keyframes gradient-flow {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 100% 50%;
            }
          }
          .animate-gradient-flow {
            background-size: 200% 100%;
            animation: gradient-flow 1.5s linear infinite;
          }
        `}</style>
      </div>
      <CustomToast />
    </div>
  );
};

export default RegisterPage;
