"use client";
import api from "@/app/api/api";
import { useEffect, useState } from "react";

type FormData = {
  title: string;
  description: string;
  createdAt: Date;
  typePqrsId?: number;
};
type PqrsType = {
  id: number;
  name: string;
};

export default function AddNewPqrsModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave?: (data: FormData) => void;
}) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    createdAt: new Date(),
    typePqrsId: undefined,
  });
  const [typePqrs, setTypePqrs] = useState<PqrsType[]>([]);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) onSave(formData);
    console.log("Datos del usuario:", formData);
    onClose(); // Cierra el modal después de guardar
  };
  const fetchTypePqrs = async () => {
    try {
      const response = await api.get("/pqrs-type");
      if (response.status === 200) {
        setTypePqrs(response.data);
        console.log(response.data);
      } else console.error("Error al obtener los tipos de pqrs");
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };
  useEffect(() => {
    fetchTypePqrs();
  }, []);

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
          Ingresar nueva PQRS
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <label
              className="absolute left-3 top-3 text-gray-500 text-base transition-all duration-200 
      peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-600
      peer-valid:top-1 peer-valid:text-sm peer-valid:text-green-600"
            >
              Title
            </label>
          </div>

          {/* Correo */}
          <div className="relative">
            <textarea
              cols={30}
              rows={10}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            ></textarea>

            <label
              className="absolute left-3 top-3 text-gray-500 text-base transition-all duration-200 
      peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-600
      peer-valid:top-1 peer-valid:text-sm peer-valid:text-green-600"
            >
              Description
            </label>
          </div>
          <div className="relative">
            <select
              name="typePqrsId"
              value={formData.typePqrsId}
              onChange={handleChange}
              className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            >
              <option value=""></option>
              {typePqrs.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <label
              className="absolute left-3 top-3 text-gray-500 text-base transition-all duration-200 
      peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-600
      peer-valid:top-1 peer-valid:text-sm peer-valid:text-green-600"
            >
              Type PQRS
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
