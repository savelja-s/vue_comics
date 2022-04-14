<template>
  <div id="app">
    <HeaderComponent v-if="$route.name != 'login' && $route.name != '404'">
    </HeaderComponent>
    <div
      class="is-loading-bar"
      v-bind:class="{ 'is-loading': status.isLoading }"
    >
      <div class="lds-dual-ring"></div>
    </div>
    <el-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
    <FooterComponent v-if="$route.name != 'login' && $route.name != '404'">
    </FooterComponent>
  </div>
</template>

<script lang="ts">
// import EventBus from "./common/EventBus";
import HeaderComponent from "./components/layout/HeaderComponent.vue";
import FooterComponent from "./components/layout/FooterComponent.vue";
import { Options, Vue } from "vue-class-component";
import { createNamespacedHelpers } from "vuex";

const store = createNamespacedHelpers("user");

@Options({
  name: "App",
  components: {
    HeaderComponent,
    FooterComponent,
  },
  computed: { ...store.mapState(["user", "cart", "status"]) },
  // beforeCreate() {},
  // beforeDestroy() {
  //   //TODO: ????
  //   EventBus.remove("logout");
  // },
  // mounted() {
  //   //TODO: ????
  //   EventBus.on("logout", () => {
  //     this.logOut();
  //   });
  // },
  // methods: {
  //   logOut() {
  //     console.log("logOut NEEED UPDATE");
  //     // this.$store.dispatch('user/logout');
  //     // this.$router.push("/");
  //   },
  // },
})
export default class App extends Vue {
  protected showMobileMenu = false;
  protected user?: any;
  protected status?: any;

  // created() {}
}
</script>

<style>
.el-main {
  overflow: hidden;
}

.fade-enter-active {
  animation: sladePageIn 1s forwards;
  animation-timing-function: cubic-bezier(0.8, -0.49, 0.36, 1);
}

.fade-leave-active {
  animation: sladePageDown 1s forwards;
  animation-timing-function: cubic-bezier(0.8, -0.49, 0.36, 1);
}

@keyframes slidePageIn {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0%);
  }
}

@keyframes sladePageDown {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.1;
    transform: translateY(100%);
  }
}

.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}

.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #ccc;
  border-color: #ccc transparent #ccc transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}

@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.is-loading-bar {
  height: 0;
  overflow: hidden;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;

  & .is-loading {
    height: 80px;
  }
}
</style>
