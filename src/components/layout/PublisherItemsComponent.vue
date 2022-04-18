<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {PublisherInterface} from "@/types";
import {createNamespacedHelpers} from "vuex";

const storePublisher = createNamespacedHelpers("publisher");

@Options({
  name: "PublisherItemsComponent",
  components: {},
  computed: {
    ...storePublisher.mapState(["publishers"]),
  },
  props: {
    product_type: {required: true, type: String},
  },
})
export default class PublisherItemsComponent extends Vue {
  protected publishers?: any;
  protected product_type?: string;

  protected get publishersList() {
    return this.publishers;
  }

  getRoute(publisher?: PublisherInterface): Object {
    return {name: "category", params: {product_type: this.product_type, publisher_slug: publisher?.slug}};
  }

  getIndex(publisher: PublisherInterface) {
    return `/${this.product_type}/${publisher.slug}`;
  }
}
</script>
<template>
  <div v-if="publishersList && product_type">
    <el-menu-item :index="product_type">
      <router-link :to="getRoute()">
        {{ $t("all") }}
      </router-link>
    </el-menu-item>
    <el-menu-item
        v-for="publisher in publishersList"
        :key="publisher.id"
        :index="getIndex(publisher)"
    >
      <router-link :to="getRoute(publisher)">
        {{ publisher.name }}
      </router-link>
    </el-menu-item>
  </div>
</template>
<style scoped>

</style>