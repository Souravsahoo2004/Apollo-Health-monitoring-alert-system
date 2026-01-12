export const dateFilters = {
  // Check if a date matches the filter criteria
  matchesFilter(timestamp, filterType) {
    if (filterType === "all") return true;
    if (!timestamp) return false;

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const patientDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    switch (filterType) {
      case "today":
        return patientDate.getTime() === today.getTime();

      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return patientDate.getTime() === yesterday.getTime();

      case "last7days":
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        return date >= last7Days && date <= now;

      case "last30days":
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        return date >= last30Days && date <= now;

      case "thisMonth":
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );

      case "lastMonth":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return (
          date.getMonth() === lastMonth.getMonth() &&
          date.getFullYear() === lastMonth.getFullYear()
        );

      default:
        return true;
    }
  },

  // Get display text for filter
  getFilterLabel(filterType) {
    const labels = {
      all: "All Patients",
      today: "Today",
      yesterday: "Yesterday",
      last7days: "Last 7 Days",
      last30days: "Last 30 Days",
      thisMonth: "This Month",
      lastMonth: "Last Month"
    };
    return labels[filterType] || "All Patients";
  }
};
