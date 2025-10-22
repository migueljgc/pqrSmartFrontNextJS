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
    typePqrsId?: string;
  };

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [isOpenAddUser, setIsOpenAddUser] = useState(false);
  const [isOpenEditUser, setIsOpenEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;
  const filteredRecords = users.filter(
    (item) =>
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase())
  );

  // Calcular los índices
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredRecords.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredRecords.length / usersPerPage);

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
    typePqrsId?: string;
  }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token de autenticación:", token);
      if (!token)
        return console.error("No se encontró el token de autenticación");

      if (!selectedUser?.id)
        return console.error("Usuario seleccionado inválido");
      console.log("ID del usuario seleccionado:", data);
      const formData = {
        name: data.name,
        email: data.email,
        number: data.number,
        password: data.password,
        pqrsType: { id: data.typePqrsId },
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
    typePqrsId?: string;
  }) => {
    try {
      let formData: any = {
        fullName: data.name,
        email: data.email,
        role: data.role,
        number: data.number,
        password: data.password,
      };
      if (data.typePqrsId !== "") {
        formData = {
          ...formData,
          pqrsType: { id: data.typePqrsId },
        };
      }
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
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Users</h2>
            <p className="text-gray-500 text-sm">
              Complete list of registered users with their basic information.
            </p>
          </div>

          <button
            onClick={() => setIsOpenAddUser(true)}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Add user
          </button>
          {isOpenAddUser && (
            <AddUserModal
              onClose={() => setIsOpenAddUser(false)}
              onSave={handleNeweUser}
            />
          )}
        </div>
        <div className="relative flex items-center mb-2">
          <input
            type="text"
            placeholder="search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=" w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        {/* Tabla de usuarios */}
        <div className="overflow-hidden border border-gray-200 rounded-lg shadow-lg ma">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  type Pqrs
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {currentUsers.map((filteredRecords: any) => (
                <tr
                  key={filteredRecords.id}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {filteredRecords.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {filteredRecords.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {filteredRecords.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {filteredRecords.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {filteredRecords.pqrsType
                      ? filteredRecords.pqrsType.name
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => {
                        setIsOpenEditUser(true);
                        setSelectedUser(filteredRecords);
                      }}
                      className="text-green-600 hover:text-green-500 font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-gray-500 py-6 text-sm"
                  >
                    There are no registered users.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
        {/* 📄 Paginador */}
        <div className="flex justify-center items-center py-4 space-x-3 bg-gray-50 ">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border text-sm ${
              currentPage === 1
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-green-600 border-green-300 hover:bg-green-100"
            }`}
          >
            Previous
          </button>

          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border text-sm ${
              currentPage === totalPages
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-green-600 border-green-300 hover:bg-green-100"
            }`}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default withAuth(DashboardPageAdmin, ["admin"]);
