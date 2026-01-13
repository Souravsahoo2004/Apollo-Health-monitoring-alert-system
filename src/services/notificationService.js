import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const notificationService = {
  // Send notification via API route
  async sendHealthStatusNotification(patientData, newStatus, oldStatus) {
    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientName: patientData.name,
          patientPhone: patientData.phone,
          familyEmail: patientData.familyEmail,
          familyPhone: patientData.familyPhone,
          newStatus: newStatus,
          oldStatus: oldStatus,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send notification");
      }

      console.log("✅ Notification sent successfully:", result);
      return result;
    } catch (error) {
      console.error("❌ Error sending notification:", error);
      throw error;
    }
  },

  // Log notification in Firestore
  async logNotification(doctorId, patientId, notificationData) {
    try {
      const notificationRef = collection(
        db,
        "users",
        doctorId,
        "patients",
        patientId,
        "notifications"
      );

      await addDoc(notificationRef, {
        ...notificationData,
        timestamp: Timestamp.now(),
      });

      console.log("✅ Notification logged in Firestore");
    } catch (error) {
      console.error("❌ Error logging notification:", error);
    }
  },
};
