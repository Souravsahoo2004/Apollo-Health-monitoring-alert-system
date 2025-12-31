"use client";

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
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow p-8 space-y-6">
        <h1 className="text-2xl font-bold text-[#2F4FA3] text-center">
          Doctor Profile
        </h1>

        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src={profileImageUrl || "/avatar.png"}
            className="w-28 h-28 rounded-full object-cover border"
            alt="Profile"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="mt-3 text-sm"
          />

          <button
            onClick={handleImageUpload}
            disabled={!imageFile || uploading}
            className="mt-2 bg-[#2F4FA3] text-white px-4 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>

        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Full Name"
          className="w-full px-4 py-2 border rounded-lg"
        />

        <select
          value={profile.gender}
          onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Select gender</option>
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
          placeholder="ID Card Number"
          className="w-full px-4 py-2 border rounded-lg"
        />

        <button
          onClick={handleProfileUpdate}
          className="w-full bg-[#2F4FA3] text-white py-2 rounded-lg"
        >
          Save Profile
        </button>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Update Password</h3>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            onClick={handlePasswordUpdate}
            className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg"
          >
            Update Password
          </button>
        </div>

        <div className="border-t pt-4">
          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-600 text-white py-2 rounded-lg"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
