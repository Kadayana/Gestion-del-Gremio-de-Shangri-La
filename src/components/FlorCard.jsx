function FlorCard({ flor }) {

    const colores = {
        R: "bg-blue-100 text-blue-700",
        SR: "bg-purple-100 text-purple-700",
        SSR: "bg-yellow-100 text-yellow-700",
        UR: "bg-red-100 text-red-700",
    };

    const nombresRareza = {
    R: "R - Rara",
    SR: "SR - Super Rara",
    SSR: "SSR - Super Super Rara",
    UR: "UR - Ultra Rara",
};

    return (
        <div className="bg-pink-50 rounded-3xl shadow p-4 hover:shadow-lg transition hover:-translate-y-1 w-70">

            <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${colores[flor.rareza]
                    }`}
            >
                {nombresRareza[flor.rareza]}
            </span>

            <h3 className="font-semibold text-lg text-center mt-2 mb-3">
                🌸 {flor.nombre}
            </h3>

            <img
                className="w-50 h-50 object-cover rounded-2xl mx-auto"
                src={flor.imagen}
            />

        </div>
    );

}

export default FlorCard;