<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {createNamespacedHelpers} from "vuex";
import {Cart, PreorderComicInterface} from "@/types";
import {ref, onMounted, PropType} from "vue";
import {useStripe, StripeElement} from "vue-use-stripe";

const storeCart = createNamespacedHelpers("cart");

@Options({
  name: 'Checkout',
  components: {
    StripeElement,
  },
  methods: {
    ...storeCart.mapGetters(["cartTotalLength"]),
  },
  computed: {
    ...storeCart.mapState(["cart"]),
    // cartTotalPrice() {
    //   return this.cart.items.reduce((acc, curVal) => {
    //     return acc += curVal.product.price_usd * curVal.quantity
    //   }, 0)
    // },
    // cartTotalLength() {
    //   return this.cart.items.reduce((acc, curVal) => {
    //     return acc += curVal.quantity
    //   }, 0)
    // }

  },
  data() {
    const event = ref(null)

    const {
      stripe,
      elements: [cardElement],
    } = useStripe({
      key: process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY || '',
      elements: [{type: 'card', options: {}}],
    })

    const registerCard = () => {
      const val:any = event.value;
      if (val?.complete) {
        // Refer to the official docs to see all the Stripe instance properties.
        // E.g. https://stripe.com/docs/js/setup_intents/confirm_card_setup
        return stripe.value?.confirmCardSetup('<client-secret>', {
          payment_method: {
            card: cardElement.value,
          },
        })
      }
    }

    return {
      event,
      cardElement,
      registerCard,
    }
  }
})
export default class Checkout extends Vue {
  protected cart?: PropType<Cart>;
  protected cartTotalLength?: Function;
  cardElement?: any;
  // card = {};
  // first_name = '';
  // last_name = '';
  // email = '';
  // phone = '';
  // address = '';
  // zipcode = '';
  // place = '';
  // errors = [];
  private config = {
    key: process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY || "",
    elements: [{type: 'card', options: {}}],
  };

  // event = ref({});
  // stripe = ref({});

  // checkoutRef = ref<StripeCheckout>()

  mounted() {
    console.log('ENV', process.env)
    console.log('VUE_APP_MY_ENV',)
    document.title = 'Checkout | Comics'
    if (this.cartTotalLength && this.cartTotalLength() > 0) {
      // this.stripe = Stripe('pk_test_')
      // const elements = this.stripe.elements();
      // this.card = elements.create('card', {hidePostalCode: true})
      // this.card.mount('#card-element')
    }
  }

  submit() {
    // if(this.checkoutRef instanceof StripeCheckout){
    //   this.checkoutRef.redirectToCheckout();
    // }
  }

