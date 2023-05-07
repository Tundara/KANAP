items = localStorage.getItem("product")
localstorage = JSON.parse(items)

let totalPrice = 0
let totalQuantity = 0

function getCartElement() {
    for (let d in localstorage) {
        document.getElementById("cart__items").innerHTML += `
         <article class="cart__item" data-id="${localstorage[d].ID}" data-color="${localstorage[d].color}">
             <div class="cart__item__img">
              <img src="${localstorage[d].imageUrl}" alt="${localstorage[d].altTxt}">
             </div>
             <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${localstorage[d].Name}</h2>
                <p>${localstorage[d].color}</p>
               <p>${localstorage[d].price}</p>
              </div>
             <div class="cart__item__content__settings">
               <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${localstorage[d].quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                 <p class="deleteItem">Supprimer</p>
                </div>
            </div>
            </div>
        </article>
        `
    }
}

function confirmCart(firstname, name, address, city, email) {
    let products = []
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
                window.location.href = "confirmation.html?id="+res.orderId;
            })
    } else {
        alert("Tous les champs ne sont pas rempli")
    }
}

function getTotalQuantityAndPrice() {
    let quantitydiv = document.getElementsByClassName("itemQuantity")

    for (let i=0; i < quantitydiv.length; i++){
        totalQuantity += quantitydiv[i].valueAsNumber;
    }

    document.getElementById("totalQuantity").innerHTML = totalQuantity

    for(let j=0; j < quantitydiv.length; j++){
        totalPrice += (quantitydiv[j].valueAsNumber * localstorage[j].price)
    }

    document.getElementById("totalPrice").innerHTML = totalPrice
}

function modifyQuantityInCart() {
    let allquantity = document.querySelectorAll(".itemQuantity")
    const el = document.querySelector(".cart__item");
    for(let i=0; i < allquantity.length; i++) {
        allquantity[i].addEventListener("change", (d) => {
            d.preventDefault();
            console.log(el.closest(".cart__item").dataset.id)
            if (el.closest(".cart__item").dataset.id == localstorage[i].ID) {
                const findquantity = localstorage.find((d) => allquantity[i].valueAsNumber != localstorage[i].quantity);
                findquantity.quantity = allquantity[i].valueAsNumber;
                localstorage[i].quantity = findquantity.quantity;
                console.log(allquantity[i].valueAsNumber)
                localStorage.setItem("product", JSON.stringify(localstorage));
                location.reload()
            }
        })
    }
}

function deleteCartElement() {
    let deletebtn = document.querySelectorAll(".deleteItem")

    for (let i=0; i < deletebtn.length; i++) {
        deletebtn[i].addEventListener("click", (d) => {
            d.preventDefault();

            let currentCart = localstorage.filter((d) => d.ID != localstorage[i].ID || d.color != localstorage[i].color )
            localStorage.setItem("product", JSON.stringify(currentCart))
            location.reload();
        })
    }
}

addEventListener("submit", (d) => {
    d.preventDefault();
    let firstname = d.target.firstName.value
    let name = d.target.lastName.value
    let address = d.target.address.value
    let city = d.target.city.value
    let email = d.target.email.value

    confirmCart(firstname, name, address, city, email)
})

getCartElement()
getTotalQuantityAndPrice()
modifyQuantityInCart()
deleteCartElement()

