export const validation = {
  validatePatient(patientForm) {
    const { name, age, gender, phone, familyEmail, familyPhone } = patientForm;

    if (!name.trim()) {
      return { valid: false, message: "Name is required!" };
    }

    if (/\d/.test(name)) {
      return { valid: false, message: "Name cannot contain numbers!" };
    }

    if (!age || isNaN(age)) {
      return { valid: false, message: "Age must be a valid number!" };
    }

    if (!gender) {
      return { valid: false, message: "Please select gender!" };
    }

    if (!/^\d{10}$/.test(phone)) {
      return { valid: false, message: "Patient phone must be 10 digits!" };
    }

    // Family phone validation (optional field)
    if (familyPhone && !/^\d{10}$/.test(familyPhone)) {
      return { valid: false, message: "Family phone must be 10 digits!" };
    }

    if (!familyEmail.trim()) {
      return { valid: false, message: "Family email is required!" };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(familyEmail)) {
      return { valid: false, message: "Please enter a valid email address!" };
    }

    return { valid: true };
  },

  validateHealth(healthForm) {
    const { heartRate, bloodPressure, oxygen, temperature } = healthForm;

    if (!heartRate || !bloodPressure || !oxygen || !temperature) {
      return {
        valid: false,
        message: "All health fields are required. Use 0 if not needed.",
      };
    }

    return { valid: true };
  },
};
