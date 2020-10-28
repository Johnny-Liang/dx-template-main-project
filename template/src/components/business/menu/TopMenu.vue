<template>
  <header class="TopMenu" :class="{'hide': this.hide}">
    <div class="logo_wrap" @click="toHome">
      <img class="logo" src="~@/assets/images/logo.png"/>
      <p>{{menu.systemName}}</p>
    </div>
    <div class="modules_wrap">
      <div v-for="(item, index) in menu.systemRoutes" :key="index" class="module" :class="{'active': index === menu.active[1]}" @click="moduleHandle(item, index)">
        <i :class="`font_family icon-${item.meta.icon}`"></i>
        {{item.meta.label}}
      </div>
    </div>
    <div class="tool_wrap">
      <Person />
    </div>
  </header>
</template>
<script lang="ts">
import Vue from 'vue'
import Person from '@/components/business/Person.vue'
import { mapState } from 'vuex'
export default Vue.extend({
  name: 'TopMenu',
  components: {
    Person
  },
  props: {
    hide: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      menu: (state: any) => state.app.menu
    })
  },
  methods: {
    moduleHandle (item: {path: string}, name: string) {
      this.$router.push(item.path)
    },
    toHome () {
      this.$router.push('/')
    }
  }
})
</script>
<style lang="scss" scoped>
$menuHeight: 64px;
.TopMenu.hide {
  height: 0;
}
.TopMenu {
  position: relative;
  z-index: 1;
  display: flex;
  flex-shrink: 0;
  width: 100%;
  height: $menuHeight;
  background: #fff;
  transition: height 300ms;
  overflow: hidden;
  .logo_wrap {
    display: flex;
    align-items: center;
    padding: 0 20px;
    width: $menuWidth;
    height: 100%;
    cursor: pointer;
    .logo {
      width: 38px;
    }
    p {
      margin-left: 9px;
      color: #04081C;
      font-size: 24px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .modules_wrap {
    display: flex;
    flex-grow: 1;
    padding-left: 16px;
    .module {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 4px;
      width: 72px;
      height: $menuHeight;
      color: #9FA6AD;
      font-size: 12px;
      cursor: pointer;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover,
      &.active {
        color: $themeColor;
        .font_family {
          color: $themeColor;
        }
      }
      .font_family {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 38px;
        font-size: 40px;
        color: #AFB5BA;
        font-weight: normal;
      }
    }
  }
  .tool_wrap {
    display: flex;
    align-items: center;
    padding-right: 20px;
  }
}
</style>