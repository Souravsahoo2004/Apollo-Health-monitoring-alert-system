"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { usePatients } from "@/hooks/usePatients";
import { usePatientForm } from "@/hooks/usePatientForm";
import { useHealthData } from "@/hooks/useHealthData";
import { patientService } from "@/services/patientService";
import { healthDataService } from "@/services/healthDataService";
import { notificationService } from "@/services/notificationService";
import { validation } from "@/utils/validation";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import PatientsList from "@/components/dashboard/PatientsList";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Modal from "@/components/shared/Modal";
import PatientForm from "@/components/forms/PatientForm";
import HealthForm from "@/components/forms/HealthForm";
import HealthDataModal from "@/components/forms/HealthDataModal";

export default function DoctorDashboard() {
  const { doctorId, doctorName, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const { patients, loading: patientsLoading, setPatients } = usePatients(doctorId);
  const {
    showPatientForm,
    setShowPatientForm,
    showHealthForm,
    setShowHealthForm,
    isEditMode,
    currentPatientId,
    patientForm,
    setPatientForm,
    healthForm,
    setHealthForm,
    resetForms,
    openAddPatientForm,
    openEditPatientForm,
  } = usePatientForm();

  const {
    showHealthDataModal,
    healthDataList,
    selectedPatientName,
    editingHealthData,
    setEditingHealthData,
    fetchPatientHealthData,
    updateHealthData,
    closeHealthDataModal,
  } = useHealthData(doctorId);

  const [filterStatus, setFilterStatus] = useState("Active");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  // NEW: Delete Patient Handler
  const handleDeletePatient = async (patientId) => {
    try {
      if (!confirm(`Are you sure you want to permanently delete this patient record? This action cannot be undone.`)) {
        return;
      }

      // Call your patient service to delete from database
      await patientService.deletePatient(doctorId, patientId);
      
      // Remove from local state
      setPatients(prevPatients => prevPatients.filter(p => p.id !== patientId));
      
      alert("✅ Patient record deleted successfully!");
    } catch (error) {
      console.error("❌ Delete failed:", error);
      alert("❌ Failed to delete patient record: " + (error.message || "Unknown error"));
    }
  };

  // Check if user is logged in
  if (!authLoading && !doctorId) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
          <div className="mb-8">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Login</h1>
            <p className="text-lg text-gray-600 mb-8">
              You need to login to access the Doctor Dashboard.
            </p>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Handler: Go to health form (new patient only)
  const handleGoToHealthForm = () => {
    const validationResult = validation.validatePatient(patientForm);
    if (!validationResult.valid) {
      alert(validationResult.message);
      return;
    }
    setShowPatientForm(false);
    setShowHealthForm(true);
  };

  const handleBackToPatientForm = () => {
    setShowHealthForm(false);
    setShowPatientForm(true);
  };

  const handleSaveNewPatient = async () => {
    const healthValidation = validation.validateHealth(healthForm);
    if (!healthValidation.valid) {
      alert(healthValidation.message);
      return;
    }

    try {
      await patientService.addPatient(doctorId, patientForm, healthForm);
      alert("✅ New patient added successfully!");
      resetForms();
    } catch (error) {
      console.error("❌ Error saving patient:", error);
      alert("Failed to save patient: " + error.message);
    }
  };

  const handleUpdatePatient = async () => {
    const validationResult = validation.validatePatient(patientForm);
    if (!validationResult.valid) {
      alert(validationResult.message);
      return;
    }

    try {
      await patientService.updatePatient(doctorId, currentPatientId, patientForm);
      alert("✅ Patient information updated successfully!");
      resetForms();
    } catch (error) {
      console.error("❌ Error updating patient:", error);
      alert("Failed to update patient: " + error.message);
    }
  };

  const handleUpdateActiveStatus = async (patientId, activeStatus) => {
    try {
      await patientService.updatePatientActiveStatus(doctorId, patientId, activeStatus);
      
      if (activeStatus === "Discharged") {
        alert("Patient has been discharged. Editing is now disabled.");
      }
    } catch (error) {
      console.error("❌ Error updating active status:", error);
      alert("Failed to update patient status: " + error.message);
    }
  };

  const handleUpdateHealthStatus = async (patientId, newStatus) => {
    try {
      const patient = patients.find((p) => p.id === patientId);
      
      if (!patient) {
        console.error("❌ Patient not found in state");
        alert("Patient not found!");
        return;
      }

      if (patient.activeStatus === "Discharged") {
        alert("Cannot update health status of discharged patients!");
        return;
      }

      const oldStatus = patient.currentStatus || "Normal";
      
      if (oldStatus === newStatus) {
        console.log("ℹ️ Status unchanged, no notification needed");
        return;
      }
      
      setPatients(prevPatients => 
        prevPatients.map(p => 
          p.id === patientId 
            ? { ...p, currentStatus: newStatus }
            : p
        )
      );
      
      let healthDocIdToUpdate = patient.latestHealthDocId;
      
      if (!healthDocIdToUpdate) {
        console.log("🔍 Fetching latest health data for patient...");
        
        try {
          const healthData = await healthDataService.fetchPatientHealthData(doctorId, patientId);
          
          if (healthData && healthData.length > 0) {
            healthDocIdToUpdate = healthData[0].id;
            console.log("✅ Found health record ID:", healthDocIdToUpdate);
          } else {
            setPatients(prevPatients => 
              prevPatients.map(p => 
                p.id === patientId 
                  ? { ...p, currentStatus: oldStatus }
                  : p
              )
            );
            alert("No health data found for this patient. Please add health data first by clicking on the patient card.");
            return;
          }
        } catch (fetchError) {
          console.error("❌ Error fetching health data:", fetchError);
          setPatients(prevPatients => 
            prevPatients.map(p => 
              p.id === patientId 
                ? { ...p, currentStatus: oldStatus }
                : p
            )
          );
          alert("Failed to fetch health data. Please try again.");
          return;
        }
      }
      
      await healthDataService.updatePatientHealthStatus(
        doctorId,
        patientId,
        healthDocIdToUpdate,
        newStatus
      );
      
      console.log("✅ Health status updated to:", newStatus);
      
      if (patient.familyEmail || patient.familyPhone) {
        try {
          console.log("📤 Sending notification to family...");
          
          await notificationService.sendHealthStatusNotification(
            patient,
            newStatus,
            oldStatus
          );
          
          await notificationService.logNotification(doctorId, patientId, {
            type: "health_status_change",
            oldStatus: oldStatus,
            newStatus: newStatus,
            sentTo: {
              email: patient.familyEmail || null,
              phone: patient.familyPhone || null,
            },
            success: true,
          });
          
          const notificationMethods = [];
          if (patient.familyEmail) notificationMethods.push("email");
          if (patient.familyPhone) notificationMethods.push("SMS");
          
          alert(
            `✅ Status updated to ${newStatus}!\n\n📧 Notification sent via ${notificationMethods.join(" and ")} to:\n` +
            (patient.familyEmail ? `📩 ${patient.familyEmail}\n` : "") +
            (patient.familyPhone ? `📱 ${patient.familyPhone}` : "")
          );
          
        } catch (notificationError) {
          console.error("❌ Failed to send notification:", notificationError);
          
          await notificationService.logNotification(doctorId, patientId, {
            type: "health_status_change",
            oldStatus: oldStatus,
            newStatus: newStatus,
            sentTo: {
              email: patient.familyEmail || null,
              phone: patient.familyPhone || null,
            },
            success: false,
            error: notificationError.message,
          });
          
          alert(
            `✅ Status updated to ${newStatus}\n\n⚠️ However, notification failed to send.\n` +
            `Please check:\n` +
            `• Family contact details are correct\n` +
            `• API credentials are configured\n` +
            `• Internet connection is stable\n\n` +
            `Error: ${notificationError.message}`
          );
        }
      } else {
        alert(
          `✅ Status updated to ${newStatus}\n\n` +
          `⚠️ No family contact information available.\n` +
          `Please add family email or phone number to enable notifications.`
        );
      }
      
    } catch (error) {
      console.error("❌ Error updating health status:", error);
      const patient = patients.find((p) => p.id === patientId);
      if (patient) {
        setPatients(prevPatients => 
          prevPatients.map(p => 
            p.id === patientId 
              ? { ...p, currentStatus: patient.currentStatus }
              : p
          )
        );
      }
      alert("Failed to update status: " + error.message);
    }
  };

  const handleEditPatient = (patient) => {
    if (patient.activeStatus === "Discharged") {
      alert("Cannot edit discharged patients! Change status to Active first if you need to edit.");
      return;
    }
    openEditPatientForm(patient);
  };

  if (authLoading || patientsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <DashboardHeader
        doctorName={doctorName}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        onAddPatient={openAddPatientForm}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      <StatsCards patients={patients} />

      <PatientsList
        patients={patients}
        filterStatus={filterStatus}
        searchQuery={searchQuery}
        dateFilter={dateFilter}
        onViewHealthData={fetchPatientHealthData}
        onUpdateStatus={handleUpdateHealthStatus}
        onUpdateActiveStatus={handleUpdateActiveStatus}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}  // ✅ NEW: Added onDelete prop
      />

      {/* Patient Form Modal */}
      {showPatientForm && (
        <Modal
          title={isEditMode ? "Edit Patient" : "Add New Patient"}
          onClose={resetForms}
        >
          <PatientForm
            patientForm={patientForm}
            setPatientForm={setPatientForm}
            isEditMode={isEditMode}
            onNext={handleGoToHealthForm}
            onSave={handleUpdatePatient}
            onCancel={resetForms}
          />
        </Modal>
      )}

      {/* Health Form Modal */}
      {showHealthForm && (
        <Modal title="Add Health Data" onClose={resetForms}>
          <HealthForm
            healthForm={healthForm}
            setHealthForm={setHealthForm}
            onBack={handleBackToPatientForm}
            onSave={handleSaveNewPatient}
          />
        </Modal>
      )}

      {/* Health Data Modal */}
      <HealthDataModal
        isOpen={showHealthDataModal}
        patientName={selectedPatientName}
        healthDataList={healthDataList}
        editingHealthData={editingHealthData}
        setEditingHealthData={setEditingHealthData}
        onUpdate={updateHealthData}
        onClose={closeHealthDataModal}
      />
    </div>
  );
}
