"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function DoctorDashboard() {
  const [doctorId, setDoctorId] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Active");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [showHealthDataModal, setShowHealthDataModal] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [healthDataList, setHealthDataList] = useState([]);
  const [selectedPatientName, setSelectedPatientName] = useState("");

  const [patientForm, setPatientForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    familyEmail: "",
  });

  const [healthForm, setHealthForm] = useState({
    heartRate: "",
    bloodPressure: "",
    oxygen: "",
    temperature: "",
    status: "Normal",
  });

  const [editingHealthData, setEditingHealthData] = useState(null);

  /* AUTH */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setDoctorId(user.uid);
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setDoctorName(snap.data().name);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /* FETCH PATIENTS WITH LATEST HEALTH STATUS */
  useEffect(() => {
    if (!doctorId) return;
    const ref = collection(db, "users", doctorId, "patients");
    const unsub = onSnapshot(ref, async (snap) => {
      const patientsData = await Promise.all(
        snap.docs.map(async (d) => {
          const patientData = { id: d.id, ...d.data() };
          
          const healthRef = collection(
            db,
            "users",
            doctorId,
            "patients",
            d.id,
            "healthData"
          );
          const healthQuery = query(
            healthRef,
            orderBy("timestamp", "desc"),
            limit(1)
          );
          
          const healthSnap = await getDocs(healthQuery);

          if (!healthSnap.empty) {
            const latestHealthDoc = healthSnap.docs[0];
            const healthDocId = latestHealthDoc.id;
            const healthData = latestHealthDoc.data();
            
            patientData.currentStatus = healthData.status;
            patientData.latestHealthDocId = healthDocId;
          } else {
            patientData.currentStatus = "Normal";
            patientData.latestHealthDocId = null;
          }

          return patientData;
        })
      );
      
      setPatients(patientsData);
    });
    return () => unsub();
  }, [doctorId]);

  /* FETCH ALL HEALTH DATA FOR A PATIENT */
  const fetchPatientHealthData = async (patientId, patientName) => {
    try {
      const healthRef = collection(db, "users", doctorId, "patients", patientId, "healthData");
      const healthQuery = query(healthRef, orderBy("timestamp", "desc"));
      const healthSnap = await getDocs(healthQuery);

      const healthData = healthSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHealthDataList(healthData);
      setCurrentPatientId(patientId);
      setSelectedPatientName(patientName);
      setShowHealthDataModal(true);
    } catch (error) {
      console.error("❌ Error fetching health data:", error);
      alert("Failed to fetch health data: " + error.message);
    }
  };

  /* UPDATE HEALTH DATA */
  const updateHealthData = async (healthDataId, updatedData) => {
    try {
      const healthDocRef = doc(
        db,
        "users",
        doctorId,
        "patients",
        currentPatientId,
        "healthData",
        healthDataId
      );

      await updateDoc(healthDocRef, {
        ...updatedData,
        timestamp: Timestamp.now(),
      });

      alert("✅ Health data updated successfully!");
      
      const patient = patients.find(p => p.id === currentPatientId);
      if (patient) {
        fetchPatientHealthData(currentPatientId, patient.name);
      }
      
      setEditingHealthData(null);
    } catch (error) {
      console.error("❌ Error updating health data:", error);
      alert("Failed to update health data: " + error.message);
    }
  };

  /* DELETE HEALTH DATA ENTRY */
  const deleteHealthDataEntry = async (healthDataId) => {
    const confirmed = confirm("Are you sure you want to delete this health record?");
    if (!confirmed) return;

    try {
      const healthDocRef = doc(
        db,
        "users",
        doctorId,
        "patients",
        currentPatientId,
        "healthData",
        healthDataId
      );

      await deleteDoc(healthDocRef);
      alert("✅ Health record deleted successfully!");
      
      const patient = patients.find(p => p.id === currentPatientId);
      if (patient) {
        fetchPatientHealthData(currentPatientId, patient.name);
      }
    } catch (error) {
      console.error("❌ Error deleting health data:", error);
      alert("Failed to delete health record: " + error.message);
    }
  };

  /* UPDATE PATIENT STATUS */
  const updatePatientStatus = async (patientId, newStatus) => {
    try {
      const patient = patients.find((p) => p.id === patientId);
      
      if (!patient) {
        console.error("❌ Patient not found in state");
        return;
      }

      if (patient.activeStatus === "Discharged") {
        alert("Cannot update health status of discharged patients!");
        return;
      }
      
      if (!patient.latestHealthDocId) {
        alert("No health data found for this patient. Please add health data first.");
        return;
      }
      
      const healthDocRef = doc(
        db,
        "users",
        doctorId,
        "patients",
        patientId,
        "healthData",
        patient.latestHealthDocId
      );
      
      await updateDoc(healthDocRef, {
        status: newStatus,
        timestamp: Timestamp.now(),
      });
      
      setPatients((prev) =>
        prev.map((p) =>
          p.id === patientId ? { ...p, currentStatus: newStatus } : p
        )
      );
      
    } catch (error) {
      console.error("❌ Error updating status:", error);
      alert("Failed to update status: " + error.message);
    }
  };

  /* UPDATE PATIENT ACTIVE/DISCHARGED STATUS */
  const updatePatientActiveStatus = async (patientId, activeStatus) => {
    try {
      const patientRef = doc(db, "users", doctorId, "patients", patientId);
      await updateDoc(patientRef, {
        activeStatus: activeStatus,
        updatedAt: Timestamp.now(),
      });
      
      setPatients((prev) =>
        prev.map((p) =>
          p.id === patientId ? { ...p, activeStatus: activeStatus } : p
        )
      );

      if (activeStatus === "Discharged") {
        alert("Patient has been discharged. Editing is now disabled. You can delete this patient record.");
      }
      
    } catch (error) {
      console.error("❌ Error updating active status:", error);
      alert("Failed to update patient status: " + error.message);
    }
  };

  /* DELETE PATIENT - COMPLETELY FROM DATABASE */
  const deletePatient = async (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    
    if (patient.activeStatus !== "Discharged") {
      alert("Only discharged patients can be deleted!");
      return;
    }
    
    const confirmed = confirm(
      `⚠️ WARNING: This will permanently delete ${patient.name} and ALL their health records!\n\nThis action cannot be undone. Are you sure?`
    );
    
    if (!confirmed) return;
    
    try {
      const healthRef = collection(db, "users", doctorId, "patients", patientId, "healthData");
      const healthSnapshot = await getDocs(healthRef);
      
      const deleteHealthPromises = healthSnapshot.docs.map((healthDoc) =>
        deleteDoc(doc(db, "users", doctorId, "patients", patientId, "healthData", healthDoc.id))
      );
      
      await Promise.all(deleteHealthPromises);
      
      const patientRef = doc(db, "users", doctorId, "patients", patientId);
      await deleteDoc(patientRef);
      
      alert("✅ Patient and all health records deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting patient:", error);
      alert("Failed to delete patient: " + error.message);
    }
  };

  /* VALIDATIONS */
  const validatePatient = () => {
    const { name, age, gender, phone, familyEmail } = patientForm;

    if (!name || /\d/.test(name)) return alert("Name cannot contain numbers");
    if (!age || isNaN(age)) return alert("Age must be a number");
    if (!gender) return alert("Select gender");
    if (!/^\d{10}$/.test(phone)) return alert("Phone must be 10 digits");
    if (!familyEmail) return alert("Family email required");

    return true;
  };

  const validateHealth = () => {
    const { heartRate, bloodPressure, oxygen, temperature } = healthForm;
    if (
      heartRate === "" ||
      bloodPressure === "" ||
      oxygen === "" ||
      temperature === ""
    ) {
      alert("Health fields cannot be empty. Use 0 if not needed.");
      return false;
    }
    return true;
  };

  /* EDIT PATIENT */
  const handleEditPatient = (patient) => {
    if (patient.activeStatus === "Discharged") {
      alert("Cannot edit discharged patients! Change status to Active first if you need to edit.");
      return;
    }

    setIsEditMode(true);
    setCurrentPatientId(patient.id);
    setPatientForm({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      familyEmail: patient.familyEmail,
    });
    setShowPatientForm(true);
  };

  /* SAVE ONLY PATIENT INFO (NO HEALTH FORM FOR EDIT MODE) */
  const savePatientInfo = async () => {
    if (!validatePatient()) return;

    try {
      const patientRef = doc(db, "users", doctorId, "patients", currentPatientId);
      await updateDoc(patientRef, {
        ...patientForm,
        age: Number(patientForm.age),
        updatedAt: Timestamp.now(),
        isEdited: true,
      });

      alert("✅ Patient information updated successfully!");
      closeModal();
    } catch (error) {
      console.error("❌ Error updating patient:", error);
      alert("Failed to update patient: " + error.message);
    }
  };

  /* NEXT TO HEALTH FORM (ONLY FOR NEW PATIENTS) */
  const goToHealthForm = () => {
    if (!validatePatient()) return;
    setShowPatientForm(false);
    setShowHealthForm(true);
  };

  /* GO BACK TO PATIENT FORM */
  const goBackToPatientForm = () => {
    setShowHealthForm(false);
    setShowPatientForm(true);
  };

  /* SAVE NEW PATIENT AND HEALTH DATA */
  const savePatientAndHealth = async () => {
    if (!validateHealth()) return;

    try {
      const ref = await addDoc(collection(db, "users", doctorId, "patients"), {
        ...patientForm,
        age: Number(patientForm.age),
        createdAt: Timestamp.now(),
        isEdited: false,
        activeStatus: "Active",
      });

      await addDoc(
        collection(db, "users", doctorId, "patients", ref.id, "healthData"),
        {
          ...healthForm,
          timestamp: Timestamp.now(),
        }
      );

      alert("✅ New patient added successfully!");
      closeModal();
    } catch (error) {
      console.error("❌ Error saving patient:", error);
      alert("Failed to save patient: " + error.message);
    }
  };

  /* CLOSE MODAL */
  const closeModal = () => {
    setShowPatientForm(false);
    setShowHealthForm(false);
    setShowHealthDataModal(false);
    setIsEditMode(false);
    setCurrentPatientId(null);
    setEditingHealthData(null);
    setPatientForm({
      name: "",
      age: "",
      gender: "",
      phone: "",
      familyEmail: "",
    });
    setHealthForm({
      heartRate: "",
      bloodPressure: "",
      oxygen: "",
      temperature: "",
      status: "Normal",
    });
  };

  const filteredPatients = patients.filter(
    (p) => (p.activeStatus || "Active") === filterStatus
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* MODERN HEADER WITH GRADIENT - RESPONSIVE */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Mobile Header */}
          <div className="flex md:hidden justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Doctor Dashboard
              </h1>
              <p className="text-blue-100 text-sm flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Dr. {doctorName}
              </p>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2 tracking-tight">
                Doctor Dashboard
              </h1>
              <p className="text-blue-100 text-base lg:text-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Welcome, Dr. {doctorName}
              </p>
            </div>

            <div className="flex items-center gap-3 lg:gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl font-semibold cursor-pointer hover:bg-white/20 transition-all outline-none text-sm lg:text-base"
              >
                <option value="Active" className="text-gray-800">
                  👥 Active
                </option>
                <option value="Discharged" className="text-gray-800">
                  📋 Discharged
                </option>
              </select>

              <button
                onClick={() => {
                  setIsEditMode(false);
                  setShowPatientForm(true);
                }}
                className="group bg-white text-blue-600 px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 text-sm lg:text-base"
              >
                <span className="text-xl lg:text-2xl group-hover:rotate-90 transition-transform duration-300">+</span>
                <span className="hidden sm:inline">Add Patient</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-3 pb-2">
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-4 py-3 rounded-xl font-semibold cursor-pointer outline-none"
              >
                <option value="Active" className="text-gray-800">
                  👥 Active Patients
                </option>
                <option value="Discharged" className="text-gray-800">
                  📋 Discharged Patients
                </option>
              </select>

              <button
                onClick={() => {
                  setIsEditMode(false);
                  setShowPatientForm(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full group bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">+</span>
                Add New Patient
              </button>
            </div>
          )}
        </div>
      </div>

      {/* STATS CARDS - RESPONSIVE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-6 mb-6 sm:mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">Total</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{patients.length}</p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-4 rounded-full">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">Active</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                  {patients.filter(p => (p.activeStatus || "Active") === "Active").length}
                </p>
              </div>
              <div className="bg-green-100 p-2 sm:p-4 rounded-full">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">Discharged</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                  {patients.filter(p => p.activeStatus === "Discharged").length}
                </p>
              </div>
              <div className="bg-purple-100 p-2 sm:p-4 rounded-full">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">Critical</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                  {patients.filter(p => p.currentStatus === "Critical").length}
                </p>
              </div>
              <div className="bg-red-100 p-2 sm:p-4 rounded-full">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PATIENT CARDS GRID - RESPONSIVE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          {filterStatus === "Active" ? "Active Patients" : "Discharged Patients"} ({filteredPatients.length})
        </h2>
        
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              No {filterStatus} Patients
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
              {filterStatus === "Active" 
                ? "Add your first patient to get started" 
                : "No patients have been discharged yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPatients.map((p) => {
              const isDischarged = (p.activeStatus || "Active") === "Discharged";
              
              return (
                <div
                  key={p.id}
                  onClick={() => fetchPatientHealthData(p.id, p.name)}
                  className={`group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border transform hover:-translate-y-1 cursor-pointer ${
                    isDischarged 
                      ? "border-red-200 opacity-90" 
                      : "border-gray-100 hover:border-blue-200"
                  }`}
                >
                  <div className={`relative p-4 sm:p-6 border-b border-gray-100 ${
                    isDischarged 
                      ? "bg-gradient-to-br from-gray-50 to-gray-100" 
                      : "bg-gradient-to-br from-blue-50 to-purple-50"
                  }`}>
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1 sm:gap-2" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={p.activeStatus || "Active"}
                        onChange={(e) => updatePatientActiveStatus(p.id, e.target.value)}
                        className={`text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium border-2 cursor-pointer transition-all outline-none ${
                          isDischarged
                            ? "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                            : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        }`}
                      >
                        <option value="Active">Active</option>
                        <option value="Discharged">Discharged</option>
                      </select>

                      <button
                        onClick={() => deletePatient(p.id)}
                        disabled={!isDischarged}
                        className={`p-1.5 sm:p-2 rounded-full transition-all ${
                          isDischarged
                            ? "bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                        }`}
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {p.isEdited && !isDischarged && (
                      <span className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium shadow-md">
                        Edited
                      </span>
                    )}
                    
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 mt-6 sm:mt-8">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg ${
                        isDischarged 
                          ? "bg-gradient-to-br from-gray-400 to-gray-600" 
                          : "bg-gradient-to-br from-blue-500 to-purple-600"
                      }`}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className={`text-lg sm:text-xl font-bold transition-colors ${
                          isDischarged 
                            ? "text-gray-600" 
                            : "text-gray-800 group-hover:text-blue-600"
                        }`}>
                          {p.name}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isDischarged ? "bg-gray-400" : "bg-green-400"
                          }`}></span>
                          {isDischarged ? "Discharged" : "Active"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className={`rounded-lg p-3 ${isDischarged ? "bg-gray-100" : "bg-gray-50"}`}>
                        <p className="text-xs text-gray-500 font-medium mb-1">Age</p>
                        <p className="text-base sm:text-lg font-bold text-gray-800">{p.age}</p>
                      </div>
                      <div className={`rounded-lg p-3 ${isDischarged ? "bg-gray-100" : "bg-gray-50"}`}>
                        <p className="text-xs text-gray-500 font-medium mb-1">Gender</p>
                        <p className="text-base sm:text-lg font-bold text-gray-800">{p.gender}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="font-medium truncate">{p.phone}</span>
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-2">
                        Health Status
                      </label>
                      <select
                        value={p.currentStatus || "Normal"}
                        onChange={(e) => updatePatientStatus(p.id, e.target.value)}
                        disabled={isDischarged}
                        className={`w-full p-2.5 sm:p-3 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 outline-none ring-2 ${
                          isDischarged
                            ? "bg-gray-100 text-gray-500 ring-gray-200 cursor-not-allowed"
                            : p.currentStatus === "Critical"
                            ? "bg-red-50 text-red-700 ring-red-200 hover:ring-red-300 hover:bg-red-100 cursor-pointer"
                            : "bg-green-50 text-green-700 ring-green-200 hover:ring-green-300 hover:bg-green-100 cursor-pointer"
                        }`}
                      >
                        <option value="Normal" className="bg-white text-green-700">
                          ✓ Normal
                        </option>
                        <option value="Critical" className="bg-white text-red-700">
                          ⚠ Critical
                        </option>
                      </select>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPatient(p);
                      }}
                      disabled={isDischarged}
                      className={`w-full py-2.5 sm:py-3 px-4 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                        isDischarged
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-60"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:-translate-y-0.5"
                      }`}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isDischarged ? "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" : "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"} />
                      </svg>
                      <span className="hidden sm:inline">{isDischarged ? "Editing Disabled" : "Edit Details"}</span>
                      <span className="sm:hidden">{isDischarged ? "Locked" : "Edit"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Continue with modals in next part... */}
      
      {/* HEALTH DATA MODAL - RESPONSIVE */}
      {showHealthDataModal && (
        <Modal
          title={`${selectedPatientName}'s Health Records`}
          onClose={closeModal}
          size="large"
        >
          <div className="space-y-4 sm:space-y-6">
            {healthDataList.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm sm:text-base text-gray-500">No health records found for this patient.</p>
              </div>
            ) : (
              healthDataList.map((healthData, index) => (
                <div
                  key={healthData.id}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-blue-100"
                >
                  {editingHealthData?.id === healthData.id ? (
                    /* EDIT MODE - RESPONSIVE */
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg font-bold text-gray-800">Editing Record #{healthDataList.length - index}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <Input
                          label="Heart Rate"
                          placeholder="bpm"
                          value={editingHealthData.heartRate}
                          onChange={(e) =>
                            setEditingHealthData({ ...editingHealthData, heartRate: e.target.value })
                          }
                          icon="❤️"
                        />
                        <Input
                          label="Blood Pressure"
                          placeholder="mmHg"
                          value={editingHealthData.bloodPressure}
                          onChange={(e) =>
                            setEditingHealthData({ ...editingHealthData, bloodPressure: e.target.value })
                          }
                          icon="💉"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <Input
                          label="Oxygen Level"
                          placeholder="%"
                          value={editingHealthData.oxygen}
                          onChange={(e) =>
                            setEditingHealthData({ ...editingHealthData, oxygen: e.target.value })
                          }
                          icon="🫁"
                        />
                        <Input
                          label="Temperature"
                          placeholder="°F"
                          value={editingHealthData.temperature}
                          onChange={(e) =>
                            setEditingHealthData({ ...editingHealthData, temperature: e.target.value })
                          }
                          icon="🌡️"
                        />
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-2">
                          Health Status
                        </label>
                        <select
                          value={editingHealthData.status}
                          className="w-full border-2 border-gray-200 p-2.5 sm:p-3 rounded-xl text-sm sm:text-base text-gray-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          onChange={(e) =>
                            setEditingHealthData({ ...editingHealthData, status: e.target.value })
                          }
                        >
                          <option value="Normal">✓ Normal</option>
                          <option value="Critical">⚠ Critical</option>
                        </select>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                        <button
                          onClick={() => setEditingHealthData(null)}
                          className="flex-1 bg-gray-200 text-gray-700 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-300 transition-all duration-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => updateHealthData(healthData.id, {
                            heartRate: editingHealthData.heartRate,
                            bloodPressure: editingHealthData.bloodPressure,
                            oxygen: editingHealthData.oxygen,
                            temperature: editingHealthData.temperature,
                            status: editingHealthData.status,
                          })}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* VIEW MODE - RESPONSIVE */
                    <>
                      <div className="flex justify-between items-start mb-3 sm:mb-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-800">Health Record #{healthDataList.length - index}</h3>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {healthData.timestamp?.toDate().toLocaleString('en-IN', {
                              dateStyle: 'short',
                              timeStyle: 'short'
                            })}
                          </p>
                        </div>
                        <div className="flex gap-1 sm:gap-2">
                          <button
                            onClick={() => setEditingHealthData(healthData)}
                            className="p-1.5 sm:p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                          >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4">
                          <p className="text-xs text-gray-500 mb-1">❤️ Heart Rate</p>
                          <p className="text-base sm:text-xl font-bold text-gray-800">{healthData.heartRate} <span className="text-xs sm:text-sm font-normal">bpm</span></p>
                        </div>
                        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4">
                          <p className="text-xs text-gray-500 mb-1">💉 BP</p>
                          <p className="text-base sm:text-xl font-bold text-gray-800">{healthData.bloodPressure}</p>
                        </div>
                        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4">
                          <p className="text-xs text-gray-500 mb-1">🫁 Oxygen</p>
                          <p className="text-base sm:text-xl font-bold text-gray-800">{healthData.oxygen}<span className="text-xs sm:text-sm font-normal">%</span></p>
                        </div>
                        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4">
                          <p className="text-xs text-gray-500 mb-1">🌡️ Temp</p>
                          <p className="text-base sm:text-xl font-bold text-gray-800">{healthData.temperature}<span className="text-xs sm:text-sm font-normal">°F</span></p>
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-4">
                        <span className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold ${
                          healthData.status === "Critical"
                            ? "bg-red-500 text-white"
                            : "bg-green-500 text-white"
                        }`}>
                          {healthData.status === "Critical" ? "⚠️ Critical" : "✓ Normal"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </Modal>
      )}

      {/* MODAL - PATIENT FORM - RESPONSIVE */}
      {showPatientForm && (
        <Modal
          title={isEditMode ? "Edit Patient" : "Add New Patient"}
          onClose={closeModal}
        >
          <div className="space-y-4 sm:space-y-5">
            <Input
              label="Full Name"
              placeholder="Enter patient's full name"
              value={patientForm.name}
              onChange={(e) =>
                setPatientForm({ ...patientForm, name: e.target.value })
              }
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Age"
                type="number"
                placeholder="Age"
                value={patientForm.age}
                onChange={(e) =>
                  setPatientForm({ ...patientForm, age: e.target.value })
                }
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />

              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-2">
                  Gender
                </label>
                <select
                  value={patientForm.gender}
                  className="w-full border-2 border-gray-200 p-2.5 sm:p-3 rounded-xl text-sm sm:text-base text-gray-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  onChange={(e) =>
                    setPatientForm({ ...patientForm, gender: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <Input
              label="Phone Number"
              placeholder="10 digit number"
              maxLength={10}
              value={patientForm.phone}
              onChange={(e) =>
                setPatientForm({ ...patientForm, phone: e.target.value })
              }
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
            />
            
            <Input
              label="Family Email"
              placeholder="example@email.com"
              value={patientForm.familyEmail}
              onChange={(e) =>
                setPatientForm({ ...patientForm, familyEmail: e.target.value })
              }
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            {isEditMode ? (
              <button
                onClick={savePatientInfo}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Update Patient
              </button>
            ) : (
              <button
                onClick={goToHealthForm}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Continue to Health Data
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* MODAL - HEALTH FORM - RESPONSIVE */}
      {showHealthForm && (
        <Modal
          title="Add Health Data"
          onClose={closeModal}
        >
          <div className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                label="Heart Rate"
                placeholder="bpm"
                value={healthForm.heartRate}
                onChange={(e) =>
                  setHealthForm({ ...healthForm, heartRate: e.target.value })
                }
                icon="❤️"
              />
              <Input
                label="Blood Pressure"
                placeholder="mmHg"
                value={healthForm.bloodPressure}
                onChange={(e) =>
                  setHealthForm({ ...healthForm, bloodPressure: e.target.value })
                }
                icon="💉"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                label="Oxygen Level"
                placeholder="%"
                value={healthForm.oxygen}
                onChange={(e) =>
                  setHealthForm({ ...healthForm, oxygen: e.target.value })
                }
                icon="🫁"
              />
              <Input
                label="Temperature"
                placeholder="°F"
                value={healthForm.temperature}
                onChange={(e) =>
                  setHealthForm({ ...healthForm, temperature: e.target.value })
                }
                icon="🌡️"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-2">
                Initial Health Status
              </label>
              <select
                value={healthForm.status}
                className="w-full border-2 border-gray-200 p-2.5 sm:p-3 rounded-xl text-sm sm:text-base text-gray-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                onChange={(e) =>
                  setHealthForm({ ...healthForm, status: e.target.value })
                }
              >
                <option value="Normal">✓ Normal</option>
                <option value="Critical">⚠ Critical</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
              <button
                onClick={goBackToPatientForm}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-200 transition-all duration-300"
              >
                ← Back
              </button>
              <button
                onClick={savePatientAndHealth}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Save Patient
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* MODAL COMPONENT - RESPONSIVE */
function Modal({ title, children, onClose, size = "normal" }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className={`bg-white rounded-2xl sm:rounded-3xl w-full ${size === "large" ? "max-w-5xl" : "max-w-2xl"} max-h-[90vh] overflow-hidden shadow-2xl transform animate-slideUp`}>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-bold truncate">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors duration-200 flex-shrink-0 ml-2"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 sm:p-8 overflow-y-auto max-h-[calc(90vh-60px)] sm:max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

/* INPUT COMPONENT - RESPONSIVE */
function Input({ label, placeholderColor = "blue", icon, ...props }) {
  return (
    <div>
      <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {typeof icon === 'string' ? (
              <span className="text-lg sm:text-xl">{icon}</span>
            ) : (
              icon
            )}
          </div>
        )}
        <input
          {...props}
          className={`w-full border-2 border-gray-200 ${icon ? 'pl-10 sm:pl-12' : 'pl-3 sm:pl-4'} pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base text-gray-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder-gray-400`}
          required
        />
      </div>
    </div>
  );
}
