<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {PreorderComicInterface} from "@/types";
import {PropType, ref} from 'vue'
import {createNamespacedHelpers} from "vuex";

const store = createNamespacedHelpers("PreopderComics");

@Options({
  name: "ComicBox",
  components: {},
  methods: {...store.mapMutations(["setComic"])},
  props: {
    comic: {required: true, type: Object as PropType<PreorderComicInterface>,},
    viewMode: {required: true, default: true},
    search: {required: true, default: ""},
  }
})
export default class ComicBox extends Vue {
  // comic?: PreorderComic = ref(PreorderComic);
  viewMode: boolean = true;
  // search: string = "";
  protected setComic?: Function;

  // created() {
  //  console.log('ComicBox.comic', this.comic);
  // }

  truncate(str?: string, n?: number): string | undefined {
    if (!str || !n) {
      return str;
    }
    return str.length > n ? `${str.substring(0, n - 1)} ...` : str;
  }

  viewMore(comic: PreorderComicInterface) {
    if (comic && this.setComic) {
      this.setComic(comic);
      this.$router.push({
        name: "comic-detail",
        params: {id: comic.id, comic: JSON.stringify(comic)},
      });
    }
  }
}
</script>
<template>
  <el-row type="flex" justify="center" :class="viewMode ? '' : 'block-el-row'">
    <el-col
        :xs="23"
        :sm="22"
        :md="22"
        :lg="viewMode ? 18 : 22"
        :xl="viewMode ? 18 : 22"
        class="comics-detail"
        v-if="comic.title === search || search.length === 0"
    >
      <el-row type="flex" justify="center">
        <el-col :span="viewMode ? 12 : 24">
          <h3>
            {{ comic.title }}
          </h3>
        </el-col>
      </el-row>
      <el-row
          type="flex"
          justify="center"
          :class="viewMode ? 'comics-sub-title' : 'comics-sub-title-block'"
      >
        <el-col :span="viewMode ? 5 : 24">
          {{ $t("comic.publisher-title") }}
          <strong>{{ comic.publisher.name }}</strong>
        </el-col>
        <el-col :span="viewMode ? 5 : 24">
          {{ $t("comic.description-title") }}
          <strong>{{ truncate(comic.description, 200) }}</strong>
        </el-col>
        <el-col :span="viewMode ? 5 : 24">
          {{ $t("comic.price-title") }}
          <strong>{{ comic.price_usd }}</strong>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="viewMode ? 16 : 24">
          <img :src="comic.image" :alt="`comic image`"/>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="viewMode ? 12 : 22">
          <p>Some DATA or NOT</p>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="12" class="comic-control">
          <el-button @click="viewMore(comic)">
            {{ $t("comic.view-more-button") }}
          </el-button>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.comics-detail {
  margin-bottom: 40px;

  &:first-child {
    margin-bottom: 20px;
  }

  img {
    width: 100%;
  }

  h3 {
    margin: 0;
    font-size: 30px;
    line-height: 43px;
    text-align: center;
    color: #1e1e1e;
  }
}

.comics-sub-title {
  margin: 25px 0;

  div {
    text-align: center;
    font-weight: normal;
    font-size: 14px;
    line-height: 1.7;
    color: #9b9b9b;

    strong {
      color: #4a4a4a;
    }
  }
}

.comic-control {
  text-align: center;
  margin: 15px 0;
}

.block-el-row {
  width: 50%;
  @media (max-width: 480px) {
    width: 100%;
  }
}

.comics-sub-title-block {
  flex-direction: column;

  div {
    padding: 5px;
  }
}
</style>
