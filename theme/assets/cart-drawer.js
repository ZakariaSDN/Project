class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.bindEvents();
   
     document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  bindEvents() {
    if(document.querySelector("[data-cart-drawer-btn]")){
       document.querySelector("[data-cart-drawer-btn]").addEventListener('click', this.openDrawer.bind(this))
    }
    this.querySelectorAll('[data-close-drawer]').forEach((button) =>
      button.addEventListener('click', this.closeDrawer.bind(this))
    );
   this.dialogEvents();
  }
  dialogEvents(){
     let focusElementDrawer='';
    Array.from(this.querySelectorAll('.cart-modal-button')).forEach(function(button){
      button.addEventListener('click',function(e){
        let modal = button.dataset.modal;
        let dialog = this.querySelector(`cart-dialog#${modal}`);
        if(dialog){
          dialog.style.display = 'block';
          setTimeout(function(){
            dialog.classList.add('active');
            setTimeout(function(){
              focusElementDrawer = button;
              trapFocusElements(dialog);
            },500)
          },200)
        }
      }.bind(this))
    }.bind(this))
    Array.from(this.querySelectorAll('.cart-dialog-close')).forEach(function(button){
      button.addEventListener('click',function(e){
        e.preventDefault()
        button.closest('cart-dialog').classList.remove('active');      
        trapFocusElements(document.querySelector("cart-drawer"));
         setTimeout(function(){
            button.closest('cart-dialog').style.display = 'none';  
             if(focusElementDrawer){
                 focusElementDrawer.focus()
              }
            focusElementDrawer = '';
          },400)
      })
    })
  }
  openDrawer(event) {
    event.preventDefault();
    fetch(this.dataset.url)
      .then(response => response.text())
      .then(html => {
         const drawerInner = this.querySelector('.drawer-inner-card');
         const drawerHtml = this.getSectionInnerHTML(html, '.drawer-inner-card');
         if (!drawerInner || drawerHtml === null) return;
         drawerInner.innerHTML = drawerHtml;
         this.classList.add("open");
         document.querySelector("body").classList.add("no-scroll");
          this.querySelectorAll('[data-close-drawer]').forEach((button) =>
            button.addEventListener('click', this.closeDrawer.bind(this))
          );
          setTimeout(function(){
          focusElement = event.target; 
          trapFocusElements(document.querySelector("cart-drawer"))
        },500)
          this.dialogEvents();
       
         setTimeout(function(){
           fetch("/cart.js")
          .then(response => response.json())
           .then((data) => {
              let totalprice=data.total_price;
              shippingBarProgress(totalprice);            
           })
        },500)
      })

   
      .catch(e => {
        console.error(e);
      });
  }
  renderContents(parsedState) {
    if(!parsedState) return; 
    this.getSectionsToRender().forEach((section => {
      if (document.getElementById(section.id)) {
        const sectionHtml = parsedState.sections?.[section.id];
        if (!sectionHtml) return;
        const target = document.getElementById(section.id).querySelector(section.selector);
        const targetHtml = this.getSectionInnerHTML(sectionHtml, section.selector);
        if (!target || targetHtml === null) return;
        target.innerHTML = targetHtml;
        const cartDrawerBody = new DOMParser().parseFromString(sectionHtml, 'text/html').querySelector("#cart-drawer-body");
        const totalCount = parseInt(cartDrawerBody?.getAttribute("data-cart-count") || '0', 10);
        if(document.querySelector("[data-item-count]")){
             if( document.querySelector("[data-item-count]").classList.contains("hidden")){
                document.querySelector("[data-item-count]").classList.remove("hidden")
             }
             if(totalCount == 0){
                document.querySelector("[data-item-count]").classList.add("hidden")
             }
             else if(totalCount < 100){
               document.querySelector("[data-item-count]").textContent = totalCount;
             }else {
               document.querySelector("[data-item-count]").textContent = '99+';
             }
         }
        if(document.querySelector("[data-cart-price]")){
          let totalprice = parseInt(document.querySelector("[data-cart-price]").dataset.cartPrice);
          shippingBarProgress(totalprice); 
        }
        this.dialogEvents();
         this.querySelectorAll('[data-close-drawer]').forEach((button) =>
          button.addEventListener('click', this.closeDrawer.bind(this))
        );
      }
    }));
  }
  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        section: 'cart-drawer',
        selector: '.drawer-inner-card'
      }
    ];
  }
  getSectionInnerHTML(html, selector = ".drawer-inner-card") {
    const element = new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
    return element ? element.innerHTML : null;
  } 
  closeDrawer(event){
     event.preventDefault();
     const closeElement = event.currentTarget;
      if(this.classList.contains("open")){
        this.classList.remove("open");
         document.querySelector("body").classList.remove("no-scroll");
      }
      if(focusElement){
         focusElement.focus()
      }
      focusElement = ''
      removeTrapFocus();
      
  }
  handleKeyDown(event) {
    if (event.key === 'Escape') {
      this.closeDrawer(event); // Call closeDrawer when Escape is pressed
    }
  }
}

customElements.define('cart-drawer', CartDrawer);
