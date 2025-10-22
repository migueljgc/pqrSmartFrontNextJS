"use client";
import withAuth from "../../utils/withAuth";
import Navbar from "@/app/components/navbar";

function HomePageAdmin() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center font-sans">
      {/* Header */}
      <header className="w-full bg-green-600 text-white shadow-md">
        <Navbar />
      </header>
      {/* Contenido principal */}
      <main className="flex flex-col items-center text-center mt-10 px-4 max-w-3xl">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">Welcom</h2>

        <section className="bg-gray-50 rounded-2xl shadow-md p-8 w-full">
          <h3 className="text-xl font-bold text-green-700 mb-3">Misión</h3>
          <p className="text-gray-700 leading-relaxed">
            Provide effective solutions through prompt, transparent, and
            empathetic service, managing every request, complaint, claim, and
            suggestion with a commitment to continuously improve our users'
            experience.
          </p>
        </section>
      </main>
    </div>
  );
}

export default withAuth(HomePageAdmin, ["admin"]);
