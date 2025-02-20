if (!customElements.get("s-featured-products")) {
  customElements.define( "s-featured-products", class SectionFeaturedProducts extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        console.log("init section");
      }

      disconnectedCallback() {
      }
    }
  );
}

