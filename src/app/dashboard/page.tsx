"use client";
import { useState } from "react";
import DropdownMenu from "../components/DropdownMenu";
import Sidebar from "../components/sidebar_admin";
import withAuth from "../utils/withAuth";
import { useRouter } from "next/navigation";

function DashboardPage() {
  const router = useRouter();
  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Seguro que deseas cerrar sesión?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      router.push("/Auth/login");
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <div className="min-h-screen bg-white flex flex-col items-center font-sans">
      {/* Header */}
      <header className="w-full bg-green-600 text-white shadow-md">
        <nav className="flex justify-between items-center max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">PQRSmart</h1>
          <DropdownMenu handleLogout={handleLogout} />
        </nav>
      </header>
      {/* Sidebar importado */}
      <Sidebar isOpen={isSidebarOpen} />

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

export default withAuth(DashboardPage, ["user"]);
