function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="flex justify-center mb-6">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          max-w-md
          px-4
          py-3
          rounded-2xl
          border
          border-pink-200
          bg-white
          shadow-sm
          outline-none
          focus:ring-2
          focus:ring-pink-300
          focus:border-pink-300
          transition
        "
      />
    </div>
  );
}

export default SearchBar;