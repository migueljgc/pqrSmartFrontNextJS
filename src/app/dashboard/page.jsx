"use client";
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

  return (
    <div>
      <h1>Bienvenido al Dashboard</h1>
      <p>Solo usuarios autenticados pueden ver esta página.</p>

      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          background: "#e63946",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "#d62828")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#e63946")}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

export default withAuth(DashboardPage, ["user"]);
