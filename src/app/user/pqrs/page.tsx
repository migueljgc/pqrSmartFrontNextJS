"use client";
import NavbarUser from "@/app/components/navbar_user";
import withAuth from "../../utils/withAuth";
import { useEffect, useState } from "react";
import api from "@/app/api/api";
import AddNewPqrsModal from "@/app/components/modals/AddNewPqrsModal";

function DashboardPageUser() {
  type Pqrs = {
    id: number;
    title: string;
    description: string;
    status: string;
    createdAt: Date;
    user: {
      id: number;
      name: string;
    };
    pqrsType: {
      id: number;
      name: string;
    };
  };
  const [pqrs, setPqrs] = useState<Pqrs[]>([]);
  const [isOpenAddPqrs, setIsOpenAddPqrs] = useState(false);
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  useEffect(() => {
    const fetchPqrs = async () => {
      try {
        console.log("Fetching PQRS for User ID:", userId);
        if (!userId) return; // Espera hasta tener el userId
        const token = localStorage.getItem("token");
        if (!token)
          return console.error("No se encontró el token de autenticación");

        const response = await api.get(`/pqrs/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setPqrs(response.data);
          console.log(response.data);
        } else console.error("Error al obtener los usuarios");
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchPqrs();
  }, []);
  const handleNewPqrs = async (data: {
    title: string;
    description: string;
    createdAt: Date;
    typePqrsId?: number;
  }) => {
    try {
      const formData = {
        title: data.title,
        description: data.description,
        status: "PENDING",
        createdAt: new Date(data.createdAt),

        user: {
          id: Number(userId),
        },
        pqrsType: {
          id: data.typePqrsId,
        },
      };
      console.log("Datos enviados para la actualización:", formData);
      const response = await api.post(`/pqrs`, formData);
      console.log("Respuesta de la actualización:", response);

      if (response.status === 201) {
        // Actualiza la lista local con la respuesta del servidor (optimista/definitiva)
        setPqrs((prev: any[]) => [...prev, response.data]);
        alert("PQRS agregada con éxito");
      } else {
        console.error("Error al actualizar el usuario:", response);
      }
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };
  return (
    <div className="min-h-screen bg-white flex flex-col items-center font-sans">
      {/* Header */}
      <header className="w-full bg-green-600 text-white shadow-md">
        <NavbarUser />
      </header>

      {/* Contenido principal */}
      <main className="w-full max-w-6xl mx-auto mt-10 px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">PQRS</h2>
            <p className="text-gray-500 text-sm">
              Lista completa de PQRS registradas a su Usuario.
            </p>
          </div>

          <button
            onClick={() => setIsOpenAddPqrs(true)}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            ingresar nueva PQRS
          </button>
          {isOpenAddPqrs && (
            <AddNewPqrsModal
              onClose={() => setIsOpenAddPqrs(false)}
              onSave={handleNewPqrs}
            />
          )}
        </div>

        {/* Tabla de usuarios */}
        <div className="overflow-hidden border border-gray-200 rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type PQRS
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  create Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {pqrs.map((pqrs: any) => (
                <tr
                  key={pqrs.id}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {pqrs.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {pqrs.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {pqrs.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {pqrs.pqrsType.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {pqrs.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {pqrs.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span
                      className="mr-4 cursor-pointer"
                      title="Datails"
                      onClick={/*() => handleView(pqrs)*/ undefined}
                    >
                      {"🔎"}
                    </span>
                    <span
                      className="mr-4 cursor-pointer cancel-button"
                      title="Cancel"
                      onClick={/*() => handleCancel(pqrs.idRequest)*/ undefined}
                    >
                      {"❌"}
                    </span>
                  </td>
                </tr>
              ))}
              {/*isOpenEditUser && selectedUser && (
                <EditUserModal
                  onClose={() => {
                    setIsOpenEditUser(false);
                    setSelectedUser(null);
                  }}
                  user={selectedUser}
                  onSave={handleSaveUser}
                />
              )*/}

              {pqrs.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-gray-500 py-6 text-sm"
                  >
                    No hay PQRS registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default withAuth(DashboardPageUser, ["user"]);
