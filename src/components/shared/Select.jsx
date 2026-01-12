export default function Select({ label, options, icon, ...props }) {
  return (
    <div>
      <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <span className="text-lg sm:text-xl">{icon}</span>
          </div>
        )}
        <select
          {...props}
          className={`w-full border-2 border-gray-200 ${icon ? 'pl-10 sm:pl-12' : 'pl-3 sm:pl-4'} pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base text-gray-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all cursor-pointer`}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
