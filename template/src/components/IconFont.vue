<template>
  <svg v-if="theme === 'multi'" class="IconFont multi icon" aria-hidden="true">
    <use :xlink:href="`#icon-${type}`"></use>
  </svg>
  <i v-else :class="`IconFont single font_family icon-${type}`"></i>
</template>
<script lang="ts">
import Vue from 'vue'
import '@/assets/iconfont/iconfont'
import { Prop, Component } from 'vue-property-decorator'
@Component
export default class IconFont extends Vue {
  @Prop({
    type: String,
    default: ''
  }) type !: string
  @Prop({
    type: String,
    default: '' // multi
  }) theme !: string
}
</script>
<style lang="scss" scoped>
.IconFont {
  &.multi {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
}
</style>