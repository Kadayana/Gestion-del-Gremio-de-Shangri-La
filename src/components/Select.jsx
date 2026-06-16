function Select({
  value,
  onChange,
  options = [],
  placeholder
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="
        w-full
        border
        rounded-xl
        p-3
        focus:outline-none
        focus:ring-2
        focus:ring-pink-300
      "
    >
      <option value="">
        {placeholder}
      </option>

      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Select;