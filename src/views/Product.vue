<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {ElNotification} from "element-plus";
import {PreorderComicInterface} from "@/types";
import {createNamespacedHelpers} from "vuex";

const storeUser = createNamespacedHelpers("user");
const storeProduct = createNamespacedHelpers("product");

@Options({
  name: "Product",
  components: {},
  methods: {
    ...storeUser.mapMutations(["setIsLoading", "addToCart"]),
    ...storeProduct.mapActions(["getByParams"]),
  },
  computed: {
    ...storeProduct.mapState(["product"]),
  },
})
export default class Product extends Vue {
  protected product_type?: string;
  protected quantity = 1;
  protected product?: PreorderComicInterface;
  protected setIsLoading?: Function;
  protected addToCart?: Function;
  protected getByParams?: Function;

  get productItem() {
    // document.title = product.title + " | Comics";
    return this.product;
  }

  mounted() {
    this.product_type = String(this.$route.params.product_type);
    if (!this.productItem?.id) {
      this.getProduct();
    }
    document.title =
        (this.productItem?.id
            ? this.product?.title
            : this.$route.meta.title) + " | Comics";
  }

  getProduct() {
    this.setIsLoading && this.setIsLoading(true);
    const publisher_slug = this.$route.params.publisher_slug;
    const product_slug = this.$route.params.product_slug;
    this.getByParams &&
    this.getByParams({
      product_type: this.product_type,
      publisher_slug,
      product_slug,
    });
    this.setIsLoading && this.setIsLoading(false);
  }

  backToList() {
    this.$router.go(-1);
  }

  getPublisherName(product: PreorderComicInterface) {
    if (product.publisher) {
      return product.publisher.name;
    }
  }

  addToMyCart() {
    if (isNaN(this.quantity) || this.quantity < 1) {
      this.quantity = 1;
    }
    const item = {
      product_type: this.product_type,
      product: this.productItem,
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

  truncate(str: string, n = 200) {
    if (str) return str.length > n ? `${str.substring(0, n - 1)} ...` : str;
  }

  getWriterName(product: PreorderComicInterface) {
    return product.writer?.name ? this.truncate(product.writer.name, 150) : "";
  }

  getArtistName(product: PreorderComicInterface) {
    return product.artist?.name ? this.truncate(product.artist.name, 150) : "";
  }
}
</script>
<template>
  <el-row type="flex" justify="center" class="comic-page comic-block" v-if="product.id">
    <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10" class="image">
      <el-image
          v-if="product.image"
          :src="product.image"
          fit="contain"
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
          {{ truncate(product.description, 1500) }}
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
          <el-button @click="backToList" type="primary">
            {{ $t("comic.back-button") }}
          </el-button>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<style scoped lang="scss">

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
  font-size: 14px;
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
