import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Usuário registrado com sucesso:", user);
      navigate("/main");
    } catch (err) {
      console.error("Erro ao criar conta:", err.message);
      setError("Erro ao criar conta. Tente novamente.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white w-[500px] h-auto rounded-2xl p-[24px]">
        <h2 className="text-[22px] font-display font-bold mb-6">
          Create your account!
        </h2>
        <p className="text-[16px] font-normal mb-2">
          Please create a username and a password
        </p>

        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2 border border-[#777777] rounded-lg w-[452px] h-8 placeholder:text-[#CCCCCC] placeholder:text-[14px] p-2"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=" mb-4 border border-[#777777] rounded-lg w-[452px] h-8 placeholder:text-[#CCCCCC] placeholder:text-[14px] p-2"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className={`w-[111px] uppercase text-white p-1.5 rounded-lg ${
                !email || !password
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary"
              }`}
            >
              Create
            </button>
          </div>

          <div className="flex justify-center items-center mt-4">
            <p className="text-[14px] text-[#757575cc]">
              Already have a account?{" "}
              <span className="hover:text-primary">
                {" "}
                <Link to="/"> Sign In</Link>{" "}
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
