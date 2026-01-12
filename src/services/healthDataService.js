import { 
  collection, query, orderBy, getDocs, 
  doc, updateDoc, deleteDoc, Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const healthDataService = {
  async fetchPatientHealthData(doctorId, patientId) {
    const healthRef = collection(db, "users", doctorId, "patients", patientId, "healthData");
    const healthQuery = query(healthRef, orderBy("timestamp", "desc"));
    const healthSnap = await getDocs(healthQuery);

    return healthSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  async updateHealthData(doctorId, patientId, healthDataId, updatedData) {
    const healthDocRef = doc(
      db, "users", doctorId, "patients", patientId, "healthData", healthDataId
    );

    await updateDoc(healthDocRef, {
      ...updatedData,
      timestamp: Timestamp.now(),
    });
  },

  async deleteHealthDataEntry(doctorId, patientId, healthDataId) {
    const healthDocRef = doc(
      db, "users", doctorId, "patients", patientId, "healthData", healthDataId
    );
    await deleteDoc(healthDocRef);
  },

  async updatePatientHealthStatus(doctorId, patientId, healthDocId, newStatus) {
    const healthDocRef = doc(
      db, "users", doctorId, "patients", patientId, "healthData", healthDocId
    );
    
    await updateDoc(healthDocRef, {
      status: newStatus,
      timestamp: Timestamp.now(),
    });
  }
};
