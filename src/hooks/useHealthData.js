import { useState } from "react";
import { healthDataService } from "@/services/healthDataService";

export function useHealthData(doctorId) {
  const [showHealthDataModal, setShowHealthDataModal] = useState(false);
  const [healthDataList, setHealthDataList] = useState([]);
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [editingHealthData, setEditingHealthData] = useState(null);

  const fetchPatientHealthData = async (patientId, patientName) => {
    try {
      const healthData = await healthDataService.fetchPatientHealthData(doctorId, patientId);
      setHealthDataList(healthData);
      setCurrentPatientId(patientId);
      setSelectedPatientName(patientName);
      setShowHealthDataModal(true);
    } catch (error) {
      console.error("❌ Error fetching health data:", error);
      alert("Failed to fetch health data: " + error.message);
    }
  };

  const updateHealthData = async (healthDataId, updatedData) => {
    try {
      await healthDataService.updateHealthData(
        doctorId,
        currentPatientId,
        healthDataId,
        updatedData
      );
      alert("✅ Health data updated successfully!");
      await fetchPatientHealthData(currentPatientId, selectedPatientName);
      setEditingHealthData(null);
    } catch (error) {
      console.error("❌ Error updating health data:", error);
      alert("Failed to update health data: " + error.message);
    }
  };

  // deleteHealthDataEntry function removed

  const closeHealthDataModal = () => {
    setShowHealthDataModal(false);
    setHealthDataList([]);
    setSelectedPatientName("");
    setCurrentPatientId(null);
    setEditingHealthData(null);
  };

  return {
    showHealthDataModal,
    healthDataList,
    selectedPatientName,
    editingHealthData,
    setEditingHealthData,
    fetchPatientHealthData,
    updateHealthData,
    // deleteHealthDataEntry removed
    closeHealthDataModal,
  };
}
