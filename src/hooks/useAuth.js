import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export function useAuth() {
  const [doctorId, setDoctorId] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setDoctorId(user.uid);
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setDoctorName(snap.data().name);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { doctorId, doctorName, loading };
}
