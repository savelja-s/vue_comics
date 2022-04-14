<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ProductBox from "@/components/ProductBox.vue";
import { PreorderComicInterface } from "@/types";
import { createNamespacedHelpers } from "vuex";
import { PropType } from "vue";

const storeUser = createNamespacedHelpers("user");
const storePreopderComics = createNamespacedHelpers("PreopderComics");
@Options({
  name: "Category",
  components: {
    ProductBox,
  },
  methods: {
    ...storeUser.mapMutations(["setIsLoading", "changeViewMode"]),
    ...storePreopderComics.mapActions(["getPreorderListByParams"]),
  },
  computed: {
    ...storePreopderComics.mapState(["preorderComics"]),
    ...storeUser.mapState(["status"]),
  },
  watch: {
    $route(to, from) {
      const CATEGORIES = ["preorder-comics", "comics"];
      // console.log('WATCH', to, from);
      if (CATEGORIES.includes(to.name)) {
        const publisher_slug = this.$route.params.publisher_slug;
        this.getPreorderListByParams({ product_type: to.name, publisher_slug });
      }
    },
  },
})
export default class Category extends Vue {
  protected preorderComics?: PropType<PreorderComicInterface[]>;
  protected product_type = "";
  protected setIsLoading?: Function;
  protected getPreorderListByParams?: Function;
  protected changeViewMode?: Function;
  protected status?: any;
  protected searchValue = "";

  mounted() {
    const product_type = String(this.$route.name);
    this.product_type = product_type;
    const publisher_slug = this.$route.params.publisher_slug;
    this.setIsLoading && this.setIsLoading(true);
    this.getPreorderListByParams &&
    this.getPreorderListByParams({ product_type, publisher_slug });
    this.setIsLoading && this.setIsLoading(false);
  }

  get viewMode() {
    return this.status.viewMode;
  }

  get productList() {
    return this.preorderComics;
  }

  created() {
    document.title = this.$route.meta.title + " | Comics";
  }

  changeView() {
    this.changeViewMode && this.changeViewMode();
  }

  get viewSize(): number {
    return this.viewMode ? 5 : 10;
  }

  getOffset(index: number): number {
    return index % (this.viewMode ? 4 : 2) ? 1 : 0;
  }
}
</script>
<template>
  <div class="category">
    <el-row type="flex" justify="center">
      <el-col :span="3"> aside</el-col>
      <el-col :span="21">
        <el-row justify="center">
          <el-col :span="24" class="comics-control">
            <el-input
              :placeholder="$t('search')"
              v-model="searchValue"
            ></el-input>
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
          <el-col
            v-for="(comic, index) in productList"
            :key="comic.id"
            :span="viewSize"
            :offset="getOffset(index)"
            class="product-item"
          >
            <ProductBox
              :product="comic"
              :product_type="product_type"
            ></ProductBox>
          </el-col>
          <el-col v-if="!productList.length">
            {{ $t("empty-page") }}
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<style scoped lang="scss">
.comics-control {
  margin-bottom: 20px;

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
</style>
