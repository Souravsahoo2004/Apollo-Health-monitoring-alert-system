import Modal from "../shared/Modal";
import Input from "../shared/Input";

export default function HealthDataModal({ 
  isOpen,
  patientName,
  healthDataList,
  editingHealthData,
  setEditingHealthData,
  onUpdate,
  // onDelete - removed since we're not using it
  onClose 
}) {
  if (!isOpen) return null;

  return (
    <Modal
      title={`${patientName}'s Health Records`}
      onClose={onClose}
      size="large"
    >
      <div className="space-y-4 sm:space-y-6">
        {healthDataList.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm sm:text-base text-gray-500">No health records found for this patient.</p>
          </div>
        ) : (
          healthDataList.map((healthData, index) => (
            <div
              key={healthData.id}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-blue-100"
            >
              {editingHealthData?.id === healthData.id ? (
                /* EDIT MODE */
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800">
                      Editing Record #{healthDataList.length - index}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Input
                      label="Heart Rate"
                      placeholder="bpm"
                      value={editingHealthData.heartRate}
                      onChange={(e) =>
                        setEditingHealthData({ ...editingHealthData, heartRate: e.target.value })
                      }
                      icon="❤️"
                    />
                    <Input
                      label="Blood Pressure"
                      placeholder="mmHg"
                      value={editingHealthData.bloodPressure}
                      onChange={(e) =>
                        setEditingHealthData({ ...editingHealthData, bloodPressure: e.target.value })
                      }
                      icon="💉"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Input
                      label="Oxygen Level"
                      placeholder="%"
                      value={editingHealthData.oxygen}
                      onChange={(e) =>
                        setEditingHealthData({ ...editingHealthData, oxygen: e.target.value })
                      }
                      icon="🫁"
                    />
                    <Input
                      label="Temperature"
                      placeholder="°F"
                      value={editingHealthData.temperature}
                      onChange={(e) =>
                        setEditingHealthData({ ...editingHealthData, temperature: e.target.value })
                      }
                      icon="🌡️"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-2">
                      Health Status
                    </label>
                    <select
                      value={editingHealthData.status}
                      className="w-full border-2 border-gray-200 p-2.5 sm:p-3 rounded-xl text-sm sm:text-base text-gray-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      onChange={(e) =>
                        setEditingHealthData({ ...editingHealthData, status: e.target.value })
                      }
                    >
                      <option value="Normal">✓ Normal</option>
                      <option value="Critical">⚠ Critical</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                    <button
                      onClick={() => setEditingHealthData(null)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-300 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => onUpdate(healthData.id, {
                        heartRate: editingHealthData.heartRate,
                        bloodPressure: editingHealthData.bloodPressure,
                        oxygen: editingHealthData.oxygen,
                        temperature: editingHealthData.temperature,
                        status: editingHealthData.status,
                      })}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                /* VIEW MODE */
                <>
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-800">
                        Health Record #{healthDataList.length - index}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {healthData.timestamp?.toDate().toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                    
                    <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold ${
                      healthData.status === "Critical"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {healthData.status === "Critical" ? "⚠ Critical" : "✓ Normal"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Heart Rate</p>
                      <p className="text-base sm:text-lg font-bold text-gray-800">
                        {healthData.heartRate} <span className="text-sm font-normal">bpm</span>
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Blood Pressure</p>
                      <p className="text-base sm:text-lg font-bold text-gray-800">
                        {healthData.bloodPressure} <span className="text-sm font-normal">mmHg</span>
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Oxygen</p>
                      <p className="text-base sm:text-lg font-bold text-gray-800">
                        {healthData.oxygen}<span className="text-sm font-normal">%</span>
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Temperature</p>
                      <p className="text-base sm:text-lg font-bold text-gray-800">
                        {healthData.temperature}<span className="text-sm font-normal">°F</span>
                      </p>
                    </div>
                  </div>

                  {/* Only Edit button - Delete button removed */}
                  <button
                    onClick={() => setEditingHealthData(healthData)}
                    className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Record
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
