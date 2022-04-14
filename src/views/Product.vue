<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {ElNotification} from 'element-plus'
import {PreorderComicInterface} from "@/types";
import {createNamespacedHelpers} from "vuex";

const storeUser = createNamespacedHelpers("user");
const storePreopderComics = createNamespacedHelpers("PreopderComics");

@Options({
  name: "Product",
  components: {},
  methods: {
    ...storeUser.mapMutations(["setIsLoading", "addToCart"]),
    ...storePreopderComics.mapActions(["getByParams"]),
  },
  computed: {
    ...storePreopderComics.mapState(["preorderComic"]),
  },
})
export default class Product extends Vue {
  protected product_type?: string;
  protected quantity: number = 1;
  protected preorderComic?: PreorderComicInterface;
  protected setIsLoading?: Function;
  protected addToCart?: Function;
  protected getByParams?: Function;

  get product() {
    const product: any = this.preorderComic;
    document.title = product.title + ' | Comics';
    return product;
  }

  mounted() {
    this.product_type = String(this.$route.params.product_type);
    if (!this.preorderComic?.id) {
      this.getProduct()
    }
    document.title = (this.preorderComic?.id ? this.preorderComic?.title : this.$route.meta.title) + " | Comics";
  }

  getProduct() {
    this.setIsLoading && this.setIsLoading(true);
    const publisher_slug = this.$route.params.publisher_slug;
    const product_slug = this.$route.params.product_slug;
    this.getByParams && this.getByParams({product_type: this.product_type, publisher_slug, product_slug});
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
      this.quantity = 1
    }
    const item = {
      product_type: this.product_type,
      product: this.product,
      quantity: this.quantity,
      added_at: new Date()
    }
    this.addToCart && this.addToCart(item);
    ElNotification({
      title: this.$t("cart.notify.add.title"),
      message: this.$t("cart.notify.add.message"),
      type: "success",
    });
  }
}
</script>
<template>
  <el-row type="flex" justify="center" class="comic-page">
    <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
      <h1 class="title">{{ product.title }}</h1>
      <el-row type="flex" justify="center" class="comic-control">
        <el-col :span="12">
          <el-image v-if="product.image" :src="product.image || '@/assets/logo.png'" fit="fill" alt="comic picture"/>
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
      </el-row>
      <p>{{ product.description }}</p>
    </el-col>
    <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
      <h2 class="subtitle">Information</h2>
      <el-row type="flex" justify="space-between">
        <el-col :span="12" class="comic-information text-left">{{ getPublisherName(product) }}</el-col>
        <el-col :span="12" class="comic-information text-right">{{ product.price_usd }}</el-col>
      </el-row>
      <el-divider></el-divider>
      <p><strong>Price: </strong>${{ product.price_usd }}</p>
      <el-row type="flex" justify="center" class="comic-control">
        <el-col :span="12" class="comic-information text-left">
          <el-input-number v-model="quantity" :min="1" :max="99"/>
        </el-col>
        <el-col :span="12" class="comic-information text-right">
          <el-button @click="addToMyCart()" type="primary">
            {{ $t("comic.add-to-cart-button") }}
          </el-button>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" class="comic-control">
        <el-col :span="12">
          <el-button @click="backToList" type="primary">{{ $t("comic.back-button") }}</el-button>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<style scoped lang="scss">
.comic-page {
  margin-bottom: 30px;

  img {
    width: 100%;
  }
}

.comic-information {
  color: #5c5c5c;
}

.comic-control {
  margin-top: 20px;
}
</style>
