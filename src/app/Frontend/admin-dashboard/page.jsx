"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { 
  collection, query, where, getDocs, doc, getDoc
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Modal from "@/components/shared/Modal";
import PatientForm from "@/components/forms/PatientForm";
import { patientService } from "@/services/patientService";

const ADMIN_EMAILS = [
  "souravsahoo72051@gmail.com",
  "souravsahoo90781@gmail.com"
];

export default function AdminDashboard() {
  const { user, userRole, doctorId, doctorName, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDoctorPatients, setSelectedDoctorPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorLoadingStates, setDoctorLoadingStates] = useState({});
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [patientForm, setPatientForm] = useState({});
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);

  // PROTECTED: Only load if authorized admin
  useEffect(() => {
    if (!authLoading && user) {
      const isAdmin = ADMIN_EMAILS.includes(user.email);
      if (!isAdmin || userRole !== 'Admin') {
        alert("🚫 Unauthorized access! Redirecting to login...");
        signOut(auth).then(() => router.push("/login"));
        return;
      }
      fetchAllDoctors();
    }
  }, [authLoading, user, userRole, router]);

  // Filter doctors based on search term
  useEffect(() => {
    const filtered = doctors.filter(doctor =>
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.idNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [doctors, searchTerm]);

  const fetchAllDoctors = async () => {
    try {
      setLoading(true);
      const doctorsQuery = query(
        collection(db, "users"),
        where("role", "==", "Doctor")
      );
      const snapshot = await getDocs(doctorsQuery);
      
      const doctorsList = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
        patientCount: 0
      }));

      setDoctors(doctorsList);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorPatients = async (doctorId) => {
    try {
      setDoctorLoadingStates(prev => ({ ...prev, [doctorId]: true }));
      
      const doctorRef = doc(db, "users", doctorId);
      const doctorSnap = await getDoc(doctorRef);
      if (!doctorSnap.exists()) {
        alert("Doctor not found!");
        return;
      }
      const doctorData = doctorSnap.data();
      setSelectedDoctor({ id: doctorId, ...doctorData });

      let allPatients = [];
      
      // Main patients collection
      try {
        const patientsQuery = query(
          collection(db, "patients"),
          where("doctorId", "==", doctorId)
        );
        const patientsSnapshot = await getDocs(patientsQuery);
        patientsSnapshot.docs.forEach(docSnap => {
          allPatients.push({
            id: docSnap.id,
            source: "main-patients",
            doctorId,
            ...docSnap.data()
          });
        });
      } catch (error) {
        console.log("Main patients collection access failed:", error.message);
      }

      // Doctor subcollection
      try {
        const patientSubRef = collection(db, "users", doctorId, "patients");
        const patientSubSnap = await getDocs(patientSubRef);
        patientSubSnap.docs.forEach(docSnap => {
          allPatients.push({
            id: docSnap.id,
            source: "doctor-subcollection",
            doctorId,
            ...docSnap.data()
          });
        });
      } catch (error) {
        console.log("Doctor subcollection access failed:", error.message);
      }

      setSelectedDoctorPatients(allPatients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      alert("Error loading patients: " + error.message);
    } finally {
      setDoctorLoadingStates(prev => ({ ...prev, [doctorId]: false }));
    }
  };

  const handleViewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const handleEditPatient = (patient) => {
    setPatientForm({
      name: patient.name || "",
      age: patient.age || "",
      gender: patient.gender || "",
      phone: patient.phone || "",
      activeStatus: patient.activeStatus || "Active",
    });
    setIsEditMode(true);
    setCurrentPatientId(patient.id);
    setShowPatientForm(true);
  };

  const handleDeletePatient = async (patientId) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    try {
      await patientService.deletePatient(selectedDoctor.id, patientId);
      setSelectedDoctorPatients(prev => prev.filter(p => p.id !== patientId));
    } catch (error) {
      alert("Delete failed: " + error.message);
    }
  };

  const handleSavePatient = async () => {
    if (!selectedDoctor) {
      alert("Please select a doctor first!");
      return;
    }
    try {
      if (isEditMode && currentPatientId) {
        await patientService.updatePatient(selectedDoctor.id, currentPatientId, patientForm);
      } else {
        await patientService.addPatient(selectedDoctor.id, patientForm, {});
      }
      setShowPatientForm(false);
      fetchDoctorPatients(selectedDoctor.id);
    } catch (error) {
      alert("Save failed: " + error.message);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => router.push("/login"));
  };

  // Loading states
  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-full lg:max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 p-6 sm:p-8 bg-white/90 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-xl border border-gray-200 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Hospital Management
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mt-1 sm:mt-2">Administrator Dashboard</p>
            <p className="text-sm sm:text-base text-emerald-600 mt-1 font-semibold bg-emerald-100 px-3 py-1 rounded-full inline-block">
              ✅ Admin: {user.email}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3 rounded-xl lg:rounded-2xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-red-700"
          >
            Sign Out
          </button>
        </div>

        {/* Doctors Section */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 mb-8 lg:mb-12 border border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Registered Doctors</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto lg:shrink-0">
              <div className="text-xl sm:text-2xl font-bold text-blue-600 w-full sm:w-auto">
                Total: {filteredDoctors.length} of {doctors.length}
              </div>
              {/* Search Input */}
              <div className="relative w-full sm:w-80 lg:w-96">
                <input
                  type="text"
                  placeholder="🔍 Search doctors by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl lg:rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-base sm:text-lg shadow-sm bg-white/80 backdrop-blur-sm hover:shadow-md"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-xl lg:rounded-2xl border border-gray-200">
            <table className="w-full min-w-150 sm:min-w-175">
              <thead className="bg-linear-to-r from-gray-900 to-gray-800 text-white">
                <tr>
                  <th className="p-4 sm:p-6 text-left font-semibold text-base sm:text-lg uppercase tracking-wider">Doctor</th>
                  <th className="p-4 sm:p-6 text-left font-semibold text-base sm:text-lg uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="p-4 sm:p-6 text-left font-semibold text-base sm:text-lg uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 sm:p-6 font-semibold text-lg sm:text-xl text-gray-900 max-w-xs truncate">
                      {doctor.name}
                      <div className="text-xs sm:text-sm text-gray-500 mt-1">ID: {doctor.idNumber || 'N/A'}</div>
                    </td>
                    <td className="p-4 sm:p-6 text-base sm:text-lg text-gray-700 font-medium hidden md:table-cell max-w-sm truncate">
                      {doctor.email}
                    </td>
                    <td className="p-4 sm:p-6">
                      <button
                        onClick={() => fetchDoctorPatients(doctor.id)}
                        disabled={doctorLoadingStates[doctor.id]}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:text-gray-200 text-white px-6 sm:px-10 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed border border-emerald-700 flex items-center justify-center gap-2 min-w-35 sm:min-w-40"
                      >
                        {doctorLoadingStates[doctor.id] ? (
                          <>
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="hidden sm:inline">Loading...</span>
                            <span className="sm:hidden">Loading</span>
                          </>
                        ) : (
                          <>
                            <span className="hidden sm:inline">View Patients</span>
                            <span className="sm:hidden">View</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No results message */}
          {filteredDoctors.length === 0 && searchTerm && (
            <div className="text-center py-12 sm:py-16 border-2 border-dashed border-gray-300 rounded-xl lg:rounded-2xl bg-gray-50 mt-8">
              <div className="text-5xl sm:text-6xl text-gray-400 mb-6">🔍</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">No Doctors Found</h3>
              <p className="text-lg sm:text-xl text-gray-600 max-w-md mx-auto">
                No doctors match "{searchTerm}". Try adjusting your search terms.
              </p>
            </div>
          )}
        </div>

        {/* Patients Section */}
        {selectedDoctor && (
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 lg:mb-10 gap-4 lg:gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Dr. {selectedDoctor.name}
                </h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2 text-lg sm:text-xl font-semibold text-gray-700">
                  <span>Patients: <span className="text-emerald-600 font-bold text-xl sm:text-2xl">{selectedDoctorPatients.length}</span></span>
                  <span className="hidden md:inline">{selectedDoctor.email}</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedDoctor(null);
                  setSelectedDoctorPatients([]);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 sm:px-10 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-700 w-full lg:w-auto"
              >
                ← Back to Doctors
              </button>
            </div>

            {selectedDoctorPatients.length === 0 ? (
              <div className="text-center py-16 sm:py-24 border-2 border-dashed border-gray-300 rounded-xl lg:rounded-2xl bg-gray-50">
                <div className="text-4xl sm:text-6xl text-gray-400 mb-6">📋</div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">No Patients Found</h3>
                <p className="text-lg sm:text-xl text-gray-600 max-w-md mx-auto">Dr. {selectedDoctor.name} currently has no registered patients.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl lg:rounded-2xl border border-gray-200 shadow-md">
                <table className="w-full min-w-125 sm:min-w-200">
                  <thead className="bg-linear-to-r from-indigo-600 to-purple-700 text-white">
                    <tr>
                      <th className="p-4 sm:p-6 text-left font-semibold text-sm sm:text-lg uppercase tracking-wider">Patient</th>
                      <th className="p-4 sm:p-6 text-left font-semibold text-sm sm:text-lg uppercase tracking-wider hidden sm:table-cell">Age</th>
                      <th className="p-4 sm:p-6 text-left font-semibold text-sm sm:text-lg uppercase tracking-wider hidden md:table-cell">Phone</th>
                      <th className="p-4 sm:p-6 text-left font-semibold text-sm sm:text-lg uppercase tracking-wider hidden lg:table-cell">Status</th>
                      <th className="p-4 sm:p-6 text-left font-semibold text-sm sm:text-lg uppercase tracking-wider hidden xl:table-cell">Source</th>
                      <th className="p-4 sm:p-6 text-left font-semibold text-sm sm:text-lg uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedDoctorPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 sm:p-6 font-semibold text-base sm:text-xl text-gray-900 max-w-xs truncate">
                          {patient.name}
                        </td>
                        <td className="p-4 sm:p-6 font-semibold text-sm sm:text-lg text-gray-800 hidden sm:table-cell">
                          {patient.age || 'N/A'}
                        </td>
                        <td className="p-4 sm:p-6 font-semibold text-sm sm:text-lg text-gray-800 hidden md:table-cell max-w-xs truncate">
                          {patient.phone || 'N/A'}
                        </td>
                        <td className="p-4 sm:p-6 hidden lg:table-cell">
                          <span className={`px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                            patient.activeStatus === 'Discharged' 
                              ? 'bg-red-100 text-red-800 border-2 border-red-200' 
                              : 'bg-emerald-100 text-emerald-800 border-2 border-emerald-200'
                          }`}>
                            {patient.activeStatus || 'Active'}
                          </span>
                        </td>
                        <td className="p-4 sm:p-6 hidden xl:table-cell">
                          <span className={`px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-white ${
                            patient.source === 'main-patients' 
                              ? 'bg-blue-600' 
                              : 'bg-purple-600'
                          }`}>
                            {patient.source?.replace('-', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 sm:p-6 space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleViewPatientDetails(patient)}
                            className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-200 border border-indigo-700 text-center"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEditPatient(patient)}
                            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-700 text-center"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePatient(patient.id)}
                            className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-200 border border-red-700 text-center"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Patient Details Modal */}
        {showPatientDetails && selectedPatient && (
          <Modal 
            title={`${selectedPatient.name} - Patient Profile`}
            onClose={() => setShowPatientDetails(false)}
          >
            <div className="p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto">
              <div className="space-y-6 lg:space-y-8">
                {/* Patient Information */}
                <div className="bg-blue-50 p-6 sm:p-8 rounded-2xl border-2 border-blue-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 border-b pb-3 sm:pb-4">Patient Information</h3>
                  <div className="space-y-4 sm:space-y-6 text-base sm:text-xl">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      <span className="font-semibold text-gray-700 w-24 sm:w-28 bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base whitespace-nowrap">Name:</span>
                      <span className="font-bold text-gray-900 flex-1 min-w-0 wrap-break-words">{selectedPatient.name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      <span className="font-semibold text-gray-700 w-24 sm:w-28 bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base whitespace-nowrap">Age:</span>
                      <span className="font-bold text-gray-900">{selectedPatient.age || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      <span className="font-semibold text-gray-700 w-24 sm:w-28 bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base whitespace-nowrap">Phone:</span>
                      <span className="font-bold text-gray-900">{selectedPatient.phone || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      <span className="font-semibold text-gray-700 w-24 sm:w-28 bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base whitespace-nowrap">Gender:</span>
                      <span className="font-bold text-gray-900">{selectedPatient.gender || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div className="bg-emerald-50 p-6 sm:p-8 rounded-2xl border-2 border-emerald-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 border-b pb-3 sm:pb-4">Status Information</h3>
                  <div className="space-y-4 sm:space-y-6 text-base sm:text-xl">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      <span className="font-semibold text-gray-700 w-24 sm:w-28 bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base whitespace-nowrap">Status:</span>
                      <span className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-white text-sm sm:text-lg shadow-lg ${
                        selectedPatient.activeStatus === 'Discharged' 
                          ? 'bg-red-600' 
                          : 'bg-emerald-600'
                      }`}>
                        {selectedPatient.activeStatus || 'Active'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      <span className="font-semibold text-gray-700 w-24 sm:w-28 bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base whitespace-nowrap">Doctor:</span>
                      <span className="font-bold text-gray-900">Dr. {selectedDoctor?.name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      <span className="font-semibold text-gray-700 w-24 sm:w-28 bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base whitespace-nowrap">Source:</span>
                      <span className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-white text-sm sm:text-lg shadow-lg ${
                        selectedPatient.source === 'main-patients' 
                          ? 'bg-blue-600' 
                          : 'bg-purple-600'
                      }`}>
                        {selectedPatient.source?.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gray-200 mt-6 sm:mt-12">
                  <button
                    onClick={() => {
                      handleEditPatient(selectedPatient);
                      setShowPatientDetails(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-12 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-700 flex-1"
                  >
                    Edit Patient Details
                  </button>
                  <button
                    onClick={() => setShowPatientDetails(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 sm:px-12 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-700 flex-1 sm:flex-none"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Patient Form Modal */}
        {showPatientForm && (
          <Modal 
            title={isEditMode ? "Edit Patient Details" : `Add Patient for Dr. ${selectedDoctor?.name}`}
            onClose={() => setShowPatientForm(false)}
          >
            <PatientForm
              patientForm={patientForm}
              setPatientForm={setPatientForm}
              isEditMode={isEditMode}
              onSave={handleSavePatient}
              onCancel={() => setShowPatientForm(false)}
            />
          </Modal>
        )}
      </div>
    </div>
  );
} 
