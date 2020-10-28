<template>
  <div class="login">
    <div class="content">
      <div class="input-format">
        <img class="logon" src="@/assets/images/logo.svg" alt />
        <h2 class="title">智慧钢铁管理平台</h2>
        <a-form
          id="components-form-demo-normal-login"
          :form="form"
          class="login-form"
          @submit="handleSubmit">
          <FormItem>
            <Input
              size="large"
              v-decorator="[
                'username',
                { rules: [{ required: true, message: '请输入账号' }] },
              ]"
              placeholder="请输入账号"
              class="port-input">
              <Icon slot="prefix" type="user" style="color: rgba(0,0,0,.25);font-size:18px" />
            </Input>
          </FormItem>
          <FormItem>
            <Input
              size="large"
              v-decorator="[
                'password',
                { rules: [{ required: true, message: '密码不正确' }] },
              ]"
              type="password"
              placeholder="请输入密码"
              class="port-input password">
              <Icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25);font-size:18px" />
            </Input>
          </FormItem>
          <FormItem>
            <Button
              block
              type="primary"
              size="large"
              html-type="submit"
              class="login-form-button-primary">
              <!-- 禁用状态请去掉 login-form-button-primary -->
              登录
            </Button>
            <div class="tooltip-container">
              <Popover trigger="hover">
                <template slot="content">
                  <div class="tooltip-title">
                    如忘记账号或密码，请联系
                    <br />管理员：
                    <span class="phone">138-2449-3351</span>
                  </div>
                </template>
                忘记账号或密码？
              </Popover>
            </div>
          </FormItem>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Input, Icon, Button, Popover } from 'ant-design-vue'
export default Vue.extend({
  name: "login",
  components: {
    Input,
    Icon,
    Button,
    Popover
  },
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    handleSubmit(e: any) {
      e.preventDefault();
      this.form.validateFields(async (err: any, values: {username: string}) => {
        if (!err) {
          const res = await this.$fetch({
            url: '/user-service/auth/getToken',
            params: values,
            data: {}
          })
          if (res.data.success) {
            this.$store.dispatch('SetUserInfo', {...res.data.data, username: values.username})
            this.$store.dispatch('generateRoutes').then(accessRoutes => {
              // 生成可访问的路由表
              this.$router.addRoutes(accessRoutes) // 动态添加可访问路由表
            })
            this.$router.replace('/')
          }
        }
      });
    }
  }
})
</script>
<style lang="scss">
.login {
  background: url("~@/assets/images/bg.svg") no-repeat center center;
  height: 100vh;
  background-size: cover;
  padding: 50px 0;
  .content {
    height: 100%;
    background: url("~@/assets/images/content.png") no-repeat left;
    background-size: 49%;
    display: flex;
    justify-content: flex-end;
    padding-right: 12%;
    align-items: center;

    .input-format {
      width: 340px;
      height: 440px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.09);
      border-radius: 4px;
      padding: 40px 37px;
      text-align: left;
      .title {
        font-size: 32px;
        padding-top: 10px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #142969;
        margin-bottom: 40px;
      }

      .ant-input-affix-wrapper .ant-input-prefix {
        top: 52%;
        left: 10px;
      }
      .ant-input-affix-wrapper .ant-input:not(:first-child) {
        padding-left: 35px;
      }
      .port-input {
        border-color: #355db4;
        //
      }

      .tooltip-container {
        text-align: center;
        margin-top: 10px;
        cursor: pointer;
        font-weight: 400;
        color: rgba(140, 140, 140, 1);
      }
      .login-form-button-primary {
        margin-top: 8px;
      }
    }
  }
}
.tooltip-title {
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);

  .phone {
    color: #355db4;
  }
}
</style>