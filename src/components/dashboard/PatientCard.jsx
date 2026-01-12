export default function PatientCard({ 
  patient, 
  onViewHealthData,
  onUpdateStatus,
  onUpdateActiveStatus,
  onEdit,
  onDelete 
}) {
  const isDischarged = (patient.activeStatus || "Active") === "Discharged";

  return (
    <div
      onClick={() => onViewHealthData(patient.id, patient.name)}
      className={`group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border transform hover:-translate-y-1 cursor-pointer ${
        isDischarged 
          ? "border-red-200 opacity-90" 
          : "border-gray-100 hover:border-blue-200"
      }`}
    >
      {/* Header Section */}
      <div className={`relative p-4 sm:p-6 border-b border-gray-100 ${
        isDischarged 
          ? "bg-gradient-to-br from-gray-50 to-gray-100" 
          : "bg-gradient-to-br from-blue-50 to-purple-50"
      }`}>
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1 sm:gap-2" onClick={(e) => e.stopPropagation()}>
          <select
            value={patient.activeStatus || "Active"}
            onChange={(e) => onUpdateActiveStatus(patient.id, e.target.value)}
            className={`text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium border-2 cursor-pointer transition-all outline-none ${
              isDischarged
                ? "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            }`}
          >
            <option value="Active">Active</option>
            <option value="Discharged">Discharged</option>
          </select>

          <button
            onClick={() => onDelete(patient.id)}
            disabled={!isDischarged}
            className={`p-1.5 sm:p-2 rounded-full transition-all ${
              isDischarged
                ? "bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
            }`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {patient.isEdited && !isDischarged && (
          <span className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium shadow-md">
            Edited
          </span>
        )}
        
        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 mt-6 sm:mt-8">
          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg ${
            isDischarged 
              ? "bg-gradient-to-br from-gray-400 to-gray-600" 
              : "bg-gradient-to-br from-blue-500 to-purple-600"
          }`}>
            {patient.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className={`text-lg sm:text-xl font-bold transition-colors ${
              isDischarged 
                ? "text-gray-600" 
                : "text-gray-800 group-hover:text-blue-600"
            }`}>
              {patient.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${
                isDischarged ? "bg-gray-400" : "bg-green-400"
              }`}></span>
              {isDischarged ? "Discharged" : "Active"}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className={`rounded-lg p-3 ${isDischarged ? "bg-gray-100" : "bg-gray-50"}`}>
            <p className="text-xs text-gray-500 font-medium mb-1">Age</p>
            <p className="text-base sm:text-lg font-bold text-gray-800">{patient.age}</p>
          </div>
          <div className={`rounded-lg p-3 ${isDischarged ? "bg-gray-100" : "bg-gray-50"}`}>
            <p className="text-xs text-gray-500 font-medium mb-1">Gender</p>
            <p className="text-base sm:text-lg font-bold text-gray-800">{patient.gender}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="font-medium truncate">{patient.phone}</span>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-2">
            Health Status
          </label>
          <select
            value={patient.currentStatus || "Normal"}
            onChange={(e) => onUpdateStatus(patient.id, e.target.value)}
            disabled={isDischarged}
            className={`w-full p-2.5 sm:p-3 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 outline-none ring-2 ${
              isDischarged
                ? "bg-gray-100 text-gray-500 ring-gray-200 cursor-not-allowed"
                : patient.currentStatus === "Critical"
                ? "bg-red-50 text-red-700 ring-red-200 hover:ring-red-300 hover:bg-red-100 cursor-pointer"
                : "bg-green-50 text-green-700 ring-green-200 hover:ring-green-300 hover:bg-green-100 cursor-pointer"
            }`}
          >
            <option value="Normal" className="bg-white text-green-700">
              ✓ Normal
            </option>
            <option value="Critical" className="bg-white text-red-700">
              ⚠ Critical
            </option>
          </select>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(patient);
          }}
          disabled={isDischarged}
          className={`w-full py-2.5 sm:py-3 px-4 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
            isDischarged
              ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-60"
              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:-translate-y-0.5"
          }`}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isDischarged ? "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" : "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"} />
          </svg>
          <span className="hidden sm:inline">{isDischarged ? "Editing Disabled" : "Edit Details"}</span>
          <span className="sm:hidden">{isDischarged ? "Locked" : "Edit"}</span>
        </button>
      </div>
    </div>
  );
}
