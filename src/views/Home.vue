<template>
  <div class="home">
    <section class="hero is-medium is-dark mb-6">
      <div class="hero-body has-text-centered">
        <p class="title mb-6">
          Welcome to Comics
        </p>
        <p class="subtitle">
          The best comics store online
        </p>
      </div>
    </section>
    <div class="columns is-multiline">
      <div class="column is-12">
        <h2 class="is-size-2 has-text-centered">Latest Preorder Comics</h2>
      </div>
      <ProductBox
          v-for="comic in latestPreorderComics"
          v-bind:key="comic.id"
          v-bind:product_type="product_type"
          v-bind:product="comic"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ProductBox from '@/components/ProductBox'

export default {
  name: 'Home',
  data() {
    return {
      latestPreorderComics: [],
      product_type: 'preorder-comics',
    }
  },
  components: {
    ProductBox
  },
  mounted() {
    this.getLatestPreorderComics()
    document.title = 'Home | Comics'
  },
  methods: {
    async getLatestPreorderComics() {
      this.$store.commit('setIsLoading', true)
      await axios
          .get('/api/v1/preorder-comics/latest/')
          .then(response => {
            console.log(response.data, "DATA");
            this.latestPreorderComics = response.data
          })
          .catch(error => {
            console.log(error)
          })
      this.$store.commit('setIsLoading', false)
    }
  }
}
</script>