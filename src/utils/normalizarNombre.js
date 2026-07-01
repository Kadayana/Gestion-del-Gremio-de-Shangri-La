function normalizarNombre(nombre) {
    return nombre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[.,]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/s$/, "");
}

export default normalizarNombre;