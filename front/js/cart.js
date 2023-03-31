items = localStorage.getItem("product")
parse = JSON.parse(items)

let totalPrice = 0
let totalQuantity = 0

function getCartElement() {
    for (let d in parse) {
        document.getElementById("cart__items").innerHTML += `
         <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
             <div class="cart__item__img">
              <img src="`+parse[d].imageUrl+`" alt="`+parse[d].altTxt+`">
             </div>
             <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>`+parse[d].Name+`</h2>
                <p>`+parse[d].color+`</p>
               <p>`+parse[d].price+`</p>
              </div>
             <div class="cart__item__content__settings">
               <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="`+parse[d].quantity+`">
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
    for (let i=0; i < parse.length; i++) {
        products.push(parse[i].ID)
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
}

function getTotalQuantityAndPrice() {
    let quantitydiv = document.getElementsByClassName("itemQuantity")

    for (let i=0; i < quantitydiv.length; i++){
        totalQuantity += quantitydiv[i].valueAsNumber;
    }

    document.getElementById("totalQuantity").innerHTML = totalQuantity

    for(let j=0; j < quantitydiv.length; j++){
        totalPrice += (quantitydiv[j].valueAsNumber * parse[j].price)
    }

    document.getElementById("totalPrice").innerHTML = totalPrice
}

function modifyQuantityInCart() {
    let allquantity = document.querySelectorAll(".itemQuantity")

    for(let i=0; i < allquantity.length; i++) {
        allquantity[i].addEventListener("change", (d) => {
            d.preventDefault();

            const findquantity = parse.find((d) => allquantity[i].valueAsNumber != parse[i].quantity);
            findquantity.quantity = allquantity[i].valueAsNumber;
            parse[i].quantity = findquantity.quantity;
            localStorage.setItem("product", JSON.stringify(parse));
            location.reload()
        })
    }
}

function deleteCartElement() {
    let deletebtn = document.querySelectorAll(".deleteItem")

    for (let i=0; i < deletebtn.length; i++) {
        deletebtn[i].addEventListener("click", (d) => {
            d.preventDefault();

            let currentCart = parse.filter((d) => d.ID != parse[i].ID || d.color != parse[i].color )
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

