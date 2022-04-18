<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {PreorderComicInterface} from "@/types";
import {PropType} from "vue";
import {createNamespacedHelpers} from "vuex";
import {ElNotification} from "element-plus";

const store = createNamespacedHelpers("product");
const storeUser = createNamespacedHelpers("user");

@Options({
  name: "ProductBox",
  components: {},
  methods: {
    ...store.mapMutations(["setProduct"]),
    ...storeUser.mapMutations(["addToCart"]),
  },
  computed: {
    ...storeUser.mapState(["status"]),
  },
  props: {
    product: {
      required: true,
      type: Object as PropType<PreorderComicInterface>,
    },
    product_type: {required: true},
  },
})
export default class ProductBox extends Vue {
  protected setProduct?: Function;
  protected status?: any;
  protected product_type?: string;
  protected product?: PropType<PreorderComicInterface>;
  protected quantity = 1;
  protected addToCart?: Function;

  getRoute(product: PreorderComicInterface): Object {
    return {
      name: "product-preorder",
      params: {
        product_type: this.product_type,
        publisher_slug: product.publisher?.slug,
        product_slug: product.slug
      },
    };
  }

  truncate(str: string, n = 200) {
    if (str) return str.length > n ? `${str.substring(0, n - 1)} ...` : str;
  }

  getPublisherName(product: PreorderComicInterface) {
    if (product.publisher) {
      return product.publisher.name;
    }
  }

  get viewMode() {
    return this.status.viewMode;
  }

  // created() {
  //   console.log("ProductBox", this);
  // }

  addToMyCart() {
    if (isNaN(this.quantity) || this.quantity < 1) {
      this.quantity = 1;
    }
    const item = {
      product_type: this.product_type,
      product: this.product,
      quantity: this.quantity,
      added_at: new Date(),
    };
    this.addToCart && this.addToCart(item);
    ElNotification({
      title: this.$t("cart.notify.add.title"),
      message: this.$t("cart.notify.add.message"),
      type: "success",
    });
  }

  getWriterName(product: PreorderComicInterface) {
    return product.writer?.name ? this.truncate(product.writer.name, 15) : "";
  }

  getArtistName(product: PreorderComicInterface) {
    return product.artist?.name ? this.truncate(product.artist.name, 15) : "";
  }
}
</script>
<template>
  <el-card :body-style="{ padding: '0px' }">
    <el-row type="flex" justify="center" class="comic-page comic-block" v-if="product.id">
      <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10" class="image">
        <el-image
            v-if="product.image"
            :src="product.image"
            fit="contain"
            style="height: 280px"
            alt="comic picture"
        />
        <el-image v-else>
          <template #error>
            <div class="image-slot">
              <el-icon>
                <picture/>
              </el-icon>
            </div>
          </template>
        </el-image>
      </el-col>
      <el-col :xs="13" :sm="13" :md="13" :lg="13" :xl="13" class="description">
        <el-col class="text-left mb-5">
          <p class="title"><strong>{{ product.title }}</strong></p>
          <p>
            {{ truncate(product.description, 350) }}
          </p>
          <hr>
          <div class="info">
            <p><strong>Publisher:</strong> {{ getPublisherName(product) }}</p>
            <p><strong>Writer:</strong> {{ getWriterName(product) }}</p>
            <p><strong>Artist:</strong> {{ getArtistName(product) }}</p>
            <p><strong>Product Code:</strong> {{ product.id }}</p>
            <p><strong>Expected Ship Date:</strong> {{ product.expected_ship_at }}</p>
            <span class="badge bg-primary text-wrap">
              <strong>Price:</strong> {{ product.price_grn }} грн.
            </span>
          </div>
        </el-col>
        <el-input-number class="mb-5" v-model="quantity" :min="1" :max="99" size="small" controls-position="right"/>
        <el-row>
          <el-col :span="12">
            <el-button @click="addToMyCart" type="success" size="small">
              <el-icon>
                <shopping-cart-full/>
              </el-icon>
            </el-button>
          </el-col>
          <el-col :span="12">
            <router-link v-bind:to="getRoute(product)" class="go-to-detail">
              <el-button class="button" type="primary" size="small">
                <el-icon class="el-icon--right">
                  <arrow-right/>
                </el-icon>
              </el-button>
            </router-link>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<style scoped lang="scss">

.el-card {
  margin-bottom: 20px;
}

.comic-page {
  margin-top: 5px;
}

.comic-block {
  min-height: 280px;
}

.comic-detail {
  margin-left: 5px;
}

.description {
  font-size: 9px;
  margin-left: 5px;
}

.info {
  line-height: 0.5;
}

.mb-5 {
  margin-bottom: 5px;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
