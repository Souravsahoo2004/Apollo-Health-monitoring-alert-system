"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const pathname = usePathname();
  const router = useRouter();

  const navItems = ["Home", "Dashboard", "About", "Contact"];

  // Get profile image from Convex
  const profileImageUrl = useQuery(
    api.storage.getProfileImageUrl,
    user ? { userId: user.uid } : "skip"
  );

  const getHref = (item) => (item === "Home" ? "/" : `/${item.toLowerCase()}`);
  const isActive = (item) => pathname === getHref(item);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-[1001] bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/Apollo-Logo.jpg"
            alt="Apollo Health"
            width={44}
            height={44}
            className="object-contain"
          />
          <h1 className="text-xl font-bold text-[#2F4FA3] leading-tight">
            Health Monitoring <br /> System
          </h1>
        </Link>

        <ul className="hidden md:flex items-center gap-8 font-medium">
          {navItems.map((item) => (
            <li key={item} className="relative group">
              <Link
                href={getHref(item)}
                className={`transition-colors ${
                  isActive(item)
                    ? "text-[#2F4FA3] font-semibold"
                    : "text-gray-700 group-hover:text-[#2F4FA3]"
                }`}
              >
                {item}
              </Link>

              <span
                className={`absolute left-0 -bottom-1 h-0.5 bg-[#2F4FA3] transition-all duration-300
                ${isActive(item) ? "w-full" : "w-0 group-hover:w-full"}`}
              />
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link
                href="/login"
                className="text-[#2F4FA3] font-medium hover:underline"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-[#2F4FA3] text-white px-5 py-2 rounded-full hover:bg-[#243f8f] transition shadow-sm"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/profile">
                <img
                  src={profileImageUrl || "/avatar.png"}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="rounded-full border cursor-pointer object-cover"
                  style={{ width: '36px', height: '36px' }}
                />
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-2xl text-[#2F4FA3]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg z-[1001]">
          <ul className="flex flex-col items-center gap-6 py-6 font-medium">
            {navItems.map((item) => (
              <li key={item}>
                <Link
                  href={getHref(item)}
                  onClick={() => setMenuOpen(false)}
                  className={`${
                    isActive(item)
                      ? "text-[#2F4FA3] font-semibold"
                      : "text-gray-700 hover:text-[#2F4FA3]"
                  }`}
                >
                  {item}
                </Link>
              </li>
            ))}

            {!user ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-[#2F4FA3]"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="bg-[#2F4FA3] text-white px-6 py-2 rounded-full"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <img
                    src={profileImageUrl || "/avatar.png"}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full border object-cover"
                    style={{ width: '32px', height: '32px' }}
                  />
                  <span className="text-[#2F4FA3]">Profile</span>
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
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
