const cartBtn = document.querySelector(".cart-btn")
const closeCartBtn = document.querySelector(".close-cart")
const clearCartBtn = document.querySelector(".clear-cart")
const cartDOM = document.querySelector(".cart")
const cartOverlay = document.querySelector( ".cart-overlay" )
const cartItems = document.querySelector( ".cart-items" )
const cartTotal = document.querySelector( ".cart-total" )
const cartContent = document.querySelector( ".cart-content" )
const productsDOM = document.querySelector( ".products-center" )
let currentImg = 1;
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
  const image2 = item.fields.image2.fields.file.url;
  const image3 = item.fields.image3.fields.file.url;
  return {title,price,id,image,image2,image3}
  } )
 return products
} catch (error) {
 console.log(error);
}
  }
  filterProducts( pod, str ) {
    if (str) {
    return pod.filter(p=> p.title.includes(str.toLowerCase()))  
    }
   return pod.filter(p=> p)  
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
            <img loading="lazy" src=${product.image}
            alt="product" class="product-img">
            <img loading="lazy" src=${product.image2} 
            alt="product" class="product-img">
            <img loading="lazy" src=${product.image3} 
            alt="product" class="product-img">
            <i class="fa-solid fa-arrow-left"></i>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
          <h3>
           <i class="fa fa-search"></i>
          </h3>
            <h3> <button class="bag-btn" data-id=${product.id}>
              <span class="material-icons"> shopping_cart </span>
              add to cart
            </button></h3>
          <h3>${product.title}</h3>
          <h4>$${product.price}</h4>
     <p class="enquery">Equery about this product</p>
    <div class="contact-container ">
        <form
          id="contact"
          name="Contact us"
          method="post"
          data-netlify="true"
          action="received.html"
        > 
          <fieldset>
            <input
              placeholder="Name (required)"
              type="text"
              name="Name"
              tabindex="1"
              required
              autofocus
            />
          </fieldset>
          <fieldset>
          <label for="">Date:</label>
            <input
              placeholder="Date required (required)"
              name="Date required"
              type="date"
              tabindex="2"
              required
            />
          </fieldset>
          <fieldset>
          <label for="">Address</Address>:</label>
            <input
              placeholder="Address (required)"
              name="Address"
              type="text"
              tabindex="2"
              required
            />
          </fieldset>
          <fieldset>
            <input
              placeholder="Email address (required)"
              name="Email address"
              type="email"
              tabindex="2"
              required
            />
          </fieldset>
          <fieldset>
            <input placeholder="Phone" name="Phone" type="tel" tabindex="3" />
          </fieldset>
          <fieldset>
            <input
            placeholder="${product.title}" 
            name="${product.title}" 
            type="tel" tabindex="4" />
          </fieldset>
          <fieldset>
            <textarea
              placeholder="The question...."
              tabindex="5"
              name="The question"
              required
            ></textarea>
          </fieldset>
          <fieldset>
            <button
              name="submit"
              type="submit"
              id="contact-submit"
              data-submit="...Send"
            >
              Send
            </button>
          </fieldset>
        </form>
      </div>
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
    //button.disabled = true;
   } 
    button.addEventListener( "click", e => {
     e.target.textContent = "In Cart";
    // e.target.disabled = true;
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
  <img loading="lazy" src=${item.image} alt="product">
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
    cartItems.addEventListener( "click", this.showCart );
   // document.querySelector(".fa-cart-shopping").addEventListener( "click", this.showCart );
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

function loadContent() {
  const ui = new UI()
 const items = new Products() 
// setup app
  ui.setupAPP();
  // get all products 
  items.getProducts().then( products => {

 ui.displayProducts(items.filterProducts(products, search.value)); 

const imgCont = document.querySelectorAll( ".img-container" )
   activeImg()
   document.querySelectorAll( ".fa-solid" ).forEach(m=> m.addEventListener("click", actIndImg))
   document.querySelectorAll( ".fa-search" ).forEach( s => s.addEventListener( "click", rezizeImg ) )
   document.querySelectorAll( ".enquery" ).forEach(el=> el.addEventListener( "click", enqProd ))
     
  Storage.saveProducts( products );
 } ).then( () => {
   ui.getBagButtons();
   ui.cartLogic()
   
});
}

document.addEventListener( "DOMContentLoaded", e => {
loadContent()
} );

search.addEventListener( "input", e => {
  loadContent()
});



(() =>{
 
  const openNavMenu = document.querySelector(".open-nav-menu"),
  closeNavMenu = document.querySelector(".close-nav-menu"),
  navMenu = document.querySelector(".nav-menu"),
  menuOverlay = document.querySelector(".menu-overlay"),
  mediaSize = 991;

  openNavMenu.addEventListener("click", toggleNav);
  closeNavMenu.addEventListener("click", toggleNav);
  // close the navMenu by clicking outside
  menuOverlay.addEventListener("click", toggleNav);

  function toggleNav() {
  	navMenu.classList.toggle("open");
  	menuOverlay.classList.toggle("active");
  	document.body.classList.toggle("hidden-scrolling");
  }

  navMenu.addEventListener("click", (event) =>{
      if(event.target.hasAttribute("data-toggle") && 
      	window.innerWidth <= mediaSize){
      	// prevent default anchor click behavior
      	event.preventDefault();
      	const menuItemHasChildren = event.target.parentElement;
        // if menuItemHasChildren is already expanded, collapse it
        if(menuItemHasChildren.classList.contains("active")){
        	collapseSubMenu();
        }
        else{
          // collapse existing expanded menuItemHasChildren
          if(navMenu.querySelector(".menu-item-has-children.active")){
        	collapseSubMenu();
          }
          // expand new menuItemHasChildren
          menuItemHasChildren.classList.add("active");
          const subMenu = menuItemHasChildren.querySelector(".sub-menu");
          subMenu.style.maxHeight = subMenu.scrollHeight + "px";
        }
      }
  });
  function collapseSubMenu(){
  	navMenu.querySelector(".menu-item-has-children.active .sub-menu")
  	.removeAttribute("style");
  	navMenu.querySelector(".menu-item-has-children.active")
  	.classList.remove("active");
  }
  function resizeFix(){
  	 // if navMenu is open ,close it
  	 if(navMenu.classList.contains("open")){
  	 	toggleNav();
  	 }
  	 // if menuItemHasChildren is expanded , collapse it
  	 if(navMenu.querySelector(".menu-item-has-children.active")){
        	collapseSubMenu();
     }
  }

  window.addEventListener("resize", function(){
     if(this.innerWidth > mediaSize){
     	resizeFix();
     }
  });

})();


function activeImg() {
  const imgeContainer = Array.from( document.querySelectorAll( ".img-container" ) )
  imgeContainer.forEach( container => {
    container.querySelector( ".product-img" ).classList.add( "active" )
})
}

 function actIndImg(e) {
  const imgeContainer = Array.from( document.querySelectorAll( ".img-container" ) )
  if ( e.target.classList.contains("fa-solid") ) {
    imgeContainer.forEach(container => {
   const imgs = Array.from( container.querySelectorAll( ".img-container .product-img" ) );
    } )
   }
   const sinIm = e.target.parentElement.querySelectorAll( ".product-img" )[currentImg];
   e.target.parentElement.querySelectorAll( ".product-img" ).forEach(m=> m.classList.remove( "active" ) )
   sinIm.classList.add( "active" ) 
  if ( currentImg ==2 ) {
  currentImg = -1
   }
  currentImg++
}

function rezizeImg(e) {
  const sinIm = e.target.closest( ".product" ).querySelector( ".img-container" );
  if ( !sinIm.classList.contains( "big-size" ) ) {
  document.querySelectorAll( ".img-container" ).forEach(m=> m.classList.remove("big-size"))
}
  sinIm.classList.toggle( "big-size" );
}

function enqProd( e ) {
  if (!e.target.nextElementSibling.classList.contains( "show" ) ) {
  document.querySelectorAll( ".enquery" ).forEach(m=> m.nextElementSibling.classList.remove("show"))
}
  if ( e.target.classList.contains( "enquery" ) ) {
    e.target.nextElementSibling.classList.toggle( "show" );
  }
}
