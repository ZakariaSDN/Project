class InfiniteScroll extends HTMLElement {
  constructor() {
    super();
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), { threshold: 1.0 });
    this.observer.observe(this);

  }

  onClickHandler(event) {
    if (this.classList.contains('loading') || this.classList.contains('disabled')) return;
    this.classList.add('loading', 'disabled');

    const sections = InfiniteScroll.getSections();
    sections.forEach(() => {
      const url = this.dataset.url;
      InfiniteScroll.renderSectionFetch(url);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.classList.contains('loading')) {
        this.onClickHandler();
      }
    });
  }

  static getSections() {
    return [
      {
        section: document.getElementById('product-card-grid').dataset.id,
      }
    ];
  }

  static renderSectionFetch(url) {
    fetch(url)
      .then(response => response.text())
      .then(responseText => {
        InfiniteScroll.renderPagination(responseText);
        InfiniteScroll.renderProductGridContainer(responseText);
      })
      .catch(e => {
        console.error(e);
      });
  }

  static renderPagination(html) {
    const container = document.getElementById('products-container').querySelector('.pagination-container');
    const pagination = new DOMParser().parseFromString(html, 'text/html').getElementById('products-container').querySelector('.pagination-container');
    if (pagination) {
      container.innerHTML = pagination.innerHTML;
    } else {
      container.remove();
    }
  }

  static renderProductGridContainer(html) {
    const productsContainer = document.getElementById('product-card-grid');
    const products = new DOMParser().parseFromString(html, 'text/html').getElementById('product-card-grid');
    productsContainer.insertAdjacentHTML('beforeend', products.innerHTML);
  }
}

customElements.define('infinite-scroll', InfiniteScroll);


