let url = new URL(location.href);
let search_params = url.searchParams;
let param = search_params.get("id")

//Cette fonction permet d'affiché l'ID de confirmation puis de supprimer le localstorage
function Confirmation() {
    localStorage.clear();
    document.getElementById("orderId").innerHTML = param;
}

Confirmation()