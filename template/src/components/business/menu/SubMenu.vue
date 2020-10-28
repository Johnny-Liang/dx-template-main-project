
<template>
  <a-sub-menu :key="index" v-bind="$props" v-on="$listeners">
    <span slot="title">
      <span>{{ menuInfo.meta.label }}</span>
    </span>
    <template v-for="item in menuInfo.children">
      <template v-if="!item.children">
        <a-menu-item :key="item.path" v-if="!item.meta.hidden">
          <span>{{ item.meta.label }}</span>
        </a-menu-item>
      </template>
      <sub-menu v-else :key="item.path" :menu-info="item"/>
    </template>
  </a-sub-menu>
</template>
<script>
import { Menu } from 'ant-design-vue';
export default {
  name: 'SubMenu',
  components: {
    'a-sub-menu': Menu.SubMenu,
    'a-menu-item': Menu.Item
  },
  // must add isSubMenu: true
  isSubMenu: true,
  props: {
    ...Menu.SubMenu.props,
    // Cannot overlap with properties within Menu.SubMenu.props
    menuInfo: {
      type: Object,
      default: () => ({}),
    }
  },
};
</script>