function ErrorModal({ mensaje }) {

    return (
        <div
            className="
                fixed
                top-5
                right-5
                z-[9999]
                bg-red-500
                text-white
                px-6
                py-4
                rounded-2xl
                shadow-xl
                animate-bounce
            "
        >
            {mensaje}
        </div>
    );
}

export default ErrorModal;