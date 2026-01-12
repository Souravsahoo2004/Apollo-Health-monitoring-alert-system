"use client";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  updatePassword,
  deleteUser,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    gender: "",
    idNumber: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Convex hooks
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const saveProfileImage = useMutation(api.storage.saveProfileImage);
  const profileImageUrl = useQuery(
    api.storage.getProfileImageUrl,
    user ? { userId: user.uid } : "skip"
  );

  /* Auth check */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        setProfile({
          name: snap.data().name || "",
          gender: snap.data().gender || "",
          idNumber: snap.data().idNumber || "",
        });
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  /* Upload image to Convex */
  const handleImageUpload = async () => {
    if (!imageFile || !user) return;

    setUploading(true);
    try {
      // Step 1: Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": imageFile.type },
        body: imageFile,
      });

      const { storageId } = await result.json();

      // Step 3: Save storage ID in Convex database
      await saveProfileImage({ storageId, userId: user.uid });

      alert("Profile image updated successfully");
      setImageFile(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  /* Update profile */
  const handleProfileUpdate = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), profile);

      await updateProfile(user, {
        displayName: profile.name,
      });

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  /* Update password */
  const handlePasswordUpdate = async () => {
    if (!newPassword) return alert("Enter new password");

    try {
      await updatePassword(user, newPassword);
      setNewPassword("");
      alert("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. You may need to re-login.");
    }
  };

  /* Delete account */
  const handleDeleteAccount = async () => {
    if (!confirm("This will permanently delete your account. Continue?"))
      return;

    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      router.push("/register");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. You may need to re-login.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F8FF] to-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#2F4FA3] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-[#F5F8FF] to-white flex justify-center px-4 py-12"
    >
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#2F4FA3]">
            Doctor Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your personal & security details
          </p>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <img
              src={profileImageUrl || "/avatar.png"}
              className="w-32 h-32 rounded-full object-cover border-4 border-[#E6EDFF] shadow"
              alt="Profile"
            />
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-sm">
              Change Photo
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="text-sm text-gray-600"
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleImageUpload}
            disabled={!imageFile || uploading}
            className="bg-[#2F4FA3] text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </motion.button>
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Personal Information</h3>

        <input
  type="text"
  value={profile.name}
  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
  placeholder="Full Name"
  className="w-full px-4 py-3 border rounded-xl 
  text-gray-900 placeholder:text-gray-500 
  focus:ring-2 focus:ring-[#2F4FA3]/30 focus:border-[#2F4FA3] outline-none"
/>


          <select
            value={profile.gender}
            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2F4FA3]/30 outline-none text-gray-700"
          >
            <option value="" className="text-gray-400">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

         <input
  type="text"
  value={profile.idNumber}
  onChange={(e) =>
    setProfile({ ...profile, idNumber: e.target.value })
  }
  placeholder="Medical ID / License Number"
  className="w-full px-4 py-3 border rounded-xl 
  text-gray-900 placeholder:text-gray-500 
  focus:ring-2 focus:ring-[#2F4FA3]/30 focus:border-[#2F4FA3] outline-none"
/>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleProfileUpdate}
            className="w-full bg-[#2F4FA3] text-white py-3 rounded-xl font-semibold"
          >
            Save Profile
          </motion.button>
        </div>

        {/* Password Section */}
        <div className="border-t pt-6 space-y-3">
          <h3 className="font-semibold text-gray-700">Security Settings</h3>

          <input
  type="password"
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
  placeholder="New Password"
  className="w-full px-4 py-3 border rounded-xl 
  text-gray-900 placeholder:text-gray-500 
  focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none"
/>


          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handlePasswordUpdate}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold"
          >
            Update Password
          </motion.button>
        </div>

        {/* Danger Zone */}
        <div className="border-t pt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleDeleteAccount}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold"
          >
            Delete Account
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
