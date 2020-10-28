<template>
  <div class="popupChangPass">
    <Modal width="430px" title="修改密码" :visible="toastchildrenHidden" @ok="handleSubmit" @cancel="emptyFrom()" okText="确认" cancelText="取消">
      <a-form
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 14 }"
      :form="form"
      :onFieldsChange="handleInputChange()"
      id="components-form-demo-normal-login">
        <FormItem label="原密码">
          <Input placeholder="请输入原密码" type="password" v-decorator="[
            'oldPassWord',
            { rules: [{ required: true, message: '请输入原密码' }] }
          ]"/>
        </FormItem>
        <FormItem label="新密码">
          <Input placeholder="请输入新密码" type="password" v-decorator="[
            'newPassWord',
            { rules: [{ required: true, message: '请输入新密码' }] }
          ]"/>
        </FormItem>
        <FormItem label="确认密码">
          <Input placeholder="请输入确认密码" type="password" v-decorator="[
            'confirmPassWord',
            { rules: [{ required: true, message: '请输入确认密码' }] }
          ]" />
        </FormItem>
        <div class="ant-form-explain jiaoyan" v-if="quebool">新密码和确认密码不一致</div>
      </a-form>
    </Modal>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  Modal,
  Input
} from 'ant-design-vue'
interface data {
  toastchildrenHidden: boolean,
  form: any,
  quebool: Boolean
}
export default Vue.extend({
  name: 'changePassForm',
  data (): data {
    return {
      toastchildrenHidden: false,
      form: this.$form.createForm(this),
      quebool: false
    }
  },
  components: {
    Modal,
    Input
  },
  computed: {
    ...mapState({
      name: (state: any) => state.user.username
    })
  },
  methods: {
    handleSubmit(e: any) {
      e.preventDefault()
      this.form.validateFields(async (err: any, values: {oldPassWord: string, newPassWord: string, confirmPassWord: string}) => {
        if (!err) {
          if (values.newPassWord !== values.confirmPassWord) {
            this.quebool = true
            return
          }
          this.quebool = false
          let res = await this.$fetch({
            url: '/user-service/user/changePassword',
            method: 'PUT',
            params: {
              newPasswork: values.newPassWord,
              passwork: values.oldPassWord,
              username: this.name
            }
          })
          if (res.data.success) {
            this.$message.info('修改成功')
            this.$store.dispatch('Logout')
            // this.$router.push('/login')
          } else {
            this.$message.warning(res.data.message)
          }
        }
      })
    },
    handleInputChange () {
      this.form.validateFields(async (err: any, values: {newPassWord: string, confirmPassWord: string}) => {
        if (err && this.quebool) {
          this.quebool = false
        }
      })
    },
    emptyFrom () {
      this.form.resetFields()
      this.toastchildrenHidden = false
      this.quebool = false
    },
    getParent () {
      this.toastchildrenHidden = true
    }
  }
})
</script>
<style lang="scss">
.jiaoyan {
  color: #f5222d;
  text-align: center;
  transform: translateY(-24px);
}
</style>
