function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
        w-full
        border
        rounded-xl
        p-3
        focus:outline-none
        focus:ring-2
        focus:ring-pink-300
      "
    />
  );
}

export default Input;