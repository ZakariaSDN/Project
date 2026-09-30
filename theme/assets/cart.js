class CartRemoveItem extends HTMLElement {
  constructor() {
    super();
    this.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault();
      const cartItems = this.closest('cart-items');
      cartItems.updateQuantity(this.dataset.index, 0);
    });
  }
}

customElements.define('cart-remove', CartRemoveItem);

class CartItemsUpdate extends HTMLElement {
  constructor() {
    super();
    const debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, ON_CHANGE_DEBOUNCE_TIMER);
    this.addEventListener('change', debouncedOnChange.bind(this));
  }
  cartUpdateUnsubscriber = undefined;
  connectedCallback() {
    this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
      if (event.source === 'cart-items') {
        return;
      }
      this.onCartUpdate();
    });
  }

  disconnectedCallback() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }
  }
  onChange(event) {
    this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
  }

  onCartUpdate() {
    if (this.tagName === 'CART-ITEMS') {
      fetch(`${routes.cart_url}?section_id=cart-drawer`)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          const selectors = ['cart-items'];
          for (const selector of selectors) {
            const targetElement = document.querySelector(selector);
            const sourceElement = html.querySelector(selector);
            if (targetElement && sourceElement) {
              targetElement.replaceWith(sourceElement);
            }
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      fetch(`${routes.cart_url}?section_id=main-cart`)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          const cartItems = html.querySelector('cart-items');
          this.innerHTML = cartItems.innerHTML;
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        section:document.getElementById('cart-drawer')?.id,
        selector: 'cart-drawer'
      },
      {
        id: 'main-cart',
        section: document.getElementById('main-cart')?.dataset.id,
        selector: '.cart-item-content',
      },
      {
        id: 'main-cart-summary',
        section: document.getElementById('main-cart-summary')?.dataset.id,
        selector: '.main-summary-content',
      }
   
    ];
  }

  updateQuantity(line, quantity, name) {
    const body = JSON.stringify({ line, quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname,
    });

    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const resultState = JSON.parse(state);
        const quantityElement = document.getElementById(`cart-quantity-${line}`) || document.getElementById(`drawer-quantity-${line}`);
        const items = document.querySelectorAll('.product_cart-item'); 
        if (resultState.errors) {
            quantityElement.value = quantityElement.getAttribute('value');
            this.updateLiveRegions(line, resultState.errors);
            return;
        }
        this.getSectionsToRender().forEach((section) => {
        const elementToReplace = document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
          
          elementToReplace.innerHTML = this.getSectionInnerHTML(resultState.sections[section.section],section.selector);
          shippingBarProgress(resultState.total_price);
           if (document.querySelector('cart-drawer') && section.selector == 'cart-drawer') {
             document.querySelector('cart-drawer').dialogEvents()
           }
           let totalCount=resultState.item_count;
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
           elementToReplace.querySelectorAll('[cart-drawer-close]').forEach((button) =>
            button.addEventListener('click', function(){
               if(document.querySelector("cart-drawer").classList.contains("open")){
                document.querySelector("cart-drawer").classList.remove("open");
                 document.querySelector("body").classList.remove("no-scroll");
              }
            })
            );
        });
    
        this.updateLiveRegions(line, message);
         
      })
      .catch(() => {
        this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
        const errors = document.getElementById('cart-errors') || document.getElementById('cartDrawerErrors');
      })
      .finally(() => { 
      });
  }

  updateLiveRegions(line, message) {
    const lineItemError = document.getElementById(`Line-item-error-${line}`) || document.getElementById(`CartDrawer-Line-item-error-${line}`);
    if (lineItemError) lineItemError.querySelector('.cart-item-error').innerHTML = message;
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  
}

customElements.define('cart-items', CartItemsUpdate);

if (!customElements.get('cart-note-box')) {
  customElements.define(
    'cart-note-box',
    class CartNote extends HTMLElement {
      constructor() {
        super();
        this.addEventListener(
          'change',
          debounce((event) => {
            const body = JSON.stringify({ note: event.target.value });
            fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } });
          }, ON_CHANGE_DEBOUNCE_TIMER)
        );
      }
    }
  );
}


class ShippingCalculator extends HTMLElement {
  constructor() {
    super();
    this.section = this.dataset.section;
    this.setupCountries();
    this.zip = this.querySelector('[data-address-zip]');
    this.country = this.querySelector('[data-address-country-select]');
    this.province = this.querySelector('[data-address-province-select]');
    this.button = this.querySelector('button');
    this.errors = this.querySelector('#shippingErrors');
    this.success = this.querySelector('#shippingResponse');
    this.button.addEventListener('click', this.onSubmitHandler.bind(this));
  }

  setupCountries() {
    if (Shopify && Shopify.CountryProvinceSelector) {
      new Shopify.CountryProvinceSelector(`shippingCountry-${this.section}`, `shippingProvince-${this.section}`, {
        hideElement: `shipping-province-${this.section}`
      });
    }
  }
  onSubmitHandler(event) {
    event.preventDefault();
    this.errors.classList.add('hidden');
    this.success.classList.add('hidden');
    this.zip.classList.remove('invalid');
    this.country.classList.remove('invalid');
    this.province.classList.remove('invalid');
    this.button.classList.add('loading');
    this.button.setAttribute('disabled', true);

    const body = JSON.stringify({
      shipping_address: {
        zip: this.zip.value,
        country: this.country.value,
        province: this.province.value
      }
    });
    let sectionUrl = `${window.routes.cart_url}/shipping_rates.json`;
    sectionUrl = sectionUrl.replace('//', '/');

    fetch(sectionUrl, { ...fetchConfig('javascript'), body })
      .then((response) => response.json())
      .then((result) => {
        if (result.shipping_rates) {
          if(result.shipping_rates.length > 0){
               this.success.classList.remove('hidden');
              this.success.innerHTML = '';
              result.shipping_rates.forEach((rate) => {
                const child = document.createElement('p');
                child.innerHTML = `${rate.name}: ${rate.price} ${Shopify.currency.active}`;
                this.success.appendChild(child);
          });
          }else{
               this.errors.classList.remove('hidden');
               this.errors.innerHTML = '';
              this.errors.textContent = 'Cart shippings rates not available';
          }
       
        }
        else {
          let errors = [];
          Object.entries(result).forEach(([attribute, messages]) => {
            errors.push(`${attribute.charAt(0).toUpperCase() + attribute.slice(1)} ${messages[0]}`);
          });

          this.errors.classList.remove('hidden');
          this.errors.querySelector('.errors').innerHTML = errors.join('; ');
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        this.button.classList.remove('loading');
        this.button.removeAttribute('disabled');
      });
  }
}

customElements.define('cart-shipping-box', ShippingCalculator);

