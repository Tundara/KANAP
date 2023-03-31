let url = new URL(location.href);
let search_params = url.searchParams;
let param = search_params.get("id")

localStorage.clear();
document.getElementById("orderId").innerHTML = param;