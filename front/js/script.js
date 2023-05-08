//Cette fonction recupere tous les produits et les affiches
function getAllProduct() {
  fetch("http://localhost:3000/api/products/")
  .then((data) => data.json())
  .then((result) => {
      console.log(result)
      for (let d of result) {
          document.getElementById("items").innerHTML += `
          <a href="./product.html?id=`+d._id+`">
          <article>
            <img src="`+d.imageUrl+`" alt="`+d.altTxt+`">
            <h3 class="productName">`+d.name+`</h3>
            <p class="productDescription">`+d.description+`</p>
          </article>
        </a>
          `
      }
  })
}

getAllProduct()