<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { PreorderComicInterface } from "@/types";
import ComicBox from "@/components/ComicBox.vue";
import { createNamespacedHelpers } from "vuex";
import { PropType } from "vue";

const store = createNamespacedHelpers("PreopderComics");
@Options({
  name: "ComicDetailPage",
  components: {
    ComicBox,
  },
  computed: {
    ...store.mapState(["preorderComic"]),
  },
  methods: { ...store.mapActions(["getById"]) },
})
export default class ComicDetailPage extends Vue {
  protected preorderComic?: PropType<PreorderComicInterface>;
  protected getById?: Function;

  getPublisherName(comic: PreorderComicInterface) {
    if (comic.publisher) {
      return comic.publisher.name;
    }
  }

  created() {
    if (!this.preorderComic && this.getById) {
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
        {{ preorderComic.title }}
      </h1>
      <img :src="preorderComic.image" alt="comic picture"/>
      <p>
        {{ preorderComic.description }}
      </p>
      <el-divider></el-divider>
      <el-row type="flex" justify="space-between">
        <el-col :span="12" class="comic-information text-left">
          {{ getPublisherName(preorderComic) }}
        </el-col>
        <el-col :span="12" class="comic-information text-right">
          {{ preorderComic.price_usd }}
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
