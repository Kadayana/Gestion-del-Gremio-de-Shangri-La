function Button({
  className = "",
  children,
  onClick,
  active = false,
  variant = "default",
}) {

  const variantes = {
    default: active
      ? "bg-pink-300 shadow-md"
      : "bg-white shadow hover:shadow-md",

    primary:
      "bg-pink-300 text-white shadow hover:shadow-md hover:bg-pink-400",

    secondary:
      "bg-gray-200 text-gray-700 shadow hover:shadow-md hover:bg-gray-300",

    danger:
      "bg-red-300 text-white shadow hover:shadow-md hover:bg-red-400",
  };

  return (
    <button
      onClick={onClick}
      className={`
        font-medium
        px-5
        py-2
        rounded-2xl
        transition

        ${variantes[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;