<script lang="ts">
import CartItem from '@/components/CartItem.vue'
import {Options, Vue} from "vue-class-component";
import {createNamespacedHelpers} from "vuex";
import {Cart as CartModel, CartItem as CartItemModel} from "@/types";
import {ElNotification} from 'element-plus'

const storeUser = createNamespacedHelpers("user");

@Options({
  name: "Cart",
  components: {
    CartItem
  },
  methods: {
    ...storeUser.mapGetters(["cartTotalLength", "cartTotalPrice"]),
    ...storeUser.mapMutations(["removeFromCart", "updateCartItem"]),
  },
  computed: {
    ...storeUser.mapState(["cart"]),
  }
})
export default class Cart extends Vue {
  protected cart?: CartModel;
  protected cartTotalLength?: Function;
  protected cartTotalPrice?: Function;
  protected removeFromCart?: Function;
  protected updateCartItem?: Function;

  mounted() {
    const length = this.cart?.items.length
    document.title = `Cart ${length} | Comics`;
  }

  totalPrice(): number {
    return (this.cartTotalPrice ? this.cartTotalPrice()() : 0).toFixed(2);
  }

  totalLength(): number {
    return this.cartTotalLength ? this.cartTotalLength()() : 0;
  }

  removeItem(item: CartItemModel) {
    this.removeFromCart && this.removeFromCart(item);
  }

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
    if(!this.removeFromCart) return
    this.removeFromCart(item);
    ElNotification({
      title: this.$t("cart.notify.remove.title"),
      message: this.$t("cart.notify.remove.message"),
      type: "info",
    });
  }

  getRoute(item: CartItemModel) {
    // console.log(product_type, product)
    return `/${item.product_type}/${item.product.publisher?.slug}/${item.product.slug}/`;
  }
}
</script>
<template>
  <el-row type="flex" justify="center" class="page-cart">
    <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
      <el-row type="flex" justify="center" class="page-cart">
        <el-col :span="22"><h1 class="title">Cart</h1></el-col>
        <el-col :span="22">
          <el-table :data="cart.items" style="width: 100%">
            <el-table-column label="Date" width="115">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-icon>
                    <timer/>
                  </el-icon>
                  <span style="margin-left: 10px">{{ $d(scope.row.added_at) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Title" width="180">
              <template #default="scope">
                <el-popover effect="light" trigger="hover" placement="top" width="auto">
                  <template #default>
                    <div>Title: {{ scope.row.product.title }}</div>
                    <div>Description: {{ scope.row.product.description }}</div>
                  </template>
                  <template #reference>
                    <router-link :to="getRoute(scope.row)">
                      <el-tag>{{ scope.row.product.title }}</el-tag>
                    </router-link>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="Price" width="100">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  $
                  <span style="margin-left: 10px">{{ scope.row.product.price_usd }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Quantity" width="100">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <span style="margin-left: 10px">{{ scope.row.quantity }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Total" width="100">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <span style="margin-left: 10px">{{ getItemTotal(scope.row) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Operations" width="100">
              <template #default="scope">
                <el-button size="small" @click="decrementQuantity(scope.row)">-</el-button>
                <el-button size="small" @click="incrementQuantity(scope.row)">+</el-button>
                <el-button size="small" type="danger" @click="removeFromMyCart(scope.row)">
                  Delete
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--          <table class="table is-fullwidth" v-if="cartTotalLength">-->
          <!--            <thead>-->
          <!--            <tr>-->
          <!--              <th>Product</th>-->
          <!--              <th>Price</th>-->
          <!--              <th>Quantity</th>-->
          <!--              <th>Total</th>-->
          <!--              <th></th>-->
          <!--            </tr>-->
          <!--            </thead>-->
          <!--            <tbody>-->
          <!--            <CartItem-->
          <!--                v-for="item in cart.items"-->
          <!--                v-bind:key="item.product.id"-->
          <!--                v-bind:item="item"/>-->
          <!--            </tbody>-->
          <!--          </table>-->
<!--          <p v-else>You don't have any products in your cart...</p>-->
        </el-col>
        <el-col :span="22">
          <h2 class="subtitle">Summary</h2>
          <strong>${{ totalPrice() }}</strong>, {{ totalLength() }} items
          <hr>
          <router-link to="/cart/checkout" class="button is-dark">Proceed to checkout</router-link>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
