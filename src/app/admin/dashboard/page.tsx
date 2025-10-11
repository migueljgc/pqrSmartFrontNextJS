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
          <h3 className="text-xl font-bold text-green-700 mb-3">Misión</h3>
          <p className="text-gray-700 leading-relaxed">
            Brindar soluciones efectivas a través de una atención ágil,
            transparente y empática, gestionando cada petición, queja, reclamo y
            sugerencia con el compromiso de mejorar continuamente la experiencia
            de nuestros usuarios.
          </p>
        </section>
      </main>
    </div>
  );
}

export default withAuth(DashboardPageAdmin, ["admin"]);
