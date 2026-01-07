import { useEffect, useState } from "react";
import { 
  collection, onSnapshot, query, orderBy, 
  limit, getDocs 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function usePatients(doctorId) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doctorId) return;
    
    const ref = collection(db, "users", doctorId, "patients");
    const unsub = onSnapshot(ref, async (snap) => {
      const patientsData = await Promise.all(
        snap.docs.map(async (d) => {
          const patientData = { id: d.id, ...d.data() };
          
          const healthRef = collection(
            db, "users", doctorId, "patients", d.id, "healthData"
          );
          const healthQuery = query(
            healthRef, orderBy("timestamp", "desc"), limit(1)
          );
          
          const healthSnap = await getDocs(healthQuery);

          if (!healthSnap.empty) {
            const latestHealthDoc = healthSnap.docs[0];
            patientData.currentStatus = latestHealthDoc.data().status;
            patientData.latestHealthDocId = latestHealthDoc.id;
          } else {
            patientData.currentStatus = "Normal";
            patientData.latestHealthDocId = null;
          }

          return patientData;
        })
      );
      
      setPatients(patientsData);
      setLoading(false);
    });
    return () => unsub();
  }, [doctorId]);

  return { patients, loading };
}
