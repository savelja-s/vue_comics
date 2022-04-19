<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {CartItem as CartItemModel, PreorderComicInterface} from "@/types";
import {createNamespacedHelpers} from "vuex";
import {PropType} from 'vue'

const storeCart = createNamespacedHelpers("cart");

@Options({
  name: 'CartItem',
  props: {
    item: {required: true, type: Object as PropType<CartItemModel>,}
  },
  methods: {
    ...storeCart.mapMutations(["removeFromCart", "updateCartItem"]),
  },
})
export default class CartItem extends Vue {
  protected item?: PropType<CartItemModel>;
  protected removeFromCart?: Function;
  protected updateCartItem?: Function;

  getItemTotal(item: CartItemModel) {
    return (item.quantity * (item.product.price_usd || item.price || 0)).toFixed(2);
  }

  decrementQuantity(item: CartItemModel) {
    item.quantity -= 1
    if (item.quantity === 0) this.removeFromMyCart(item)
    this.update(item)
  }

  incrementQuantity(item: CartItemModel) {
    item.quantity += 1
    this.update(item)
  }

  update(item: CartItemModel) {
    this.updateCartItem && this.updateCartItem(item);
  }

  removeFromMyCart(item: CartItemModel) {
    this.removeFromCart && this.removeFromCart(item);
  }

  getRoute(item: CartItemModel) {
    // console.log(product_type, product)
    return `/${item.product_type}/${item.product.publisher?.slug}/${item.product.slug}/`;
  }
}
</script>
<template>
  <tr>
    <td>
      <router-link :to="getRoute(item)">{{ item.product.title }}</router-link>
    </td>
    <td>${{ item.product.price_usd }}</td>
    <td>
      {{ item.quantity }}
      <a @click="decrementQuantity(item)">-</a>
      <a @click="incrementQuantity(item)">+</a>
    </td>
    <td>${{ getItemTotal(item) }}</td>
    <td>
      <button class="delete" @click="removeFromMyCart(item)"></button>
    </td>
  </tr>
</template>
