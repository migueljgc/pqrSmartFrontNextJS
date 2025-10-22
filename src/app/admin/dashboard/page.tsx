"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import {
  Building,
  Calendar,
  BarChart3,
  TrendingUp,
  ListTodo,
} from "lucide-react";
import Navbar from "@/app/components/navbar";
import api from "@/app/api/api";
import withAuth from "@/app/utils/withAuth";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function DashboardPageAdmin() {
  const [pqrsData, setPqrsData] = useState<any[]>([]);
  const [totalPQRS, setTotalPQRS] = useState(0);
  const [totalPQRSPorDependencia, setTotalPQRSPorDependencia] = useState<
    Record<string, number>
  >({});
  const [totalPQRSmes, setTotalPQRSmes] = useState<Record<string, number>>({});
  const [totalPQRSDepMes, setTotalPQRSDepMes] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token)
          return console.error("No se encontró el token de autenticación");

        const response = await api.get("/pqrs/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        console.log("Fetched PQRS data:", data);
        setPqrsData(data);
        calcularTotales(data);
      } catch (error) {
        console.error("Error fetching PQRS data:", error);
      }
    };

    fetchData();
  }, []);

  const calcularTotales = (data: any[]) => {
    setTotalPQRS(data.length);

    // Total PQRS por Dependencia
    const dependenciaCount = data.reduce((acc, pqrs) => {
      const dependencia = pqrs.pqrsType?.name || "Sin Dependencia";
      acc[dependencia] = (acc[dependencia] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    setTotalPQRSPorDependencia(dependenciaCount);

    // Total PQRS por Mes
    const pqrsPorMes = data.reduce((acc, pqrs) => {
      const mes = new Date(pqrs.createdAt).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      acc[mes] = (acc[mes] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    setTotalPQRSmes(pqrsPorMes);

    // Total PQRS por Dependencia al Mes
    const pqrsPorDepMes = data.reduce((acc, pqrs) => {
      const mes = new Date(pqrs.createdAt).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      const dependencia = pqrs.pqrsType?.name || "Sin Dependencia";
      const key = `${dependencia} - ${mes}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    setTotalPQRSDepMes(pqrsPorDepMes);
  };

  const dataChartDependencia = {
    labels: Object.keys(totalPQRSPorDependencia),
    datasets: [
      {
        label: "Total PQRS por Dependencia",
        data: Object.values(totalPQRSPorDependencia),
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const dataChartMes = {
    labels: Object.keys(totalPQRSmes),
    datasets: [
      {
        label: "PQRS por Mes",
        data: Object.values(totalPQRSmes),
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const lineChartData = {
    labels: Object.keys(totalPQRSmes),
    datasets: [
      {
        label: "Tendencia de PQRS",
        data: Object.values(totalPQRSmes),
        fill: true,
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderColor: "rgba(34, 197, 94, 1)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center font-sans">
      {/* Header */}
      <header className="w-full bg-green-600 text-white shadow-md">
        <Navbar />
      </header>
      <div className="px-6 py-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-10">
          Panel de Control de PQRS
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Total PQRS */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition">
            <ListTodo className="text-green-500 mb-3" size={36} />
            <h2 className="font-semibold text-gray-700 text-lg">Total PQRS</h2>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {totalPQRS}
            </p>
          </div>

          {/* PQRS por Dependencia */}
          {Object.keys(totalPQRSPorDependencia).length > 0 && (
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-2 mb-3">
                <Building className="text-indigo-500" />
                <h2 className="font-semibold text-gray-700">
                  PQRS por Dependencia
                </h2>
              </div>
              <Bar
                data={dataChartDependencia}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          )}

          {/* PQRS por Mes */}
          {Object.keys(totalPQRSmes).length > 0 && (
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="text-green-500" />
                <h2 className="font-semibold text-gray-700">PQRS por Mes</h2>
              </div>
              <Bar
                data={dataChartMes}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          )}

          {/* PQRS por Dependencia al Mes */}
          {Object.keys(totalPQRSDepMes).length > 0 && (
            <div className="bg-white rounded-2xl shadow-md p-6 col-span-full hover:shadow-lg transition">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="text-purple-500" />
                <h2 className="font-semibold text-gray-700">
                  PQRS por Dependencia al Mes
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {Object.entries(totalPQRSDepMes).map(([key, count]) => (
                  <div
                    key={key}
                    className="bg-gray-100 p-3 rounded-xl flex justify-between"
                  >
                    <span className="font-medium text-gray-600">{key}</span>
                    <span className="text-green-600 font-semibold">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tendencia */}
          {Object.keys(totalPQRSmes).length > 0 && (
            <div className="bg-white rounded-2xl shadow-md p-6 col-span-full hover:shadow-lg transition">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="text-green-500" />
                <h2 className="font-semibold text-gray-700">
                  Tendencia de PQRS
                </h2>
              </div>
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "bottom" } },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default withAuth(DashboardPageAdmin, ["admin"]);
