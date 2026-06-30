import { useState } from "react";

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}) {

  const [mostrar, setMostrar] = useState(false);

  const esPassword = type === "password";

  return (
    <div className="relative w-full">
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={
                    esPassword
                        ? (mostrar ? "text" : "password")
                        : type
                }
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

    {
                esPassword && (
                    <button
                        type="button"
                        onClick={() =>
                            setMostrar(!mostrar)
                        }
                        className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-xl
                        "
                    >
                        {mostrar ? "🙈" : "🙉"}
                    </button>
                )
            }

        </div>
  );
}

export default Input;