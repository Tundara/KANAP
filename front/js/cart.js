items = localStorage.getItem("product")
localstorage = JSON.parse(items)

let totalPrice = 0
let totalQuantity = 0

//Cette fonction effectue une requête HTTP asynchrone à une API pour récupérer le prix d'un produit spécifié par son ID.
async function getPriceByID(id) {
    return await fetch("http://localhost:3000/api/products/")
    .then((d)=>d.json())
    .then((res) => { 
        for (let x of res) {
            if (x._id == id) {
                return x.price
            }
        }
    })
}

//Cette fonction retourne un nouveau localstorage avec une nouvelle quantité
function getNewLocalstorage(myID, valueAsNumber, color) {
    let panier = JSON.parse(localStorage.getItem("product"))
    for (let z of panier) {
        if (myID == z.ID) {
            const findquantity = localstorage.find((d) => valueAsNumber != z.quantity || d.color != z.color);
            findquantity.quantity = valueAsNumber
            z.quantity = findquantity.quantity
            return panier
        }
    }
} 

//Cette fonction récupère les éléments du panier dans le localStorage et affiche leurs informations
async function getCartElement() {
    const promises = localstorage.map((element) => getPriceByID(element.ID));
    Promise.all(promises)
    .then((prices)=> {
        localstorage.forEach((d, index) => {
            document.getElementById("cart__items").innerHTML += `
            <article class="cart__item" data-id="${d.ID}" data-color="${d.color}">
                <div class="cart__item__img">
                <img src="${d.imageUrl}" alt="${d.altTxt}">
                </div>
                <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${d.Name}</h2>
                    <p>${d.color}</p>
                    <p>${prices[index]}</p>
                </div>
                <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${d.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
                </div>
            </article>
            `
        })
        getTotalQuantityAndPrice()
        modifyQuantityInCart()
        deleteCartElement()
    }).catch((error) => {
        console.log(error);
    });
}

//Cette fonction envoie une requête à une API pour confirmer la commande et redirige l'utilisateur vers une page de confirmation en cas de succès.
function confirmCart(firstname, name, address, city, email) {
    let products = []
    if (localStorage.length) {
        for (let i=0; i < localstorage.length; i++) {
            products.push(localstorage[i].ID)
        }
    
        const body = {
            contact: {
                firstName: firstname,
                lastName: name,
                address: address,
                city: city,
                email: email,
            },
            products: products,
        }
        if (firstname != "" && name != "" && address != "" && city != "" && email != "") {
            if (firstname.match("^[a-zA-Z]+$") && name.match("^[a-zA-Z]+$") && city.match("^[a-zA-Z]+$") && email.match(/^[\w.-]+@[a-z0-9.-]+\.[a-z]{2,}$/i)) {
                fetch("http://localhost:3000/api/products/order", {
                    method: "POST",
                    headers : {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                    })
                    .then((data) => {
                        if(data.status == 201) {
                            return data.json();
                        } else {
                            alert("Error 10")
                        }
                    })
                    .then((res) => {
                        window.location.href = `confirmation.html?id=${res.orderId}`;
                    })
            } else {
                alert("Vos champs ne sont pas formaté correctement")
            }
        } else {
            alert("Tous les champs ne sont pas rempli")
        }
    } else {
        alert("Votre panier est vide")
    }
}

//Cette fonction calcule le prix total et la quantité totale des produits dans le panier
function getTotalQuantityAndPrice() {
    let quantitydiv = document.querySelectorAll(".itemQuantity")
    let myID
    quantitydiv.forEach(res => {
        myID = res.closest(".cart__item").dataset.id
        console.log(myID)
        getPriceByID(myID)
        .then((price) => {
        
            totalQuantity += res.valueAsNumber;
            totalPrice += (res.valueAsNumber * price)
        
        
            document.getElementById("totalQuantity").innerHTML = totalQuantity
            document.getElementById("totalPrice").innerHTML = totalPrice
    })
    })
}

//Cette fonction permet de modifier la quantité d'un produit dans le panier en mettant à jour le localStorage
function modifyQuantityInCart() {
    let allquantity = document.querySelectorAll(".itemQuantity")

    for(let i=0; i < allquantity.length; i++) {
        allquantity[i].addEventListener("change", (d) => {
            d.preventDefault();
            let myID = allquantity[i].closest(".cart__item").dataset.id;
            console.log(myID)
            let panier = getNewLocalstorage(myID, allquantity[i].valueAsNumber, d.color)
            localStorage.setItem("product", JSON.stringify(panier));
            location.reload()
        })
    }
}

//Cette fonction permet à l'utilisateur de supprimer un produit du panier en mettant à jour le localStorage et en rechargeant la page
function deleteCartElement() {
    let deletebtn = document.querySelectorAll(".deleteItem")
    console.log(deletebtn)
    for (let i=0; i < deletebtn.length; i++) {
        deletebtn[i].addEventListener("click", (d) => {
            d.preventDefault();

            let currentCart = localstorage.filter((d) => d.ID != localstorage[i].ID || d.color != localstorage[i].color)
            localStorage.setItem("product", JSON.stringify(currentCart))
            location.reload();
        })
    }
}

// Cette fonction permet d'envoyer le formulaire une fois le panier validé
function submitForm() {
    addEventListener("submit", (d) => {
        d.preventDefault();
        let firstname = d.target.firstName.value
        let name = d.target.lastName.value
        let address = d.target.address.value
        let city = d.target.city.value
        let email = d.target.email.value
    
        confirmCart(firstname, name, address, city, email)
    })
}

getCartElement()
submitForm()