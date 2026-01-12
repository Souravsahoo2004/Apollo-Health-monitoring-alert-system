export default function DashboardHeader({ 
  doctorName, 
  filterStatus, 
  setFilterStatus, 
  onAddPatient,
  mobileMenuOpen,
  setMobileMenuOpen,
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter
}) {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Mobile Header */}
        <div className="flex md:hidden justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Doctor Dashboard</h1>
            <p className="text-blue-100 text-sm flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Dr. {doctorName}
            </p>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2 tracking-tight">
              Doctor Dashboard
            </h1>
            <p className="text-blue-100 text-base lg:text-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Welcome, Dr. {doctorName}
            </p>
          </div>

          <button
            onClick={onAddPatient}
            className="group bg-white text-blue-600 px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 text-sm lg:text-base"
          >
            <span className="text-xl lg:text-2xl group-hover:rotate-90 transition-transform duration-300">+</span>
            <span className="hidden sm:inline">Add Patient</span>
          </button>
        </div>

        {/* Search and Filters - Desktop */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 mt-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search patients by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 border-2 border-white/30 px-4 py-2.5 pl-11 rounded-xl font-medium hover:bg-white/20 transition-all outline-none"
            />
            <svg 
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-4 py-2.5 rounded-xl font-semibold cursor-pointer hover:bg-white/20 transition-all outline-none"
          >
            <option value="Active" className="text-gray-800">👥 Active Patients</option>
            <option value="Discharged" className="text-gray-800">📋 Discharged Patients</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-4 py-2.5 rounded-xl font-semibold cursor-pointer hover:bg-white/20 transition-all outline-none"
          >
            <option value="all" className="text-gray-800">📅 All Patients</option>
            <option value="today" className="text-gray-800">📅 Today</option>
            <option value="yesterday" className="text-gray-800">📅 Yesterday</option>
            <option value="last7days" className="text-gray-800">📅 Last 7 Days</option>
            <option value="last30days" className="text-gray-800">📅 Last 30 Days</option>
            <option value="thisMonth" className="text-gray-800">📅 This Month</option>
            <option value="lastMonth" className="text-gray-800">📅 Last Month</option>
          </select>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-2">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 border-2 border-white/30 px-4 py-3 pl-11 rounded-xl font-medium outline-none"
              />
              <svg 
                className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
              }}
              className="w-full bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-4 py-3 rounded-xl font-semibold cursor-pointer outline-none"
            >
              <option value="Active" className="text-gray-800">👥 Active Patients</option>
              <option value="Discharged" className="text-gray-800">📋 Discharged Patients</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-4 py-3 rounded-xl font-semibold cursor-pointer outline-none"
            >
              <option value="all" className="text-gray-800">📅 All Patients</option>
              <option value="today" className="text-gray-800">📅 Today</option>
              <option value="yesterday" className="text-gray-800">📅 Yesterday</option>
              <option value="last7days" className="text-gray-800">📅 Last 7 Days</option>
              <option value="last30days" className="text-gray-800">📅 Last 30 Days</option>
              <option value="thisMonth" className="text-gray-800">📅 This Month</option>
              <option value="lastMonth" className="text-gray-800">📅 Last Month</option>
            </select>

            {/* Add Patient Button */}
            <button
              onClick={() => {
                onAddPatient();
                setMobileMenuOpen(false);
              }}
              className="w-full group bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">+</span>
              Add New Patient
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
