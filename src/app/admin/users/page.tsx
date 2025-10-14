"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "../../utils/withAuth";
import api from "@/app/api/api";
import Navbar from "@/app/components/navbar";
import AddUserModal from "@/app/components/modals/AddUserModal";
import EditUserModal from "@/app/components/modals/EditUserModal";

function DashboardPageAdmin() {
  const router = useRouter();
  type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    password?: string;
    number?: string;
  };

  const [users, setUsers] = useState<User[]>([]);
  const [isOpenAddUser, setIsOpenAddUser] = useState(false);
  const [isOpenEditUser, setIsOpenEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token)
          return console.error("No se encontró el token de autenticación");

        const response = await api.get("/users/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) setUsers(response.data);
        else console.error("Error al obtener los usuarios");
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchUsers();
  }, []);
  const handleSaveUser = async (data: {
    name: string;
    email: string;
    number?: string;
    password?: string;
  }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token de autenticación:", token);
      if (!token)
        return console.error("No se encontró el token de autenticación");

      if (!selectedUser?.id)
        return console.error("Usuario seleccionado inválido");

      const formData = {
        name: data.name,
        email: data.email,
        number: data.number,
        password: data.password,
      };
      console.log("Datos enviados para la actualización:", formData);
      const response = await api.put(`/users/${selectedUser.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Respuesta de la actualización:", response);

      if (response.status === 200) {
        // Actualiza la lista local con la respuesta del servidor (optimista/definitiva)
        setUsers((prev: any[]) =>
          prev.map((u) => (u.id === selectedUser.id ? response.data : u))
        );
      } else {
        console.error("Error al actualizar el usuario:", response);
      }
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    } finally {
      setIsOpenAddUser(false);
    }
  };
  const handleNeweUser = async (data: {
    name: string;
    email: string;
    role: string;
    number: string;
    password: string;
  }) => {
    try {
      const formData = {
        fullName: data.name,
        email: data.email,
        role: data.role,
        number: data.number,
        password: data.password,
      };
      console.log("Datos enviados para la actualización:", formData);
      const response = await api.post(`/auth/admin/register`, formData);
      console.log("Respuesta de la actualización:", response);

      if (response.status === 201) {
        // Actualiza la lista local con la respuesta del servidor (optimista/definitiva)
        setUsers((prev: any[]) => [...prev, response.data]);
        alert("Usuario creado con éxito");
      } else {
        console.error("Error al actualizar el usuario:", response);
      }
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    } finally {
      setIsOpenEditUser(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center font-sans">
      {/* Header */}
      <header className="w-full bg-green-600 text-white shadow-md">
        <Navbar />
      </header>

      {/* Contenido principal */}
      <main className="w-full max-w-6xl mx-auto mt-10 px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Usuarios</h2>
            <p className="text-gray-500 text-sm">
              Lista completa de usuarios registrados con su información básica.
            </p>
          </div>

          <button
            onClick={() => setIsOpenAddUser(true)}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Agregar usuario
          </button>
          {isOpenAddUser && (
            <AddUserModal
              onClose={() => setIsOpenAddUser(false)}
              onSave={handleNeweUser}
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
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acción
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((user: any) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => {
                        setIsOpenEditUser(true);
                        setSelectedUser(user);
                      }}
                      className="text-green-600 hover:text-green-500 font-medium"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
              {isOpenEditUser && selectedUser && (
                <EditUserModal
                  onClose={() => {
                    setIsOpenEditUser(false);
                    setSelectedUser(null);
                  }}
                  user={selectedUser}
                  onSave={handleSaveUser}
                />
              )}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-gray-500 py-6 text-sm"
                  >
                    No hay usuarios registrados.
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

export default withAuth(DashboardPageAdmin, ["admin"]);
