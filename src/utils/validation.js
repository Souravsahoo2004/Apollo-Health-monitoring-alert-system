export const validation = {
  validatePatient(patientForm) {
    const { name, age, gender, phone, familyEmail } = patientForm;

    if (!name || /\d/.test(name)) {
      return { valid: false, message: "Name cannot contain numbers" };
    }
    if (!age || isNaN(age)) {
      return { valid: false, message: "Age must be a number" };
    }
    if (!gender) {
      return { valid: false, message: "Select gender" };
    }
    if (!/^\d{10}$/.test(phone)) {
      return { valid: false, message: "Phone must be 10 digits" };
    }
    if (!familyEmail) {
      return { valid: false, message: "Family email required" };
    }

    return { valid: true };
  },

  validateHealth(healthForm) {
    const { heartRate, bloodPressure, oxygen, temperature } = healthForm;
    
    if (
      heartRate === "" || 
      bloodPressure === "" || 
      oxygen === "" || 
      temperature === ""
    ) {
      return { 
        valid: false, 
        message: "Health fields cannot be empty. Use 0 if not needed." 
      };
    }
    
    return { valid: true };
  }
};
