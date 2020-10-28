
<template>
  <ConfigProvider :locale="locale">
    <Empty slot="renderEmpty" description="暂无数据" />
    <div id="app">
      <router-view />
    </div>
  </ConfigProvider>
</template>
<script>
import Vue from 'vue'
import { ConfigProvider, Empty } from 'ant-design-vue'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import Flexible from '@/utils/flexible'
export default Vue.extend({
  name: 'Main',
  components: {
    ConfigProvider,
    Empty
  },
  data() {
    return {
      locale: zhCN
    }
  },
  computed: {
    rootPage: function () {
      return this.$route.path === '/' || this.$route.meta.rootPage
    }
  },
  created () {
    new Flexible({
      onResize: (size) => {
        this.$nextTick(() => {
          this.$store.dispatch('SetFlexible', size)
        })
      }
    })
  }
})
</script>
<style lang="scss">
  @import "./assets/styles/_base.scss";
body {
  background-color: #f6f6f6 !important;
  overflow: hidden;
}
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: '微软雅黑', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
  .container_wrap {
    display: flex;
    flex-grow: 1;
    flex-shrink: 1;
    height: calc(100% - 64px);
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>