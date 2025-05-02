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
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/main");
  }, [user, navigate]);

  const handleLogin = async e => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err) {
      setError("Erro ao fazer login");
      toast.error("Erro ao fazer login!");
    }
  };

  const handleGoogleLogin = async e => {
    e.preventDefault();

    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError("Erro no login com Google");
      console.error(error);
      toast.error("Erro no login com Google!");
    }
  };

  if (user) return null;

  return (
    <div className="flex items-center justify-center h-dvh">
      <div className="bg-white w-[500px] h-auto rounded-2xl p-[24px]">
        <h2 className="text-[22px] font-display font-bold mb-6">
          Welcome to CodeLeap network!
        </h2>
        <p className="text-[16px] font-normal mb-2">
          Please enter your username
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Username"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mb-2 border border-[#777777] rounded-lg w-[452px] h-8 placeholder:text-[#CCCCCC] placeholder:text-[14px] p-2"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className=" mb-4 border border-[#777777] rounded-lg w-[452px] h-8 placeholder:text-[#CCCCCC] placeholder:text-[14px] p-2"
          />

          <div className="flex justify-between items-center">
            <button
              onClick={handleGoogleLogin}
              className="border-[#777777] border p-2 rounded-[50%] flex items-center justify-center w-10 h-10"
            >
              <FaGoogle className="text-[#7695EC] w-5 h-5" />
            </button>

            <button
              type="submit"
              disabled={!email || !password}
              className={`w-[111px] uppercase text-white p-1.5 rounded-lg ${
                !email || !password
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary"
              }`}
            >
              Enter
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
      </div>
      <CustomToast />
    </div>
  );
};

export default LoginPage;
