<template>
  <Popover placement="bottomRight" trigger="click" v-model="visible" class="Person">
    <div slot="content" @click="visible = false, toastShow()" class="changMenu">
      <span class="content1" style="display:inline-block;">
        <img src="@/assets/images/2.png" style="transform: translateY(-2px);margin-right:8px;width:16px;height:16px;">
      </span>
      <a href="javascript:;" style="color:#8C8C8C">修改密码</a>
    </div>
    <div slot="content" @click="Logout" class="changMenu" style="margin-top: 10px;">
      <span class="content1" style="display:inline-block;">
        <img src="@/assets/images/exit.svg" style="transform: translateY(-2px);margin-right:8px;">
      </span>
      <a href="javascript:;" style="color:#8C8C8C">退出</a>
    </div>
    <Icon type="user" class="icon_user" />
    <span class="ant-dropdown-link">
      {{name}}
      <Icon type="down" class="icon_down" />
    </span>
    <changePassForm ref="passchword"></changePassForm>
  </Popover>
</template>
<script lang="ts">
import Vue from 'vue'
import {
  Popover,
  Icon
} from 'ant-design-vue'
import { mapState } from 'vuex'
import changePassForm from './changePassForm.vue'
export default Vue.extend({
  name: 'Person',
  data () {
    return {
      visible: false
    }
  },
  components: {
    Popover,
    Icon,
    changePassForm
  },
  computed: {
    ...mapState({
      name: (state: any) => state.user.name
    })
  },
  methods: {
    Logout () {
      this.$store.dispatch('Logout')
      // this.$router.push('/login')
    },
    toastShow () {
      (this.$refs.passchword as any).getParent()
    }
  }
})
</script>
<style lang="scss">
.Person {
  display: flex;
  align-items: center;
  height: 16px;
  font-size: 14px;
  color:#000;
  cursor: pointer;
  .changMenu {
    width: 90px;
    height: 20px;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .icon_user {
    margin-right: 8px;
    font-size: 14px;
    color: #262626;
  }
  .ant-dropdown-link {
    display: flex;
    align-items: center;
    line-height: 16px;
    .icon_down {
      margin-left: 6px;
      font-size: 8px;
      transform: scale(0.66);
      color: #8C8C8C;
    }
  }
}
</style>