  // getItemTotal(item) {
  //   return item.quantity * item.product.price_usd
  // }
  // submitForm() {
  //   this.errors = []
  //   if (this.first_name === '') {
  //     this.errors.push('The first name field is missing!')
  //   }
  //   if (this.last_name === '') {
  //     this.errors.push('The last name field is missing!')
  //   }
  //   if (this.email === '') {
  //     this.errors.push('The email field is missing!')
  //   }
  //   if (this.phone === '') {
  //     this.errors.push('The phone field is missing!')
  //   }
  //   if (this.address === '') {
  //     this.errors.push('The address field is missing!')
  //   }
  //   if (this.zipcode === '') {
  //     this.errors.push('The zip code field is missing!')
  //   }
  //   if (this.place === '') {
  //     this.errors.push('The place field is missing!')
  //   }
  //   if (!this.errors.length) {
  //     this.$store.commit('setIsLoading', true)
  //     this.stripe.createToken(this.card).then(result => {
  //       if (result.error) {
  //         this.$store.commit('setIsLoading', false)
  //         this.errors.push('Something went wrong with Stripe. Please try again')
  //         console.log(result.error.message)
  //       } else {
  //         this.stripeTokenHandler(result.token)
  //       }
  //     })
  //   }
  // }
  // async stripeTokenHandler(token) {
  //   const items = []
  //   for (let i = 0; i < this.cart.items.length; i++) {
  //     const item = this.cart.items[i]
  //     const obj = {
  //       product: item.product.id,
  //       quantity: item.quantity,
  //       price: item.product.price_usd * item.quantity
  //     }
  //     items.push(obj)
  //   }
  //   const data = {
  //     'first_name': this.first_name,
  //     'last_name': this.last_name,
  //     'email': this.email,
  //     'address': this.address,
  //     'zipcode': this.zipcode,
  //     'place': this.place,
  //     'phone': this.phone,
  //     'items': items,
  //     'stripe_token': token.id
  //   }
  //   await axios
  //       .post('/api/v1/checkout/', data)
  //       .then(response => {
  //         this.$store.commit('clearCart')
  //         this.$router.push('/cart/success')
  //       })
  //       .catch(error => {
  //         this.errors.push('Something went wrong. Please try again')
  //         console.log(error)
  //       })
  //   this.$store.commit('setIsLoading', false)
  // }
}
</script>
<template>
  <p>TEST</p>
  <StripeElement :element="cardElement" @change="event = $event"/>
    <button @click="registerCard">Add</button>
  <div v-if="event && event.error">{{ event.error.message }}</div>
  <!--  <div>-->
  <!--    <stripe-checkout-->
  <!--        ref="checkoutRef"-->
  <!--        mode="payment"-->
  <!--        :pk="publishableKey"-->
  <!--        :line-items="lineItems"-->
  <!--        :success-url="successURL"-->
  <!--        :cancel-url="cancelURL"-->
  <!--        @loading="v => loading = v"-->
  <!--    />-->
  <!--    <button @click="submit">Pay now!</button>-->
  <!--  </div>-->
  <!--  <div>-->
  <!--    <stripe-checkout-->
  <!--      ref="checkoutRef"-->
  <!--      mode="payment"-->
  <!--      :pk="publishableKey"-->
  <!--      :line-items="lineItems"-->
  <!--      :success-url="successURL"-->
  <!--      :cancel-url="cancelURL"-->
  <!--      @loading="v => loading = v"-->
  <!--    />-->
  <!--    <button @click="submit">Pay now!</button>-->
  <!--  </div>-->
  <!--  <div class="page-checkout">-->
  <!--    <div class="columns is-multiline">-->
  <!--      <div class="column is-12">-->
  <!--        <h1 class="title">Checkout</h1>-->
  <!--      </div>-->
  <!--      <div class="column is-12 box">-->
  <!--        <table class="table is-fullwidth">-->
  <!--          <thead>-->
  <!--          <tr>-->
  <!--            <th>Product</th>-->
  <!--            <th>Price</th>-->
  <!--            <th>Quantity</th>-->
  <!--            <th>Total</th>-->
  <!--          </tr>-->
  <!--          </thead>-->
  <!--          <tbody>-->
  <!--          <tr-->
  <!--              v-for="item in cart.items"-->
  <!--              v-bind:key="item.product.id"-->
  <!--          >-->
  <!--            <td>{{ item.product.name }}</td>-->
  <!--            <td>${{ item.product.price_usd }}</td>-->
  <!--            <td>{{ item.quantity }}</td>-->
  <!--            <td>${{ getItemTotal(item).toFixed(2) }}</td>-->
  <!--          </tr>-->
  <!--          </tbody>-->
  <!--          <tfoot>-->
  <!--          <tr>-->
  <!--            <td colspan="2">Total</td>-->
  <!--            <td>{{ cartTotalLength }}</td>-->
  <!--            <td>${{ cartTotalPrice.toFixed(2) }}</td>-->
  <!--          </tr>-->
  <!--          </tfoot>-->
  <!--        </table>-->
  <!--      </div>-->
  <!--      <div class="column is-12 box">-->
  <!--        <h2 class="subtitle">Shipping details</h2>-->
  <!--        <p class="has-text-grey mb-4">* All fields are required</p>-->
  <!--        <div class="columns is-multiline">-->
  <!--          <div class="column is-6">-->
  <!--            <div class="field">-->
  <!--              <label>First name*</label>-->
  <!--              <div class="control">-->
  <!--                <input type="text" class="input" v-model="first_name">-->
  <!--              </div>-->
  <!--            </div>-->
  <!--            <div class="field">-->
  <!--              <label>Last name*</label>-->
  <!--              <div class="control">-->
  <!--                <input type="text" class="input" v-model="last_name">-->
  <!--              </div>-->
  <!--            </div>-->
  <!--            <div class="field">-->
  <!--              <label>E-mail*</label>-->
  <!--              <div class="control">-->
  <!--                <input type="email" class="input" v-model="email">-->
  <!--              </div>-->
  <!--            </div>-->
  <!--            <div class="field">-->
  <!--              <label>Phone*</label>-->
  <!--              <div class="control">-->
  <!--                <input type="text" class="input" v-model="phone">-->
  <!--              </div>-->
  <!--            </div>-->
  <!--          </div>-->
  <!--          <div class="column is-6">-->
  <!--            <div class="field">-->
  <!--              <label>Address*</label>-->
  <!--              <div class="control">-->
  <!--                <input type="text" class="input" v-model="address">-->
  <!--              </div>-->
  <!--            </div>-->
  <!--            <div class="field">-->
  <!--              <label>Zip code*</label>-->
  <!--              <div class="control">-->
  <!--                <input type="text" class="input" v-model="zipcode">-->
  <!--              </div>-->
  <!--            </div>-->
  <!--            <div class="field">-->
  <!--              <label>Place*</label>-->
  <!--              <div class="control">-->
  <!--                <input type="text" class="input" v-model="place">-->
  <!--              </div>-->
  <!--            </div>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--        <div class="notification is-danger mt-4" v-if="errors.length">-->
  <!--          <p v-for="error in errors" v-bind:key="error">{{ error }}</p>-->
  <!--        </div>-->
  <!--        <hr>-->
  <!--        <div id="card-element" class="mb-5"></div>-->
  <!--        <template v-if="cartTotalLength">-->
  <!--          <hr>-->
  <!--          <button class="button is-dark" @click="submitForm">Pay with Stripe</button>-->
  <!--        </template>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
</template>
