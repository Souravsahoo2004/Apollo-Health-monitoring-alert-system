import Input from "../shared/Input";
import Select from "../shared/Select";
import { GENDER_OPTIONS } from "@/utils/constants";

export default function PatientForm({ 
  patientForm, 
  setPatientForm,
  isEditMode,
  onNext,
  onSave,
  onCancel 
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Input
        label="Patient Name"
        placeholder="Enter full name"
        value={patientForm.name}
        onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
        icon="👤"
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Input
          label="Age"
          type="number"
          placeholder="Enter age"
          value={patientForm.age}
          onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
          icon="📅"
          required
        />

        <Select
          label="Gender"
          value={patientForm.gender}
          onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
          options={GENDER_OPTIONS}
          icon="⚧"
          required
        />
      </div>

      <Input
        label="Phone Number"
        type="tel"
        placeholder="10-digit number"
        value={patientForm.phone}
        onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
        icon="📞"
        maxLength={10}
        required
      />

      <Input
        label="Family Email"
        type="email"
        placeholder="family@example.com"
        value={patientForm.familyEmail}
        onChange={(e) => setPatientForm({ ...patientForm, familyEmail: e.target.value })}
        icon="📧"
        required
      />

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl text-base font-semibold hover:bg-gray-300 transition-all duration-300"
        >
          Cancel
        </button>
        
        {isEditMode ? (
          <button
            type="button"
            onClick={onSave}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl text-base font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Save Changes
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl text-base font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Next: Health Data →
          </button>
        )}
      </div>
    </div>
  );
}
