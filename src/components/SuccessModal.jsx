function SuccessModal({ mensaje }) {
  return (
    <div
      className="
        fixed
        inset-0
        bg-black/50
        flex
        justify-center
        items-center
        z-[999]
      "
    >
      <div
        className="
           bg-pink-50
            border
            border-pink-200
            shadow-2xl
            rounded-3xl
            p-8
            text-center
            animate-bounce
          "
      >
        <div className="text-7xl mb-2">
          🎉
        </div>

        <h2 className="text-2xl font-bold text-pink-500">
          ¡Guardado!
        </h2>

        <p className="text-gray-600 mt-2">
          {mensaje}
        </p>
      </div>
    </div>
  );
}

export default SuccessModal;