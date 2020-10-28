<template>
  <div class="LeftMenu" :class="{'hide': this.hide}">
    <Menu
      class="menu"
      :selectedKeys="nowPath"
      :openKeys="openKeys"
      @openChange="openChange"
      mode="inline"
      theme="dark"
      @click="menuHandle">
      <template v-for="item in menu.systemRoutes[menu.active[1]].children">
        <Menu-item v-if="!item.children" :key="item.path">
            <span>{{item.meta.label}}</span>
          </Menu-item>
        <sub-menu v-else :menu-info="item" :key="item.path" />
      </template>
    </Menu>
    <a v-if="menu.systemRoutes[menu.active[1]].meta.manual" class="help" :href="menu.systemRoutes[menu.active[1]].meta.manual" target="_blank">用户手册</a>
  </div>
</template>

<script>
  import { Menu } from 'ant-design-vue'
  import SubMenu from './SubMenu';
  import { mapState } from 'vuex';
  export default {
    name: 'Leftmenu',
    components: {
      SubMenu,
      Menu,
      'Menu-item': Menu.Item
    },
    props: {
      hide: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        nowPath: [],
        openKeys: []
      }
    },
    watch: {
      '$route': {
        handler: function (n) {
          this.onHashChanged()
        },
        deep: true
      }
    },
    computed: {
      ...mapState({
        menu: state => state.app.menu
      })
    },
    created () {
      this.onHashChanged()
    },
    methods: {
      menuHandle (item) {
        this.$router.push(item.key)
      },
      defaultMenuOpt () { // 监听hash变化
        this.nowPath = this.$route.meta.activePath ? [this.$route.meta.activePath] : location.hash.match(/\/[^(\?)]*/g)
        let pathArr =  location.hash.match(/\/\w+/g)
        let openKeys = []
        pathArr.forEach(item => {
          let prefix = ''
          if (openKeys.length > 0) {
            prefix = openKeys[openKeys.length - 1]
          }
          openKeys.push(prefix + item)
        })
        this.openKeys = openKeys
      },
      onHashChanged () { // 保持menu焦点根据打开的页面选中及模块
        /*eslint no-useless-escape: 0*/
        this.defaultMenuOpt()
        const moduleName = location.hash.match(/\/[^(\/)]*/g)[1].substring(1)
        if (moduleName) {
          // this.$store.dispatch('SetMenuActived', moduleName)
        }
      },
      openChange (opentKeys) {
        this.openKeys = opentKeys
      }
    }
  };
</script>
<style lang="scss" scoped>
.LeftMenu.hide {
  width: 0;
}
.LeftMenu {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: $menuWidth;
  background: #001C40;
  transition: width 300ms;
  overflow: auto;
  .menu {
    flex-grow: 1;
    padding-top: 30px;
    .ant-menu-item,
    .ant-menu-submenu {
      text-align: left;
    }
  }
  .help {
    padding: 10px;
    color: #fff;
    cursor: pointer;
    opacity: 0.65;
    font-size: 14px;
    &:hover {
      opacity: 1;
    }
  }
}
</style>