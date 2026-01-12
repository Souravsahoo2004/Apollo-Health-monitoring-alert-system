"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePatients } from "@/hooks/usePatients";
import { usePatientForm } from "@/hooks/usePatientForm";
import { useHealthData } from "@/hooks/useHealthData";
import { patientService } from "@/services/patientService";
import { healthDataService } from "@/services/healthDataService";
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

  // Handler: Go back to patient form
  const handleBackToPatientForm = () => {
    setShowHealthForm(false);
    setShowPatientForm(true);
  };

  // Handler: Save new patient and health data
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

  // Handler: Update existing patient info
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

  // Handler: Update patient's active status (Active/Discharged)
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

  // Handler: Update patient's health status (Normal/Critical) - WITH OPTIMISTIC UPDATE
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
      
      // OPTIMISTIC UPDATE - Update UI immediately before database
      setPatients(prevPatients => 
        prevPatients.map(p => 
          p.id === patientId 
            ? { ...p, currentStatus: newStatus }
            : p
        )
      );
      
      let healthDocIdToUpdate = patient.latestHealthDocId;
      
      // If no latestHealthDocId, fetch it from database
      if (!healthDocIdToUpdate) {
        console.log("🔍 Fetching latest health data for patient...");
        
        try {
          const healthData = await healthDataService.fetchPatientHealthData(doctorId, patientId);
          
          if (healthData && healthData.length > 0) {
            healthDocIdToUpdate = healthData[0].id;
            console.log("✅ Found health record ID:", healthDocIdToUpdate);
          } else {
            // Revert optimistic update if no health data found
            setPatients(prevPatients => 
              prevPatients.map(p => 
                p.id === patientId 
                  ? { ...p, currentStatus: patient.currentStatus }
                  : p
              )
            );
            alert("No health data found for this patient. Please add health data first by clicking on the patient card.");
            return;
          }
        } catch (fetchError) {
          console.error("❌ Error fetching health data:", fetchError);
          // Revert optimistic update on error
          setPatients(prevPatients => 
            prevPatients.map(p => 
              p.id === patientId 
                ? { ...p, currentStatus: patient.currentStatus }
                : p
            )
          );
          alert("Failed to fetch health data. Please try again.");
          return;
        }
      }
      
      // Update the health status in database
      await healthDataService.updatePatientHealthStatus(
        doctorId,
        patientId,
        healthDocIdToUpdate,
        newStatus
      );
      
      console.log("✅ Health status updated to:", newStatus);
      
    } catch (error) {
      console.error("❌ Error updating health status:", error);
      // Revert optimistic update on error
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

  // Handler: Edit patient (check if discharged)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
