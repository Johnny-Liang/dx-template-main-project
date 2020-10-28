<template>
  <keep-alive :include="cachedNames"><router-view/></keep-alive>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
@Component({
  name: 'RouterViewer'
})
export default class RouterViewr extends Vue {
  get cachedNames() {
    return [...this.$store.state.cacheView.cachedNames, 'RouterViewer']
  }
}
</script>