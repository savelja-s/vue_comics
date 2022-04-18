<script lang="ts">
import {Options, Vue} from "vue-class-component";
import PublisherItemsComponent from "@/components/layout/PublisherItemsComponent.vue";


@Options({
  name: "AsideComponent",
  components: {
    PublisherItemsComponent
  },

})
export default class AsideComponent extends Vue {
  protected get activeItem() {
    const publisher_slug = this.$route.params.publisher_slug;
    const product_type = this.$route.params.product_type;
    return `/${product_type}/${publisher_slug}`;
  }
}
</script>
<template>
  <el-aside>
    <el-scrollbar>
      <el-menu
          class="el-menu-vertical-demo"
          :default-active="$route.fullPath"
          :default-openeds="['publishers']"
      >
        <el-sub-menu index="publishers">
          <template #title>
            <el-icon>
              <location/>
            </el-icon>
            <span>{{ $t("publishers") }}</span>
          </template>
          <PublisherItemsComponent
              :product_type="$route.params.product_type"
          ></PublisherItemsComponent>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>
<style scoped>

</style>