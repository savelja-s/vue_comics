<script lang="ts">
import ComicBox from "@/components/ComicBox.vue";
import {Options, Vue} from "vue-class-component";
import {createNamespacedHelpers} from "vuex";
import {PreorderComicInterface} from "@/types";
import {PropType} from "vue";

const store = createNamespacedHelpers("PreopderComics");

@Options({
  name: "Home",
  components: {
    ComicBox,
  },
  computed: {
    ...store.mapState(["preorderComicsLatest"]),
  },
  methods: {...store.mapActions(["getLatest"])},
})
export default class Home extends Vue {
  protected searchValue = "";
  protected viewMode = true;
  protected getLatest?: Function;
  protected preorderComicsLatest?: PropType<PreorderComicInterface[]>;

  mounted() {
    // console.log("mounted", this);
    this.getLatest && this.getLatest();
    // useStore().dispatch("PreopderComics/getLatest");
  }

  changeView() {
    this.viewMode = !this.viewMode;
  }
}
</script>
<template>
  <div class="home">
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
    <div v-if="preorderComicsLatest" :class="viewMode ? '' : 'block-view'">
      <ComicBox
          v-for="comic in preorderComicsLatest"
          :view-mode="viewMode"
          v-bind:key="comic.id"
          :comic="comic"
          :search="searchValue"
      ></ComicBox>
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
