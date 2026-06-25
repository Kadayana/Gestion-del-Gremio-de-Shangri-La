function ErrorModal({ mensaje }) {

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
        </div>
    );
}

export default ErrorModal;