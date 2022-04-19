<script lang="ts">
import { Options, Vue } from "vue-class-component";
import api from "@/services/api";
import { reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import { createNamespacedHelpers } from "vuex";

const storeAuth = createNamespacedHelpers("auth");

@Options({
  name: "LoginPage",
  components: {},
  methods: { ...storeAuth.mapMutations(["login"]) },
})
export default class LoginPage extends Vue {
  // validateEmail = (rule: any, value: string, callback: any) => {
  //   const validationsRule =
  //       /^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/;
  //   if (!validationsRule.test(value)) {
  //     callback(new Error("Please input the email"));
  //   } else {
  //     callback();
  //   }
  // };
  protected login?: Function;
  ruleFormRef = ref<FormInstance>();
  ruleForm = reactive({
    username: "",
    password: "",
    // email: "",
  });
  rules = reactive({
    username: [
      {
        required: true,
        message: "Please input Activity name",
        trigger: "blur",
      },
      { min: 3, max: 50, message: "Length should be 3 to 50", trigger: "blur" },
    ],
    password: [
      { required: true, message: "Please input password", trigger: "blur" },
      { min: 3, max: 50, message: "Length should be 3 to 50", trigger: "blur" },
    ],
  });

  async submitForm(formEl: FormInstance | undefined) {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        const { username, password } = this.ruleForm;
        if (!username || !password) return;
        api
          .getInstance()
          .post("/token/login/", { username, password })
          .then((response: any) => {
            if (this.login) {
              this.login({ ...response.data, username });
              this.$router.push({ name: "home" });
            }
          })
          .catch((error: any) => console.log(error));
      } else {
        return false;
      }
    });
  }

  resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
  };
}
</script>
<template>
  <el-row type="flex" justify="center">
    <el-col :span="6">
      <div>
        <h1>Login</h1>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleFormRef"
          label-width="120px"
          class="demo-ruleForm"
        >
          <!--          <el-form-item label="Email" prop="email">-->
          <!--            <el-input-->
          <!--                type="text"-->
          <!--                v-model="ruleForm.email"-->
          <!--                autocomplete="off"-->
          <!--            ></el-input>-->
          <!--          </el-form-item>-->
          <el-form-item label="Username" prop="username">
            <el-input
              type="text"
              v-model="ruleForm.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
              Submit
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
h1 {
  text-align: center;
}
</style>
