class NewsLetterPopup extends HTMLElement {
  constructor() {
    super();
    
    if (window.location.pathname === '/challenge') {
      return;
    }
    this.cookieName = 'luxury:newsletter-popup';
    this.popup = this;
    this.classes = {
      bodyClass: 'modal-open',
      activeClass: 'active',
      closingClass: 'closing',
    };
    // Open popup if errors or success message exist
    if (this.querySelector('.form-message')) {
      this.open();
    }
    this.querySelectorAll('[data-popup-close]').forEach((button) => {
      button.addEventListener('click', this.onButtonClick.bind(this));
    });

    if (!this.getCookie(this.cookieName)) {
      this.init();
    }
  }
  init() {
    if(!this.popup) {
      return;
    }

    setTimeout(function() {
      this.open();
      
    }.bind(this), parseInt(2) * 1000);
  }
  onButtonClick(event) {
    event.preventDefault();
    this.popup.classList.contains(this.classes.activeClass) ? this.close() : this.open();
  }
  open() {
    document.body.classList.remove(this.classes.bodyClass);
    if (this.dataset.newsletterpopup == 'true') {
      document.body.classList.add(this.classes.bodyClass);
      this.popup.classList.add(this.classes.activeClass);
    }
  }
  close() {
    this.popup.classList.add(this.classes.closingClass);
    setTimeout(() => {
      this.popup.classList.remove(this.classes.activeClass);
      this.popup.classList.remove(this.classes.closingClass);

    }, 500);

  
    this.setCookie(this.cookieName, this.dataset.expiry);
  }
  getCookie(name) {
    const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
    return match ? match[2] : null;
  }
  setCookie(name, expiry) {
    document.cookie = `${name}=true; max-age=${(expiry * 24 * 60 * 60)}; path=/`;
  }

  removeCookie(name) {
    document.cookie = `${name}=; max-age=0`;
  }
}
customElements.define('newsletter-popup', NewsLetterPopup);
