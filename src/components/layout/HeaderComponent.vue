<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {ref} from "vue";
import {createNamespacedHelpers} from "vuex";
import {library} from '@fortawesome/fontawesome-svg-core';
import {faShoppingCart,faCloudUpload,faArrowRight} from '@fortawesome/free-solid-svg-icons';

library.add(faShoppingCart);

const store = createNamespacedHelpers("user");

@Options({
  name: "HeaderComponent",
  components: {},
  computed: {
    ...store.mapState(["user"]),
  },
  methods: {...store.mapMutations(["logout"]), ...store.mapGetters(["cartTotalLength"])},
})
export default class HeaderComponent extends Vue {
  activeIndexMenu: string = '/';
  menuIsActive: boolean = false;
  language = ref('en');
  private user?: any;
  protected logout?: Function;
  protected cartTotalLength?: Function;

  logoutUser() {
    this.logout && this.logout();
    this.$router.push('/');
  }

  login() {
    !this.user.username && this.$router.push("/login");
  }

  menuNav() {
    this.menuIsActive = !this.menuIsActive;
  }

  cartLength(): number {
    return this.cartTotalLength ? this.cartTotalLength()() : 0;
  }
}
</script>
<template>
  <el-header height="auto">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col class="header-logo" :span="12">
        <div>
          <a href="#">
            <img style="width: 29px; height: 29px" src="@/assets/logo.png" alt="logo">
          </a>
        </div>
      </el-col>
      <el-col class="header-menu" :span="12">
        <el-button plain size="small" class="mobile-nav" @click="menuNav">
          <el-icon v-if="menuIsActive">
            <menu/>
          </el-icon>
          <el-icon v-else>
            <close/>
          </el-icon>
        </el-button>
        <el-menu
            :default-active="activeIndexMenu"
            mode="horizontal"
            v-bind:class="{ '' : !menuIsActive, isOpen : menuIsActive }"
        >
          <el-menu-item index="/">
            <router-link to="/">{{ $t("menu.home") }}</router-link>
          </el-menu-item>
          <el-menu-item index="preorder-comics">
            <router-link to="/preorder-comics">{{ $t("menu.preorder-comics") }}</router-link>
          </el-menu-item>
          <el-menu-item index="comics">
            <router-link to="/comics">{{ $t("menu.comics") }}</router-link>
          </el-menu-item>
          <el-menu-item index="about">
            <router-link to="/about">{{ $t("menu.about") }}</router-link>
          </el-menu-item>
        </el-menu>
        <el-radio-group v-model="$i18n.locale" size="small">
          <el-radio-button
              v-for="locale in $i18n.availableLocales"
              :label="locale"
          >
            {{ locale.toUpperCase() }}
          </el-radio-button>
        </el-radio-group>
        <el-dropdown v-if="user.username" size="small">
          <el-button type="primary">
            {{ user.username }}
            <el-icon class="el-icon--right">
              <arrow-down/>
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                  <span @click="logoutUser" class="text-block">
                      <i class="el-icon-upload el-icon-right"></i>
                      {{ $t("buttons.logout") }}
                    </span>
              </el-dropdown-item>
              <el-dropdown-item>
                Action 2
              </el-dropdown-item>
              <el-dropdown-item>Action 3</el-dropdown-item>
              <el-dropdown-item>Action 4</el-dropdown-item>
              <el-dropdown-item>Action 5</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button v-else @click="login" class="logout-btn" size="small" type="info"
        >
          <i class="el-icon-upload el-icon-right"></i>
          <span class="text-block">{{ $t("buttons.login") }}</span>
        </el-button>
        <el-badge :value="cartLength()" class="item">
          <router-link to="/cart" class="button is-success">
            <el-button round type="info">
              <font-awesome-icon icon="shopping-cart"/>
            </el-button>
          </router-link>
        </el-badge>
      </el-col>
    </el-row>
  </el-header>

</template>
<style lang="scss" scoped>
.el-header {
  padding: 0;
  position: relative;
}

.el-menu.el-menu--horizontal {
  border-bottom: none;
}

.header-menu {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.el-button.el-button--info.el-button--mini {
  border: none;

  .el-menu-item {
    background: transparent;

    a {
      font-size: 16px;
      text-decoration: none;
    }

    &.is-active {
      border: none;
    }
  }

  @media(max-width: 776px) {
    display: none;
    opacity: 0;
    background: #585757;
  }

  &.isOpen {
    position: absolute;
    width: 100%;
    top: 60%;
    display: block;
    opacity: 1;
  }
}


.mobile-nav {
  display: none;
  margin: 15px 10px 0 0;
  font-size: 14px;
  height: 29px;
  padding: 0 5px;
  @media(max-width: 768px) {
    display: block;
  }
}

.header-logo {
  padding: 5px 10px;
  display: flex;
  height: 29px;
}

.el-radio-group {
  margin: 15px 15px 0 0;
}

.logout-btn {
  margin: 15px 15px 0 0;
  font-size: 14px;
  height: 29px;
  @media(max-width: 480px) {
    .text-block {
      display: none;
    }
  }
}
</style>