"use client";
import { useEffect, useState } from "react";

type Pqrs = {
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  answeredAt?: Date;
  answer?: string;
  pqrsType: {
    id: number;
    name: string;
  };
};
export default function ViewPqrs({
  onClose,
  pqrs,
}: {
  onClose: () => void;
  pqrs?: Pqrs;
}) {
  const [formData, setFormData] = useState<Pqrs>({
    title: "",
    description: "",
    status: "",
    createdAt: new Date(),
    answeredAt: undefined,
    answer: undefined,
    pqrsType: { id: 0, name: "" },
  });

  useEffect(() => {
    if (pqrs) setFormData(pqrs);
  }, [pqrs]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
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
        <h2 className="text-xl font-semibold text-gray-800 mb-4">View PQRS</h2>

        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Title</label>
            <input
              type="text"
              name="name"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Answer</label>
            <input
              type="text"
              name="answer"
              value={
                formData.status === "ANSWERED"
                  ? formData.answer
                  : formData.status === "PENDING"
                  ? "Pending answer"
                  : "The PQRS has been closed"
              }
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              disabled
            />
          </div>
          {formData.status === "ANSWERED" && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Answered At
              </label>
              <input
                type="text"
                name="anwerdAt"
                value={
                  formData.answeredAt
                    ? new Date(formData.answeredAt).toLocaleDateString()
                    : "Not answered yet"
                }
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                disabled
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Type PQRS
            </label>
            <input
              type="text"
              name="typePqrs"
              value={formData.pqrsType.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              disabled
            />
          </div>
        </form>
      </div>
    </div>
  );
}
