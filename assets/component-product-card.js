if (!customElements.get("c-product-card")) {
  customElements.define( "c-product-card", class ComponentProductCard extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.updateVariables()

        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      }

      disconnectedCallback() {
        this.addToCartButton.removeEventListener('click', this.addToCartHandler);

        if(this.select){
          this.select.removeEventListener('change', this.changeVariantHandler);
        }
      }

      updateVariables = () => {
        this.addToCartButton = this.querySelector('.js-product-card__button');
        this.select = this.querySelector('.js-product-card__select') || null;
        
        this.addToCartButton.addEventListener('click', this.addToCartHandler);

        if(this.select){
          this.select.addEventListener('change', this.changeVariantHandler);
        }
      }

      addToCartHandler = (event) => {
        event.preventDefault();
        const button = event.target.closest('.js-product-card__button');

        this.classList.add('is-loading');
        button.disabled = true;
        
        let variantId;

        if(this.select){
          variantId = this.select.value;
        } else {
          variantId = button.dataset.variantId;
        }

        if (this.cart) {
          this.sections = this.cart.getSectionsToRender().map((section) => section.id)
          this.cart.setActiveElement(document.activeElement);
        }

        const formData = {
          items: [
            {
              id: variantId,
              quantity: 1,
            },
          ],
          sections: this.sections,
          sections_url: window.location.pathname
        };

        fetch(window.Shopify.routes.root + "cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((response) => {
            const cartResponse = response;
            cartResponse.key = response.items[0].key;
            if (this.cart){
              this.cart.renderContents(cartResponse);
            }
            button.disabled = false;
            this.classList.remove('is-loading');
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }

      changeVariantHandler = (event) => {
        this.classList.add('is-loading');

        const select = event.target.closest('.js-product-card__select');
        const currentVariant = select.value
        const productHandle = this.dataset.productHandle;

        const url = `${window.Shopify.routes.root}products/${productHandle}?variant=${currentVariant}&view=product-card`

        fetch(url)
        .then((response) => {
          return response.text();
        })
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
      
          const productCard = doc.querySelector(".js-product-card");
          this.innerHTML = productCard.innerHTML;
        })
        .then(() => {
          this.updateVariables();
          this.classList.remove('is-loading');
        })
        .catch((error) => {
          console.error("Error fetching product card:", error);
        });
      
      }
    }
  );
}