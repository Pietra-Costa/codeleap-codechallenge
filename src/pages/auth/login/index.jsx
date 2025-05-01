import { useNavigate } from 'react-router-dom'; // 👈 add isso
import { useEffect, useState } from 'react';
import { auth } from '../../../firebase/firebaseConfig';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { useAuth } from '../../../context/AuthContext';

const LoginPage = () => {
  const { user, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    if (user) navigate('/main');
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      setError('Erro ao fazer login');
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError('Erro no login com Google');
      console.error(error);
    }
  };

  if (user) return null; 

  return (
    <div className="bg-[#DDDDDD]">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border"
        />
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Entrar
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="mt-4 bg-gray-700 text-white px-4 py-2 rounded"
      >
        Entrar com Google
      </button>
    </div>
  );
};

export default LoginPage;
