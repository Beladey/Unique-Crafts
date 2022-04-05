const cartBtn = document.querySelector(".cart-btn")
const closeCartBtn = document.querySelector(".close-cart")
const clearCartBtn = document.querySelector(".clear-cart")
const cartDOM = document.querySelector(".cart")
const cartOverlay = document.querySelector( ".cart-overlay" )
const cartItems = document.querySelector( ".cart-items" )
const cartTotal = document.querySelector( ".cart-total" )
const cartContent = document.querySelector( ".cart-content" )
const productsDOM = document.querySelector( ".products-center" )
// cart
let cart = [];
// buttons
let buttonsDOM = [];
// getting the products
class Products{
 async getProducts() {
try {
 let result = await fetch( 'products.json' );
 let data = await result.json();
 let products = data.items;
 products = products.map( item => {
  const { title, price } = item.fields;
  const { id } = item.sys
  const image = item.fields.image.fields.file.url;
  return {title,price,id,image}
 } )
 return products
} catch (error) {
 console.log(error);
}
}
}
// display products
class UI {
  displayProducts( products ) {  
  let result = '';
  products.forEach( product => {
   result += `
   <!-- sigal product -->
        <artical class="product">
          <div class="img-container">
            <img src=${product.image} 
            alt="product" class="product-img">
            <button class="bag-btn" data-id=${product.id}>
              <span class="material-icons"> shopping_cart </span>
              <!-- <i class="fad fa-shopping-cart"></i> -->
              add to cart
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>$${product.price}</h4>
        </artical>
       <!-- end of sigal product -->
   `
  } );
    productsDOM.innerHTML = result;
 }
 getBagButtons() {
  const buttons = [...document.querySelectorAll( ".bag-btn" )];
  buttonsDOM = buttons;
  buttons.forEach( button => {
   let id = button.dataset.id;
   let inCart = cart.find( item => item.id === id );
   if (inCart) {
    button.textContent = "In Cart";
    button.disabled = true;
   } 
    button.addEventListener( "click", e => {
     e.target.textContent = "In Cart";
     e.target.disabled = true;
     // get product from products
     let cartItem = { ...Storage.getProduct( id ), amount: 1 };
     // add product to cart 
     cart = [...cart,cartItem]
     // save cart in local storage
     Storage.saveCart(cart)
     // set cart values
     this.SetCartValues(cart)
     // display cart item
     this.addCartItem(cartItem)
     // show the cart
     this.showCart();
     });
})
 }
 SetCartValues( cart ) {
  let tempTotal = 0;
  let itemsTotal = 0;
  cart.map( item => {
   tempTotal += item.price * item.amount;
   itemsTotal += item.amount;
  } );
  cartTotal.textContent = parseFloat( tempTotal.toFixed( 2 ) );
  cartItems.textContent = itemsTotal;
 }
 addCartItem(item) {
  const div = document.createElement( "div" );
  div.classList.add( "cart-item" );
  div.innerHTML = `
  <img src=${item.image} alt="product">
    <div>
  <H4>${item.title}</H4>
  <H5>$${item.price}</H5>
  <span class="remove-item" data-id=${item.id}>remove</span>
</div>
<div>
 <span class="material-icons arrow arrow-up" data-id=${item.id}>
arrow_drop_up
</span>
<!-- <i class="fas fa-chevron-up"></i> -->
<p class="item-amount">${item.amount}</p>
<!-- <i class="fas fa-chevron-down"></i> -->
<span class="material-icons arrow arrow-down" data-id=${item.id}>
arrow_drop_down</span>
</div>
`;
  cartContent.appendChild( div )
 }
 showCart() {
  cartOverlay.classList.add("transparentBcg");
  cartDOM.classList.add( "showCart" );
  }
  setupAPP() {
    cart = Storage.getCart();
    this.SetCartValues( cart );
    this.populateCart( cart );
    cartBtn.addEventListener( "click", this.showCart );
    closeCartBtn.addEventListener("click",this.hideCart);
  }
  populateCart( cart ) {
    cart.forEach( item => this.addCartItem( item ) );
  }
  hideCart() {
     cartOverlay.classList.remove("transparentBcg");
  cartDOM.classList.remove( "showCart" );
  }
  cartLogic() {
    clearCartBtn.addEventListener( "click", () => {
      this.clearCart();
    } );
    cartContent.addEventListener( "click", e => {
      if ( e.target.classList.contains( "remove-item" ) ) { 
        this.removeItem( e.target.dataset.id );
        cartContent.removeChild(e.target.closest(".cart-item"))
      } else if ( e.target.classList.contains( "arrow-up" ) ) {
        let tempItem = cart.find( item => item.id ===  e.target.dataset.id );
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart( cart );
        this.SetCartValues( cart );
        e.target.nextElementSibling.textContent = tempItem.amount;
      } else if ( e.target.classList.contains( "arrow-down" ) ) {
        let tempItem = cart.find( item => item.id === e.target.dataset.id );
        tempItem.amount = tempItem.amount - 1;
        if ( tempItem.amount > 0 ) {
          Storage.saveCart( cart );
          this.SetCartValues( cart );
          e.target.previousElementSibling.textContent = tempItem.amount;
        } else {
          cartContent.removeChild( e.target.closest( ".cart-item" ) );
          this.removeItem(e.target.dataset.id)
        }
      }
    });
  }
  clearCart() {
    let cartItems = cart.map( item => item.id )
    cartItems.forEach( id => this.removeItem( id ) );
    while ( cartContent.children.length > 0 ) {
      cartContent.removeChild(cartContent.children[0])
    }
    this.hideCart();
  }
  removeItem(id) {
    cart = cart.filter( item => item.id !== id );
    this.SetCartValues( cart );
    Storage.saveCart( cart );
    let button = this.getSingleButton( id );
    button.disabled = false;
    button.innerHTML = `<span class="material-icons"> shopping_cart </span>
    add to cart`;
  }
  getSingleButton(id) {
    return buttonsDOM.find( btn => btn.dataset.id === id );
  }
}

// local storage
class Storage{
 static saveProducts( products ) {
 localStorage.setItem("UniqueCraftsProducts", JSON.stringify(products))
 }
 static getProduct(id) {
  let products = JSON.parse( localStorage.getItem( "UniqueCraftsProducts" ) );
  return products.find( product => product.id === id)
 }
 static saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
  }
  static getCart() {
    return localStorage.getItem( 'cart' ) ?
      JSON.parse( localStorage.getItem( 'cart' ) ) 
      :[]
  }
}

document.addEventListener( "DOMContentLoaded", e => {
 const ui = new UI()
 const products = new Products() 
// setup app
  ui.setupAPP();
 // get all products
 products.getProducts().then( products =>{
 ui.displayProducts( products);
  Storage.saveProducts( products );
 } ).then( () => {
   ui.getBagButtons();
   ui.cartLogic()
});
});