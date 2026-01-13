import PatientCard from "./PatientCard";
import EmptyState from "./EmptyState";

export default function PatientsList({ 
  patients, 
  filterStatus,
  searchQuery,
  dateFilter,
  onViewHealthData,
  onUpdateStatus,
  onUpdateActiveStatus,
  onEdit,
  onDelete,  // ✅ ADDED onDelete prop
}) {
  // Filter patients by status, search query, and date
  const filteredPatients = patients.filter((patient) => {
    // Status filter
    const matchesStatus = (patient.activeStatus || "Active") === filterStatus;
    
    // Search filter
    const matchesSearch = searchQuery === "" || 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery);
    
    // Date filter
    const matchesDate = (() => {
      if (dateFilter === "all") return true;
      if (!patient.createdAt) return false;

      const patientDate = patient.createdAt.toDate();
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const patientDay = new Date(patientDate.getFullYear(), patientDate.getMonth(), patientDate.getDate());

      switch (dateFilter) {
        case "today":
          return patientDay.getTime() === today.getTime();

        case "yesterday":
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return patientDay.getTime() === yesterday.getTime();

        case "last7days":
          const last7Days = new Date(today);
          last7Days.setDate(last7Days.getDate() - 7);
          return patientDate >= last7Days && patientDate <= now;

        case "last30days":
          const last30Days = new Date(today);
          last30Days.setDate(last30Days.getDate() - 30);
          return patientDate >= last30Days && patientDate <= now;

        case "thisMonth":
          return (
            patientDate.getMonth() === now.getMonth() &&
            patientDate.getFullYear() === now.getFullYear()
          );

        case "lastMonth":
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          return (
            patientDate.getMonth() === lastMonth.getMonth() &&
            patientDate.getFullYear() === lastMonth.getFullYear()
          );

        default:
          return true;
      }
    })();

    return matchesStatus && matchesSearch && matchesDate;
  });

  if (filteredPatients.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          {filterStatus === "Active" ? "Active Patients" : "Discharged Patients"} (0)
        </h2>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            No Patients Found
          </h3>
          <p className="text-sm sm:text-base text-gray-500">
            {searchQuery 
              ? `No patients match "${searchQuery}"` 
              : `No ${filterStatus.toLowerCase()} patients found for the selected date range`
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {filterStatus === "Active" ? "Active Patients" : "Discharged Patients"} ({filteredPatients.length})
        </h2>
        
        {(searchQuery || dateFilter !== "all") && (
          <p className="text-sm text-gray-500">
            {searchQuery && `Searching: "${searchQuery}"`}
            {searchQuery && dateFilter !== "all" && " • "}
            {dateFilter !== "all" && `Filter: ${getDateFilterLabel(dateFilter)}`}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredPatients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onViewHealthData={onViewHealthData}
            onUpdateStatus={onUpdateStatus}
            onUpdateActiveStatus={onUpdateActiveStatus}
            onEdit={onEdit}
            onDelete={onDelete}  // ✅ FIXED: Added onDelete prop
          />
        ))}
      </div>
    </div>
  );
}

function getDateFilterLabel(filterType) {
  const labels = {
    all: "All Time",
    today: "Today",
    yesterday: "Yesterday",
    last7days: "Last 7 Days",
    last30days: "Last 30 Days",
    thisMonth: "This Month",
    lastMonth: "Last Month"
  };
  return labels[filterType] || "All Time";
}
