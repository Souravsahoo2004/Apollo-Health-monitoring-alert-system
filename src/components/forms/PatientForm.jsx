import Input from "../shared/Input";

export default function PatientForm({ 
  patientForm, 
  setPatientForm, 
  isEditMode, 
  onNext, 
  onSave, 
  onCancel 
}) {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Name */}
      <Input
        label="Full Name"
        placeholder="Enter patient's full name"
        value={patientForm.name}
        onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />

      {/* Age and Gender */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Age"
          type="number"
          placeholder="Age"
          value={patientForm.age}
          onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
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
            onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Patient Phone */}
      <Input
        label="Patient Phone Number"
        placeholder="10 digit number"
        maxLength={10}
        value={patientForm.phone}
        onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        }
      />

      {/* Family Contact Section */}
      <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
        <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Family Contact Information
        </h3>
        
        <div className="space-y-3">
          {/* Family Phone */}
          <Input
            label="Family Phone Number"
            placeholder="10 digit number (optional)"
            maxLength={10}
            value={patientForm.familyPhone}
            onChange={(e) => setPatientForm({ ...patientForm, familyPhone: e.target.value })}
            icon="👨‍👩‍👧"
          />

          {/* Family Email */}
          <Input
            label="Family Email"
            placeholder="example@email.com"
            value={patientForm.familyEmail}
            onChange={(e) => setPatientForm({ ...patientForm, familyEmail: e.target.value })}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-all"
        >
          Cancel
        </button>
        
        {isEditMode ? (
          <button
            onClick={onSave}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Update Patient
          </button>
        ) : (
          <button
            onClick={onNext}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            Continue to Health Data
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
