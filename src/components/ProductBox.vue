<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { PreorderComicInterface } from "@/types";
import { PropType } from "vue";
import { createNamespacedHelpers } from "vuex";
import { ElNotification } from "element-plus";

const store = createNamespacedHelpers("PreopderComics");
const storeUser = createNamespacedHelpers("user");

@Options({
  name: "ProductBox",
  components: {},
  methods: {
    ...store.mapMutations(["setComic"]),
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
    product_type: { required: true },
  },
})
export default class ProductBox extends Vue {
  protected setComic?: Function;
  protected status?: any;
  protected product_type?: string;
  protected product?: PropType<PreorderComicInterface>;
  protected quantity = 1;
  protected addToCart?: Function;

  getRoute(product: PreorderComicInterface): Object {
    return {
      name: "product-preorder",
      path: `/${this.product_type}/${product.publisher?.slug}/${product.slug}/`,
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

  viewMore(product: PreorderComicInterface) {
    if (product) {
      this.setComic && this.setComic(product);
      const params = {
        name: "product-preorder",
        params: {
          product_type: this.product_type,
          publisher_slug: product.publisher?.slug,
          product_slug: product.slug,
        },
      };
      this.$router.push(params);
    }
  }

  get viewMode() {
    return this.status.viewMode;
  }

  created() {
    console.log("this.viewMode", this.viewMode);
  }
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
}
</script>
<template>
  <el-card :body-style="{ padding: '0px' }">
    <el-row type="flex" justify="center" class="comic-page">
      <el-col :span="24">
        <h4 class="title">{{ product.title }}</h4>
      </el-col>
      <el-col :span="16">
        <el-row type="flex" justify="center" class="comic-control">
          <el-col :span="12">
            <el-image
              v-if="product.image"
              :src="product.image || '@/assets/logo.png'"
              fit="fill"
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
        </el-row>
      </el-col>
      <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
        <h2 class="subtitle">Information</h2>
        <el-row type="flex" justify="space-between">
          <el-col :span="24" class="comic-information text-left">
            {{ getPublisherName(product) }}
          </el-col>
          <el-col :span="24" class="comic-information text-right">
            <p>{{ truncate(product.description) }}</p>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <p><strong>Price: </strong>${{ product.price_usd }}</p>
        <el-row type="flex" justify="center" class="comic-control">
          <el-col :span="24" class="comic-information text-left">
            <el-input-number v-model="quantity" :min="1" :max="99"/>
          </el-col>
          <el-col :span="24" class="comic-information text-right">
            <el-button @click="addToMyCart" type="primary">
              {{ $t("comic.add-to-cart-button") }}
            </el-button>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" class="comic-control">
          <el-col :span="12">
            <router-link v-bind:to="getRoute(product)" class="button is-dark mt-4">
              {{ $t("comic.details") }}
            </router-link>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!--    <img-->
    <!--      src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"-->
    <!--      class="image"-->
    <!--    />-->
    <!--    <div style="padding: 14px">-->
    <!--      <span>Yummy hamburger</span>-->
    <!--      <div class="bottom">-->
    <!--        <time class="time">{{ 12 }}</time>-->
    <!--        <el-button type="text" class="button">Operating</el-button>-->
    <!--      </div>-->
    <!--    </div>-->
  </el-card>
  <!--  <el-row type="flex" justify="center" :class="viewMode ? '' : 'block-el-row'">-->
  <!--    <el-col :xs="23" :sm="22" :md="22" :lg="22" :xl="22" class="comics-detail">-->
  <!--      <el-row type="flex" justify="center">-->
  <!--        <el-col :span="viewMode ? 12 : 24">-->
  <!--          <h3>-->
  <!--            {{ product.title }}-->
  <!--          </h3>-->
  <!--        </el-col>-->
  <!--      </el-row>-->
  <!--      <el-row-->
  <!--        type="flex"-->
  <!--        justify="center"-->
  <!--        :class="viewMode ? 'comics-sub-title' : 'comics-sub-title-block'"-->
  <!--      >-->
  <!--        <el-col :span="viewMode ? 5 : 24">-->
  <!--          {{ $t("comic.publisher-title") }}-->
  <!--          <strong>{{ getPublisherName(product) }}</strong>-->
  <!--        </el-col>-->
  <!--        <el-col :span="viewMode ? 5 : 24">-->
  <!--          {{ $t("comic.description-title") }}-->
  <!--          <strong>{{ truncate(product.description) }}</strong>-->
  <!--        </el-col>-->
  <!--        <el-col :span="viewMode ? 5 : 24">-->
  <!--          {{ $t("comic.price-title") }}-->
  <!--          <strong>{{ product.price_usd }}</strong>-->
  <!--        </el-col>-->
  <!--      </el-row>-->
  <!--      <el-row type="flex" justify="center">-->
  <!--        <el-col :span="viewMode ? 16 : 24">-->
  <!--          <el-image-->
  <!--            v-if="product.image"-->
  <!--            style="width: 100px; height: 100px"-->
  <!--            :src="product.image"-->
  <!--            fit="fill"-->
  <!--            alt="comic image"-->
  <!--          />-->
  <!--          <el-empty v-else :image-size="200" alt="comic image"/>-->
  <!--        </el-col>-->
  <!--      </el-row>-->
  <!--      <el-row type="flex" justify="center">-->
  <!--        <el-col :span="viewMode ? 12 : 22">-->
  <!--          <p>Some DATA or NOT</p>-->
  <!--        </el-col>-->
  <!--      </el-row>-->
  <!--      <el-row type="flex" justify="center">-->
  <!--        <el-col :span="12" class="comic-control">-->
  <!--          <el-button @click="viewMore(product)">-->
  <!--            {{ $t("comic.view-more-button") }}-->
  <!--          </el-button>-->
  <!--        </el-col>-->
  <!--      </el-row>-->
  <!--    </el-col>-->
  <!--  </el-row>-->
  <!--  <div class="column is-3">-->
  <!--    <div class="box">-->
  <!--      <figure class="image mb-4">-->
  <!--        <img v-bind:src="product.image || 'noimage.png'" />-->
  <!--      </figure>-->
  <!--      <h3 class="is-size-4">{{ product.title }}</h3>-->
  <!--      <p class="is-size-6 has-text-grey">${{ product.price_usd }}</p>-->
  <!--      <router-link v-bind:to="getRoute(product)" class="button is-dark mt-4">-->
  <!--        View details-->
  <!--      </router-link>-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<style scoped lang="scss">
//.comics-detail {
//  margin-bottom: 40px;
//
//  &:first-child {
//    margin-bottom: 20px;
//  }
//
//  img {
//    width: 100%;
//  }
//
//  h3 {
//    margin: 0;
//    font-size: 30px;
//    line-height: 43px;
//    text-align: center;
//    color: #1e1e1e;
//  }
//}
//
//.comics-sub-title {
//  margin: 25px 0;
//
//  div {
//    text-align: center;
//    font-weight: normal;
//    font-size: 14px;
//    line-height: 1.7;
//    color: #9b9b9b;
//
//    strong {
//      color: #4a4a4a;
//    }
//  }
//}
//
//.comic-control {
//  text-align: center;
//  margin: 15px 0;
//}
//
//.block-el-row {
//  width: 50%;
//  @media (max-width: 480px) {
//    width: 100%;
//  }
//}
//
//.comics-sub-title-block {
//  flex-direction: column;
//
//  div {
//    padding: 5px;
//  }
//}

.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}

.el-card {
  margin-bottom: 20px;
}
</style>
