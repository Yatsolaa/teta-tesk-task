if (!customElements.get("c-product-card")) {
  customElements.define( "c-product-card", class ComponentProductCard extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.updateVariables()
      }

      disconnectedCallback() {
        this.addToCartButton.removeEventListener('click', this.addToCartHandler);

        if(this.select){
          this.select.removeEventListener('change', this.changeVariantHandler);
        }
      }

      updateVariables = () => {
        console.log("update");
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
        button.disabled = true;
        
        let variantId;

        if(this.select){
          variantId = this.select.value;
        } else {
          variantId = button.dataset.variantId;
        }

        const formData = {
          items: [
            {
              id: variantId,
              quantity: 1,
            },
          ],
        };

        fetch(window.Shopify.routes.root + "cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => {
            return response.json();
          })
          .then((response) => {
            button.disabled = false;
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }

      changeVariantHandler = (event) => {
        const select = event.target.closest('.js-product-card__select');
        const currentVariant = select.value
        const productHandle = this.dataset.productHandle;

        const url = `${window.Shopify.routes.root}products/${productHandle}?variant=${currentVariant}&view=product-card`

        console.log("url", url)

        fetch(url)
        .then((response) => {
          return response.text();
        })
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          console.log("doc", doc)
      
          const productCard = doc.querySelector(".js-product-card");
          this.innerHTML = productCard.innerHTML;
        })
        .then(() => {
          this.updateVariables();
        })
        .catch((error) => {
          console.error("Error fetching product card:", error);
        });
      
      }
    }
  );
}