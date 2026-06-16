function FilterButton({
  children,
  onClick,
  active,
  color = "white",
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-xl shadow transition

        ${active
          ? "scale-105 ring-2 ring-pink-300"
          : "hover:scale-105"}

        ${color}
      `}
    >
      {children}
    </button>
  );
}

export default FilterButton;