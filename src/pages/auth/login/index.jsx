import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useAuth } from "../../../context/authcontext";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";
import CustomToast from "../../../components/toast/toast";

const LoginPage = () => {
  const { user, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/main");
  }, [user, navigate]);

  const handleLogin = async e => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      setIsLoading(false);
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
    <div className="flex items-center justify-center h-dvh">
      <div className="bg-white w-[500px] h-auto rounded-2xl p-[24px] relative overflow-hidden">
        {isLoading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div
              className="h-full bg-[#7695EC] animate-loading"
              style={{
                width: "100%",
                backgroundImage:
                  "linear-gradient(to right, #7695EC, #9ab1ff, #7695EC)",
                backgroundSize: "200% 100%",
              }}
            />
          </div>
        )}

        <h2 className="text-[22px] font-display font-bold mb-6">
          Welcome to CodeLeap Network!
        </h2>
        <p className="text-[16px] font-normal mb-2">
          Please enter your username:
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Username"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mb-2 border border-[#777777] rounded-lg w-full h-8 placeholder:text-[#CCCCCC] placeholder:text-[14px] p-2"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mb-4 border border-[#777777] rounded-lg w-full h-8 placeholder:text-[#CCCCCC] placeholder:text-[14px] p-2"
          />

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="border-[#777777] border p-2 rounded-[50%] flex items-center justify-center w-10 h-10 disabled:opacity-50"
            >
              <FaGoogle className="text-[#7695EC] w-5 h-5" />
            </button>

            <button
              type="submit"
              disabled={!email || !password || isLoading}
              className={`w-[111px] h-[32px] uppercase text-white rounded-lg ${
                !email || !password || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-[#6785d6]"
              }`}
            >
              {isLoading ? "Loading..." : "Enter"}
            </button>
          </div>
        </form>

        <div className="flex justify-center items-center mt-4">
          <p className="text-[14px] text-[#757575cc]">
            Doesn't have an account?
            <span className="hover:text-primary">
              {" "}
              <Link to="/register"> Register Now </Link>{" "}
            </span>
          </p>
        </div>

        <style>{`
          @keyframes loading {
            0% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-loading {
            animation: loading 1.5s infinite linear;
          }
        `}</style>
      </div>
      <CustomToast />
    </div>
  );
};

export default LoginPage;
