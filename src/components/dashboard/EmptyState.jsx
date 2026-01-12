export default function EmptyState({ filterStatus }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        {filterStatus === "Active" ? "Active Patients" : "Discharged Patients"} (0)
      </h2>
      
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
          No {filterStatus} Patients
        </h3>
        <p className="text-sm sm:text-base text-gray-500">
          {filterStatus === "Active" 
            ? "Add your first patient to get started" 
            : "No patients have been discharged yet"}
        </p>
      </div>
    </div>
  );
}
