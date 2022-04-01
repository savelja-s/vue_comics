<script>
import axios from 'axios'
import {toast} from 'bulma-toast'
import ProductBox from '@/components/ProductBox'

export default {
  name: 'Category',
  components: {
    ProductBox
  },
  data() {
    return {
      category: {
        comics: [],
        product_type: ''
      }
    }
  },
  mounted() {
    console.log('MOUNTED', this.$route.name);
    this.getCategory(this.$route.name);
  },
  watch: {
    $route(to, from) {
      const CATEGORIES = ['preorder-comics','comics']
      console.log('WATCH', to, from);
      if (CATEGORIES.includes(to.name)) {
        this.getCategory(to.name)
      }
    }
  },
  methods: {
    async getCategory(name) {
      this.category.product_type = name
      const publisher_slug = this.$route.params.publisher_slug
      this.$store.commit('setIsLoading', true)
      axios
          .get(`/api/v1/${name}/${publisher_slug ? publisher_slug + '/' : ''}`)
          .then(response => {
            this.category.comics = response.data.results
            document.title = this.$route.meta.title + ' | Comics'
          })
          .catch(error => {
            console.log(error)
            toast({
              message: 'Something went wrong. Please try again.',
              type: 'is-danger',
              dismissible: true,
              pauseOnHover: true,
              duration: 2000,
              position: 'bottom-right',
            })
          })
      this.$store.commit('setIsLoading', false)
    }
  }
}
</script>
<template>
  <div class="page-category">
    <div class="columns is-multiline">
      <div class="column is-12">
        <h2 class="is-size-2 has-text-centered">{{ category.name }}</h2>
      </div>

      <ProductBox
          v-for="comic in category.comics"
          v-bind:product_type="category.product_type"
          v-bind:key="comic.id"
          v-bind:product="comic"/>
    </div>
  </div>
</template>
