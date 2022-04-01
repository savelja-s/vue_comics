<script>
export default {
  name: 'ProductBox',
  props: {
    product: Object,
    product_type: '',
  },
  methods: {
    getRoute(product_type, product) {
      // console.log(product_type, product)
      return `/${product_type}/${product.publisher.slug}/${product.slug}/`;
    }
  },
}
</script>
<template>
  <div class="column is-3">
    <div class="box">
      <figure class="image mb-4">
        <img v-bind:src="product.image || 'noimage.png'">
      </figure>
      <h3 class="is-size-4">{{ product.title }}</h3>
      <p class="is-size-6 has-text-grey">${{ product.price_usd }}</p>
      <router-link v-bind:to="getRoute(product_type,product)" class="button is-dark mt-4">
        View details
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.image {
  margin-top: -1.25rem;
  margin-left: -1.25rem;
  margin-right: -1.25rem;
}
</style>