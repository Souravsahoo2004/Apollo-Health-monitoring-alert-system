import { useState } from "react";

export function usePatientForm() {
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState(null);

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

  const resetForms = () => {
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
    setShowPatientForm(false);
    setShowHealthForm(false);
    setIsEditMode(false);
    setCurrentPatientId(null);
  };

  const openAddPatientForm = () => {
    setIsEditMode(false);
    setShowPatientForm(true);
  };

  const openEditPatientForm = (patient) => {
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

  return {
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
  };
}
