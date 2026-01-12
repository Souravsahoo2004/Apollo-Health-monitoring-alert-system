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
    
    const healthUnsubscribers = [];
    
    const patientsRef = collection(db, "users", doctorId, "patients");
    
    // Listen to patient collection changes
    const unsubscribePatients = onSnapshot(patientsRef, async (patientsSnap) => {
      // Clear old health listeners
      healthUnsubscribers.forEach(unsub => unsub());
      healthUnsubscribers.length = 0;
      
      const patientsData = [];
      
      for (const patientDoc of patientsSnap.docs) {
        const patientData = { id: patientDoc.id, ...patientDoc.data() };
        
        // Fetch initial health data
        const healthRef = collection(
          db, "users", doctorId, "patients", patientDoc.id, "healthData"
        );
        const healthQuery = query(healthRef, orderBy("timestamp", "desc"), limit(1));
        const healthSnap = await getDocs(healthQuery);

        if (!healthSnap.empty) {
          const latestHealthDoc = healthSnap.docs[0];
          patientData.currentStatus = latestHealthDoc.data().status;
          patientData.latestHealthDocId = latestHealthDoc.id;
        } else {
          patientData.currentStatus = "Normal";
          patientData.latestHealthDocId = null;
        }
        
        patientsData.push(patientData);
        
        // Listen to real-time health data changes for THIS patient
        const unsubHealth = onSnapshot(healthQuery, (healthSnapshot) => {
          if (!healthSnapshot.empty) {
            const latestHealth = healthSnapshot.docs[0];
            const updatedStatus = latestHealth.data().status;
            const updatedHealthDocId = latestHealth.id;
            
            // Update only this patient's status in state
            setPatients(prevPatients => 
              prevPatients.map(p => 
                p.id === patientDoc.id 
                  ? { 
                      ...p, 
                      currentStatus: updatedStatus,
                      latestHealthDocId: updatedHealthDocId 
                    }
                  : p
              )
            );
          }
        });
        
        healthUnsubscribers.push(unsubHealth);
      }
      
      setPatients(patientsData);
      setLoading(false);
    });
    
    // Cleanup function
    return () => {
      unsubscribePatients();
      healthUnsubscribers.forEach(unsub => unsub());
    };
  }, [doctorId]);

  // Export setPatients so parent can do optimistic updates
  return { patients, loading, setPatients };
}
