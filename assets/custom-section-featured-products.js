if (!customElements.get("s-featured-products")) {
  customElements.define( "s-featured-products", class SectionFeaturedProducts extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.tabs = this.querySelectorAll('.js-featured-products__tab-button');
        this.sliderWrappers = this.querySelectorAll('.js-featured-products__slider-tab');
        this.sliderElements = this.querySelectorAll('.js-featured-products__slider');
        this.initialTab = this.dataset.initialTab;

        this.arrowPrev = this.querySelectorAll('.js-arrow-prev');
        this.arrowNext = this.querySelectorAll('.js-arrow-next');

        this.initSlider(this.initialTab);
        this.arrowsVisibilityHandler();

        this.tabs.forEach(tab => {
          tab.addEventListener('change', this.changeTabEventHandler);
        })

        this.arrowPrev.forEach(arrow => {
          arrow.addEventListener('click', this.prevArrowHandler);
        })
        this.arrowNext.forEach(arrow => {
          arrow.addEventListener('click', this.nextArrowHandler);
        })
      }

      disconnectedCallback() {
        this.tabs.forEach(tab => {
          tab.removeEventListener('change', this.changeTabEventHandler);
        })

        this.arrowPrev.forEach(arrow => {
          arrow.removeEventListener('click', this.prevArrowHandler);
        })
        this.arrowNext.forEach(arrow => {
          arrow.removeEventListener('click', this.nextArrowHandler);
        })
      }

      changeTabEventHandler = (event) => {
        const currentTab = event.target.closest('.js-featured-products__tab-button').value;

        this.sliderWrappers.forEach(sliderWrapper => {
          const tabHandle = sliderWrapper.dataset.tab;

          if (currentTab === tabHandle) {
            sliderWrapper.classList.add('is-active');
          } else {
            sliderWrapper.classList.remove('is-active');
          }
        })

        this.initSlider(currentTab)
        this.arrowsVisibilityHandler();
      }

      initSlider = (tab) => {
        if (this.slider) {
          this.slider.destroy();
        }
      
        const sliderElement = this.querySelector(`.js-featured-products__slider[data-tab="${tab}"]`);
      
        if (!sliderElement) {
          return;
        }
      
        this.slider = new Flickity(sliderElement, {
          cellAlign: 'left',
          contain: true,
          groupCells: true,
          pageDots: false,
          prevNextButtons: false
        });
      
        this.slider.on('change', this.arrowsVisibilityHandler);
      
        this.arrowsVisibilityHandler();
      };

      prevArrowHandler = () => {
        if (this.slider) {
          this.slider.previous(false, false);
          this.arrowsVisibilityHandler();
        }
      };
      
      nextArrowHandler = () => {
        if (this.slider) {
          this.slider.next(false, false);
          this.arrowsVisibilityHandler();
        }
      };

      arrowsVisibilityHandler = () => {
        if (!this.slider || !this.slider.cells.length) return;
      
        const activeSliderWrapper = this.querySelector('.js-featured-products__slider-tab.is-active');
        if (!activeSliderWrapper) return;
      
        const arrowPrev = activeSliderWrapper.querySelector('.js-arrow-prev');
        const arrowNext = activeSliderWrapper.querySelector('.js-arrow-next');
      
        const selectedIndex = this.slider.selectedIndex;
        const lastIndex = this.slider.slides.length - 1;
      
        if (arrowPrev) {
          arrowPrev.classList.toggle("is-disabled", selectedIndex === 0);
        }
      
        if (arrowNext) {
          arrowNext.classList.toggle("is-disabled", selectedIndex === lastIndex);
        }
      };
    }
  );
}

