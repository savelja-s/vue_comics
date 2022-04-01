<script>
import axios from 'axios'
import {toast} from 'bulma-toast'

export default {
  name: 'Product',
  data() {
    return {
      product: {},
      product_type: '',
      quantity: 1
    }
  },
  mounted() {
    this.getProduct()
  },
  methods: {
    async getProduct() {
      this.$store.commit('setIsLoading', true)
      this.product_type = this.$route.params.product_type
      const publisher_slug = this.$route.params.publisher_slug
      const product_slug = this.$route.params.product_slug
      await axios
          .get(`/api/v1/${this.product_type}/${publisher_slug}/${product_slug}/`)
          .then(response => {
            this.product = response.data;
            document.title = this.product.title + ' | Comics';
          })
          .catch(error => {
            console.log(error)
          })
      this.$store.commit('setIsLoading', false)
    },
    addToCart() {
      if (isNaN(this.quantity) || this.quantity < 1) {
        this.quantity = 1
      }

      const item = {
        product_type: this.product_type,
        product: this.product,
        quantity: this.quantity
      }
      this.$store.commit('addToCart', item)
      toast({
        message: 'The product was added to the cart',
        type: 'is-success',
        dismissible: true,
        pauseOnHover: true,
        duration: 2000,
        position: 'bottom-right',
      })
    }
  }
}
</script>
<template>
  <div class="page-product">
    <div class="columns is-multiline">
      <div class="column is-9">
        <figure class="image mb-6">
          <img v-bind:src="product.image || 'noimage.png'">
        </figure>

        <h1 class="title">{{ product.title }}</h1>

        <p>{{ product.description }}</p>
      </div>

      <div class="column is-3">
        <h2 class="subtitle">Information</h2>

        <p><strong>Price: </strong>${{ product.price_usd }}</p>

        <div class="field has-addons mt-6">
          <div class="control">
            <input type="number" class="input" min="1" v-model="quantity">
          </div>

          <div class="control">
            <a class="button is-dark" @click="addToCart()">Add to cart</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
