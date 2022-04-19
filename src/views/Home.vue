<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {createNamespacedHelpers} from "vuex";
import {PreorderComicInterface} from "@/types";
import {PropType} from "vue";
import ProductBox from "@/components/ProductBox.vue";

const storeAuth = createNamespacedHelpers("auth");
const storeProduct = createNamespacedHelpers("product");

@Options({
  name: "Home",
  components: {
    ProductBox,
  },
  computed: {
    ...storeProduct.mapState(["productsLatest"]),
    ...storeAuth.mapState(["status"]),
  },
  methods: {
    ...storeProduct.mapActions(["getLatest"]),
    ...storeAuth.mapMutations(["setIsLoading", "changeViewMode"]),
  },
})
export default class Home extends Vue {
  protected product_type = "preorder-comics";
  protected searchValue = "";
  protected getLatest?: Function;
  protected changeViewMode?: Function;
  protected productsLatest?: PropType<PreorderComicInterface[]>;
  protected status?: any;

  mounted() {
    // console.log("mounted", this);
    document.title = "Comics";
    !this.productsLatest?.length && this.getLatest && this.getLatest();
  }

  changeView() {
    this.changeViewMode && this.changeViewMode();
  }

  get viewMode() {
    return this.status.viewMode;
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
  <div class="home">
    <el-container>
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
            <el-col v-if="!productsLatest">
              {{ $t("empty-page") }}
            </el-col>
            <el-col
                v-else
                v-for="(comic, index) in productsLatest"
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
