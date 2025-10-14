"use client";
import { useState } from "react";

type FormData = {
  name: string;
  email: string;
  role: string;
  number: string;
  password: string;
};

export default function AddUserModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave?: (data: FormData) => void;
}) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "",
    number: "",
    password: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) onSave(formData);
    console.log("Datos del usuario:", formData);
    onClose(); // Cierra el modal después de guardar
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 ">
      {/* Contenedor del modal */}
      <div className="bg-white rounded-2xl shadow-xl w-96 p-6 relative animate-fade-in">
        {/* Botón para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
        >
          ✕
        </button>

        {/* Contenido del modal */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Agregar Usuario
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <label
              className="absolute left-3 top-3 text-gray-500 text-base transition-all duration-200 
      peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-600
      peer-valid:top-1 peer-valid:text-sm peer-valid:text-green-600"
            >
              Full Name
            </label>
          </div>

          {/* Correo */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <label
              className="absolute left-3 top-3 text-gray-500 text-base transition-all duration-200 
      peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-600
      peer-valid:top-1 peer-valid:text-sm peer-valid:text-green-600"
            >
              Email
            </label>
          </div>

          {/* Número */}
          <div className="relative">
            <input
              type="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <label
              className="absolute left-3 top-3 text-gray-500 text-base transition-all duration-200 
      peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-600
      peer-valid:top-1 peer-valid:text-sm peer-valid:text-green-600"
            >
              Number
            </label>
          </div>

          {/* Contraseña */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <label
              className="absolute left-3 top-3 text-gray-500 text-base transition-all duration-200 
      peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-600
      peer-valid:top-1 peer-valid:text-sm peer-valid:text-green-600"
            >
              Password
            </label>
          </div>

          {/* Rol */}
          <div className="relative">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400 "
              required
            >
              <option value="" disabled hidden></option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="Usuario">Usuario</option>
            </select>
            <label
              className="absolute left-3 top-3 text-gray-500 text-base transition-all duration-200 
      peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-600
      peer-valid:top-1 peer-valid:text-sm peer-valid:text-green-600"
            >
              Role
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
