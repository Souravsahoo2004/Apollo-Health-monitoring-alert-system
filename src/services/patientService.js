import { 
  collection, addDoc, updateDoc, deleteDoc, 
  doc, Timestamp, getDocs 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const patientService = {
  async addPatient(doctorId, patientData, healthData) {
    const ref = await addDoc(
      collection(db, "users", doctorId, "patients"), 
      {
        ...patientData,
        age: Number(patientData.age),
        createdAt: Timestamp.now(),
        isEdited: false,
        activeStatus: "Active",
      }
    );

    await addDoc(
      collection(db, "users", doctorId, "patients", ref.id, "healthData"),
      { ...healthData, timestamp: Timestamp.now() }
    );

    return ref.id;
  },

  async updatePatient(doctorId, patientId, patientData) {
    const patientRef = doc(db, "users", doctorId, "patients", patientId);
    await updateDoc(patientRef, {
      ...patientData,
      age: Number(patientData.age),
      updatedAt: Timestamp.now(),
      isEdited: true,
    });
  },

  async updatePatientActiveStatus(doctorId, patientId, activeStatus) {
    const patientRef = doc(db, "users", doctorId, "patients", patientId);
    await updateDoc(patientRef, {
      activeStatus: activeStatus,
      updatedAt: Timestamp.now(),
    });
  },

  async deletePatient(doctorId, patientId) {
    const healthRef = collection(db, "users", doctorId, "patients", patientId, "healthData");
    const healthSnapshot = await getDocs(healthRef);
    
    const deleteHealthPromises = healthSnapshot.docs.map((healthDoc) =>
      deleteDoc(doc(db, "users", doctorId, "patients", patientId, "healthData", healthDoc.id))
    );
    
    await Promise.all(deleteHealthPromises);
    
    const patientRef = doc(db, "users", doctorId, "patients", patientId);
    await deleteDoc(patientRef);
  }
};
