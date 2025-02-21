if (!customElements.get("s-featured-products")) {
  customElements.define( "s-featured-products", class SectionFeaturedProducts extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.tabs = this.querySelectorAll('.js-featured-products__tab-button');
        this.slides = this.querySelectorAll('.js-featured-products__product-card');

        this.sliderElement = this.querySelector('.js-featured-products__slider');

        // this.initSlider();

        this.tabs.forEach(tab => {
          tab.addEventListener('change', this.changeTabEventHandler);
        })
      }

      disconnectedCallback() {
        this.tabs.forEach(tab => {
          tab.removeEventListener('change', this.changeTabEventHandler);
        })
      }

      changeTabEventHandler = (event) => {
        const currentTab = event.target.closest('.js-featured-products__tab-button').value;

        this.slides.forEach(item => {
          const tabHandle = item.dataset.tab;

          if (currentTab === tabHandle) {
            item.classList.remove('is-hidden');
          } else {
            item.classList.add('is-hidden');
          }
        })
      }

      initSlider = () => {
        this.slider = new Flickity(this.sliderElement, {
          cellAlign: 'left',
          contain: true,
          pageDots: false,
          prevNextButtons: false
        });
      }
    }
  );
}

