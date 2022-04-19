<script lang="ts">
import {Options, Vue} from "vue-class-component";
import ProductBox from "@/components/ProductBox.vue";
import {createNamespacedHelpers} from "vuex";
import AsideComponent from "@/components/layout/AsideComponent.vue";

const storeAuth = createNamespacedHelpers("auth");
const storeProduct = createNamespacedHelpers("product");
@Options({
  name: "Category",
  components: {
    AsideComponent,
    ProductBox,
  },
  methods: {
    ...storeAuth.mapMutations(["setIsLoading", "changeViewMode", "changePerPage"]),
    ...storeProduct.mapActions(["getProductListByParams"]),
  },
  computed: {
    ...storeProduct.mapState(["products"]),
    ...storeAuth.mapState(["status"]),
  },
  watch: {
    $route(to, from) {
      // console.log('WATCH', to, from);
      if (to.name == 'category') {
        this.currentPage = 1;
        this.loadProducts();
      }
    },
  },
})
export default class Category extends Vue {
  protected products?: any;
  protected setIsLoading?: Function;
  protected getProductListByParams?: Function;
  protected changeViewMode?: Function;
  protected changePerPage?: Function;
  protected status?: any;
  protected searchValue = "";
  protected currentPage = 1;

  mounted() {
    this.loadProducts();
  }

  loadProducts() {
    this.setIsLoading && this.setIsLoading(true);
    this.getProductListByParams &&
    this.getProductListByParams({
      product_type: this.product_type,
      publisher_slug: this.$route.params.publisher_slug,
      page: this.currentPage,
      perPage: this.pageSize,
    });
    this.setIsLoading && this.setIsLoading(false);
  }

  get viewMode() {
    return this.status.viewMode;
  }

  get productList() {
    return this.products.results;
  }

  get paginatorTotal() {
    return this.products["count"];
  }

  created() {
    const title = String(this.$route.params.product_type);
    document.title = title.charAt(0).toUpperCase() + title.slice(1).replace("-", " ") + " | Comics";
  }

  changeView() {
    this.changeViewMode && this.changeViewMode();
  }

  get product_type() {
    return this.$route.params.product_type;
  }

  get viewSize(): number {
    return this.viewMode ? 5 : 10;
  }

  get pageSize(): number {
    return this.status.perPage;
  }

  getOffset(index: number): number {
    return index % (this.viewMode ? 4 : 2) ? 1 : 0;
  }

  handleSizeChange(val: number) {
    this.changePerPage && this.changePerPage(val);
    this.loadProducts();
    // console.log(`${val} items per page`)
  }

  handleCurrentChange(val: number) {
    this.currentPage = val;
    this.loadProducts();
    // console.log(`current page: ${val}`)
  }
}
</script>
<template>
  <div class="category">
    <el-container>
      <AsideComponent width="200px"></AsideComponent>
      <el-container>
        <el-container>
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
            <el-col v-if="!productList">
              {{ $t("empty-page") }}
            </el-col>
            <el-col
                v-else
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
            <el-col v-if="productList?.length" :span="24">
              <el-pagination
                  v-model:currentPage="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[8, 16, 32, 60, 100]"
                  :small="true"
                  :background="true"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="paginatorTotal"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
              />
            </el-col>
          </el-row>
        </el-container>
      </el-container>
    </el-container>
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
