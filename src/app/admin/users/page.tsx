"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "../../utils/withAuth";
import DropdownMenu from "../../components/DropdownMenu";
import api from "@/app/api/api";
import Sidebar from "../../components/sidebar_admin";
import { Menu } from "lucide-react";
import Navbar from "@/app/components/navbar";

function DashboardPageAdmin() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Seguro que deseas cerrar sesión?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      router.push("/Auth/login");
    }
  };

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

  return (
    <div className="min-h-screen bg-white flex flex-col items-center font-sans">
      {/* Header */}
      <header className="w-full bg-green-600 text-white shadow-md">
        <Navbar />
      </header>
      {/* Contenido principal */}
      <main className="flex flex-col items-center text-center mt-10 px-4 max-w-3xl">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Bienvenido
        </h2>
        <section className="bg-gray-50 rounded-2xl shadow-md p-8 w-full">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Lista de Usuarios
          </h3>

          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                  ID
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                  name
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                  Email
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                  Rol
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-200">
                    {user.id}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {user.name}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {user.email}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {user.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default withAuth(DashboardPageAdmin, ["admin"]);
