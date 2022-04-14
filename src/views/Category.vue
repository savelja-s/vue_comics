<script lang="ts">
import {Options, Vue} from "vue-class-component";
import ProductBox from '@/components/ProductBox.vue'
import {PreorderComicInterface} from "@/types";
import {createNamespacedHelpers} from "vuex";
import {PropType} from "vue";

const storeUser = createNamespacedHelpers("user");
const storePreopderComics = createNamespacedHelpers("PreopderComics");
@Options({
  name: "Category",
  components: {
    ProductBox,
  },
  methods: {
    ...storeUser.mapMutations(["setIsLoading"]),
    ...storePreopderComics.mapActions(["getPreorderListByParams"]),
  },
  computed: {
    ...storePreopderComics.mapState(["preorderComics"]),
  },
  watch: {
    $route(to, from) {
      const CATEGORIES = ['preorder-comics', 'comics']
      // console.log('WATCH', to, from);
      if (CATEGORIES.includes(to.name)) {
        const publisher_slug = this.$route.params.publisher_slug;
        this.getPreorderListByParams({product_type: to.name, publisher_slug});
      }
    }
  },
})
export default class Category extends Vue {
  protected preorderComics?: PropType<PreorderComicInterface[]>;
  protected product_type = '';
  protected setIsLoading?: Function;
  protected getPreorderListByParams?: Function;
  protected viewMode = true;
  protected searchValue = "";


  mounted() {
    const product_type = String(this.$route.name);
    this.product_type = product_type;
    const publisher_slug = this.$route.params.publisher_slug;
    this.setIsLoading && this.setIsLoading(true);
    this.getPreorderListByParams && this.getPreorderListByParams({product_type, publisher_slug});
    this.setIsLoading && this.setIsLoading(false);
  }

  get productList() {
    return this.preorderComics;
  }

  created() {
    document.title = this.$route.meta.title + ' | Comics'
  }

  changeView() {
    this.viewMode = !this.viewMode;
  }
}
</script>
<template>
  <div class="category">
    <el-row type="flex" justify="center">
      <el-col :span="12" class="comics-control">
        <el-input :placeholder="$t('search')" v-model="searchValue"></el-input>
        <el-tooltip
            effect="dark"
            :content="$t('tooltip')"
            placement="top-start"
        >
          <el-button type="primary" circle @click="changeView()">
            <el-icon v-if="viewMode">
              <edit/>
            </el-icon>
            <el-icon v-else>
              <star/>
            </el-icon>
          </el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <div v-if="productList.length" :class="viewMode ? '' : 'block-view'">
      <ProductBox
          v-for="comic in productList"
          :view-mode="viewMode"
          v-bind:key="comic.id"
          v-bind:product="comic"
          v-bind:product_type="product_type"
          v-bind:search="searchValue"
      ></ProductBox>
    </div>
    <div v-else>
      {{ $t("empty-page") }}
    </div>
  </div>
</template>
<style scoped lang="scss">
.comics-control {
  .el-input {
    display: inline-block;
    width: 250px;
    margin: 0 5px 0 0;
    @media (max-width: 768px) {
      display: block;
      width: 100%;
      margin: 0 10px 0 0;
    }
  }
}

.block-view {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
</style>
