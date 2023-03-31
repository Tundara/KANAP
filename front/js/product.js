let url = new URL(location.href);
let search_params = url.searchParams;
let param = search_params.get("id")

let Name
let price
let imageUrl
let altTxt
let description
let quantity

fetch("http://localhost:3000/api/products/"+param)
    .then((data) => data.json())
    .then((result) => {

        Name = result.name;
        price = result.price;
        imageUrl = result.imageUrl;
        altTxt = result.altTxt;
        description = result.description;

        document.querySelector(".item__img").innerHTML = `<img src="`+result.imageUrl+`" alt="`+result.altTxt+`">`;
        document.getElementById("title").innerHTML = result.name;
        document.getElementById("price").innerHTML = result.price;
        document.getElementById('description').innerHTML = result.description;
        for (let d of result.colors) {
            document.getElementById("colors").innerHTML +=  `<option value="`+d+`">`+d+`</option>`
        }
    })
    .catch((result) => {
        console.log("Error : ", result)
    })

document.getElementById("addToCart").addEventListener("click", () => {
    quantity = parseInt(document.getElementById("quantity").value)
    mycolor = document.getElementById("colors").value
    const storeParam = {
        ID: param,
        Name: Name,
        color: mycolor,
        quantity: quantity,
        price: price,
        imageUrl: imageUrl,
        altTxt: altTxt,
        description: description
    }

    currentCart = JSON.parse(localStorage.getItem("product"));
    console.log(quantity)
    if (quantity > 0) {
        if(currentCart) {
            const IsSame = currentCart.find((d) => d.ID == param && d.color == mycolor)
            if (IsSame) {
                let newquantity = parseInt(storeParam.quantity) + parseInt(IsSame.quantity)
                IsSame.quantity = newquantity
                localStorage.setItem("product", JSON.stringify(currentCart))
            } else {
                currentCart.push(storeParam)
                localStorage.setItem("product", JSON.stringify(currentCart))
            }
        } else {
            newCart = []
            newCart.push(storeParam)
            localStorage.setItem("product", JSON.stringify(newCart))
        }
        alert("Vous avez ajouter "+storeParam.quantity+" "+storeParam.Name+" "+storeParam.color+" à votre panier")
    } else if (quantity > 100) {
        alert("Pas plus de 100 elements autorisé");
    } else if (!mycolor) {
        alert("Vous devez choisir une couleur");
    } else {
        alert("Vous ne pouvez pas ajouter 0 article a votre panier");
    }

})
