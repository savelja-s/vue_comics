<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { PreorderComicInterface } from "@/types";
import ComicBox from "@/components/ComicBox.vue";
import { createNamespacedHelpers } from "vuex";
import { PropType } from "vue";

const store = createNamespacedHelpers("product");
@Options({
  name: "ComicDetailPage",
  components: {
    ComicBox,
  },
  computed: {
    ...store.mapState(["product"]),
  },
  methods: { ...store.mapActions(["getById"]) },
})
export default class ComicDetailPage extends Vue {
  protected product?: PropType<PreorderComicInterface>;
  protected getById?: Function;

  getPublisherName(comic: PreorderComicInterface) {
    if (comic.publisher) {
      return comic.publisher.name;
    }
  }

  created() {
    if (!this.product && this.getById) {
      this.getById(this.$route.params.id);
    }
  }

  backToList() {
    this.$router.go(-1);
  }
}
</script>
<template>
  <el-row type="flex" justify="center" class="comic-page">
    <el-col :xs="23" :sm="22" :md="20" :lg="16" :xl="16">
      <h1>
        {{ product.title }}
      </h1>
      <img :src="product.image" alt="comic picture"/>
      <p>
        {{ product.description }}
      </p>
      <el-divider></el-divider>
      <el-row type="flex" justify="space-between">
        <el-col :span="12" class="comic-information text-left">
          {{ getPublisherName(product) }}
        </el-col>
        <el-col :span="12" class="comic-information text-right">
          {{ product.price_usd }}
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" class="comic-control">
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
