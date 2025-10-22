"use client";

export default function HeaderLogin() {
  return (
    <header className="w-full bg-[#023047] text-white flex justify-between items-center px-6 py-3">
      {/* 🔹 Logo y nombre */}
      <div className="flex items-center space-x-2">
        <img src="/PQRSmart-Logo.png" alt="PQRSmart" className="h-10 w-40" />
      </div>

      {/* 🔹 Idioma */}
      <div className="flex items-center space-x-2">
        <img
          src="https://flagcdn.com/w20/gb.png"
          alt="EN"
          className="h-4 w-6 rounded-sm"
        />
        <span className="text-sm font-medium">EN</span>
      </div>
    </header>
  );
}
