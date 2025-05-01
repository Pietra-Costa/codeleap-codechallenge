import React from 'react'
import { useAuth } from '../../context/AuthContext';

const Main = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Página Principal</h1>
      <p>Bem-vindo, {user?.email}</p>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 mt-4 rounded">
        Sair
      </button>
    </div>
  );
};


export default Main