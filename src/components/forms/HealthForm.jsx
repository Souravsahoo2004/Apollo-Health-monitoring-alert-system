import Input from "../shared/Input";
import Select from "../shared/Select";
import { HEALTH_STATUS } from "@/utils/constants";

export default function HealthForm({ 
  healthForm, 
  setHealthForm,
  onBack,
  onSave 
}) {
  const statusOptions = [
    { value: HEALTH_STATUS.NORMAL, label: "✓ Normal" },
    { value: HEALTH_STATUS.CRITICAL, label: "⚠ Critical" }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Input
          label="Heart Rate"
          type="number"
          placeholder="bpm"
          value={healthForm.heartRate}
          onChange={(e) => setHealthForm({ ...healthForm, heartRate: e.target.value })}
          icon="❤️"
          required
        />

        <Input
          label="Blood Pressure"
          placeholder="e.g., 120/80"
          value={healthForm.bloodPressure}
          onChange={(e) => setHealthForm({ ...healthForm, bloodPressure: e.target.value })}
          icon="💉"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Input
          label="Oxygen Level"
          type="number"
          placeholder="%"
          value={healthForm.oxygen}
          onChange={(e) => setHealthForm({ ...healthForm, oxygen: e.target.value })}
          icon="🫁"
          required
        />

        <Input
          label="Temperature"
          type="number"
          placeholder="°F"
          value={healthForm.temperature}
          onChange={(e) => setHealthForm({ ...healthForm, temperature: e.target.value })}
          icon="🌡️"
          step="0.1"
          required
        />
      </div>

      <Select
        label="Health Status"
        value={healthForm.status}
        onChange={(e) => setHealthForm({ ...healthForm, status: e.target.value })}
        options={statusOptions}
        required
      />

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl text-base font-semibold hover:bg-gray-300 transition-all duration-300"
        >
          ← Back
        </button>
        
        <button
          type="button"
          onClick={onSave}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl text-base font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Save Patient
        </button>
      </div>
    </div>
  );
}
