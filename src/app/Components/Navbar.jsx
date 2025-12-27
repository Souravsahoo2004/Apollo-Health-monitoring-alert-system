"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // mock auth
  const [userName] = useState("Patient"); // example user

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO + BRAND */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/Apollo-Logo.jpg"
            alt="Apollo Health"
            width={44}
            height={44}
            className="object-contain"
          />
          <div className="leading-tight">
            <h1 className="text-xl font-bold text-[#2F4FA3]">
             Health Monitoring <br/> System
            </h1>
            
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          {["Home", "Dashboard", "About", "Contact"].map((item) => (
            <li key={item} className="relative group">
              <Link
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="transition-colors group-hover:text-[#2F4FA3]"
              >
                {item}
              </Link>
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[#2F4FA3] transition-all duration-300 group-hover:w-full"></span>
            </li>
          ))}
        </ul>

        {/* RIGHT SIDE AUTH */}
        <div className="hidden md:flex items-center gap-4">

          {!isLoggedIn ? (
            <>
              <Link
                href="/Login"
                className="text-[#2F4FA3] font-medium hover:underline"
              >
                Login
              </Link>

              <Link
                href="/Register"
                className="bg-[#2F4FA3] text-white px-5 py-2 rounded-full hover:bg-[#243f8f] transition shadow-sm"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">
                Welcome, <span className="text-[#2F4FA3]">{userName}</span>
              </span>

              <button
                onClick={() => setIsLoggedIn(false)}
                className="text-sm text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>
          )}

        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl text-[#2F4FA3]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <ul className="flex flex-col items-center gap-6 py-6 text-gray-700 font-medium">

            {["Home", "Dashboard", "About", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-[#2F4FA3]"
                >
                  {item}
                </Link>
              </li>
            ))}

            {!isLoggedIn ? (
              <>
                <Link
                  href="/Login"
                  onClick={() => setMenuOpen(false)}
                  className="text-[#2F4FA3]"
                >
                  Login
                </Link>

                <Link
                  href="/Register"
                  onClick={() => setMenuOpen(false)}
                  className="bg-[#2F4FA3] text-white px-6 py-2 rounded-full"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="text-gray-700">
                  Welcome, <b>{userName}</b>
                </span>

                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setMenuOpen(false);
                  }}
                  className="text-red-500"
                >
                  Logout
                </button>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
