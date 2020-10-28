<template>
  <div class="cache_tags">
    <Tabs :activeKey="$route.path">
      <TabPane v-for="tag in visitedViews" :key="tag.path">
        <router-link
          slot="tab"
          ref="tag"
          :class="isActive(tag)?'active':''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="span"
          class="tags_view_item"
          @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
          @contextmenu.prevent.native="openMenu(tag,$event)"
        >
          {{ tag.title }}
          <Icon v-if="!isAffix(tag)" type="close" class="close" @click.prevent.stop="closeSelectedTag(tag)" />
        </router-link>
      </TabPane>
    </Tabs>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新页面</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭当前</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Icon, Tabs } from 'ant-design-vue'
import { Watch, Component } from 'vue-property-decorator'
import { RawLocation, Route } from 'vue-router'
@Component({
  components: {
    Icon,
    Tabs,
    TabPane: Tabs.TabPane
  }
})
export default class CacheTags extends Vue {
  selectedTag: RawLocation = {}
  affixTags: Route[] = []
  visible = false
  top = 0
  left = 0
  
  get visitedViews() {
    return this.$store.state.cacheView.visitedViews
  }
  get routes() {
    return this.$store.state.permission.routes
  }
  
  @Watch('visible') onVisibleChange(value: boolean) {
    if (value) {
      document.body.addEventListener('click', this.closeMenu)
    } else {
      document.body.removeEventListener('click', this.closeMenu)
    }
  }

  mounted() {
    this.initTags()
  }
  
  isActive(route: Route) {
    return route.path === this.$route.path
  }
  isAffix(tag: Route) {
    return tag.meta && tag.meta.affix
  }
  // filterAffixTags(routes: RouteConfig[], basePath = '/') {
  //   let tags: Route[] = []
  //   routes.forEach(route => {
  //     if (route.meta && route.meta.affix) {
  //       const tagPath = path.resolve(basePath, route.path)
  //       tags.push({
  //         fullPath: tagPath,
  //         path: tagPath,
  //         name: route.name,
  //         meta: { ...route.meta }
  //       })
  //     }
  //     if (route.children) {
  //       const tempTags = this.filterAffixTags(route.children, route.path)
  //       if (tempTags.length >= 1) {
  //         tags = [...tags, ...tempTags]
  //       }
  //     }
  //   })
  //   return tags
  // }
  initTags() {
    const affixTags = this.affixTags
    for (const tag of affixTags) {
      // Must have tag name
      if (tag.name) {
        this.$store.dispatch('cacheView/addVisitedView', tag)
      }
    }
  }
  // moveToCurrentTag() {
  //   const tags = this.$refs.tag
  //   this.$nextTick(() => {
  //     for (const tag of tags) {
  //       if (tag.to.path === this.$route.path) {
  //         this.$refs.scrollPane.moveToTarget(tag)
  //         // when query is different then update
  //         if (tag.to.fullPath !== this.$route.fullPath) {
  //           this.$store.dispatch('cacheView/updateVisitedView', this.$route)
  //         }
  //         break
  //       }
  //     }
  //   })
  // }
  refreshSelectedTag(view: Route) {
    this.$store.dispatch('cacheView/delCachedView', view).then(() => {
      const { fullPath } = view
      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    })
  }
  closeSelectedTag(view: Route) {
    this.$store.dispatch('cacheView/delView', view).then(({ visitedViews }) => {
      if (this.isActive(view)) {
        this.toLastView(visitedViews, view)
      }
    })
  }
  closeOthersTags() {
    this.$router.push(this.selectedTag)
    this.$store.dispatch('cacheView/delOthersViews', this.selectedTag).then(() => {
      // this.moveToCurrentTag()
    })
  }
  closeAllTags(view: Route) {
    this.$store.dispatch('cacheView/delAllViews').then(({ visitedViews }) => {
      if (this.affixTags.some(tag => tag.path === view.path)) {
        return
      }
      this.toLastView(visitedViews, view)
    })
  }
  toLastView(visitedViews: RawLocation[], view: Route) {
    const latestView = visitedViews.slice(-1)[0]
    if (latestView) {
      this.$router.push(latestView)
    } else {
      // now the default is to redirect to the home page if there is no tags-view,
      // you can adjust it according to your needs.
      if (view.name === 'Dashboard') {
        // to reload home page
        this.$router.replace({ path: '/redirect' + view.fullPath })
      } else {
        this.$router.push('/')
      }
    }
  }
  openMenu(tag: RawLocation, e: any) {
    this.top = e.clientY
    this.left = e.clientX + 15
    this.visible = true
    this.selectedTag = tag
  }
  closeMenu() {
    this.visible = false
  }
}
</script>
<style lang="scss">
.cache_tags {
  display: flex;
  align-items: center;
  // padding: 0 12px;
  .tags_view_item {
    display: flex;
    align-items: center;
    margin: 2px 4px 4px;
    padding: 0 8px;
    border: 1px solid #d9d9d9;
    line-height: 20px;
    font-size: 12px;
    border-radius: 2px;
    white-space: nowrap;
    user-select: none;
    cursor: pointer;
    .close {
      margin-left: 2px;
      padding: 2px;
      font-size: 10px;
      line-height: 8px;
    }
    &.active {
      background-color: $themeColor;
      border: 1px solid $themeColor;
      color: #fff;
    }
  }
  .contextmenu {
    position: fixed;
    z-index: 3000;
    margin: 0;
    padding: 5px 0;
    background: #fff;
    list-style-type: none;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
  .ant-tabs-top-bar {
    margin: 0;
    border: none;
    .ant-tabs-tab {
      margin: 0;
      padding: 0;
      .anticon {
        margin-right: 0;
      }
    }
    .ant-tabs-ink-bar {
      display: none!important;
    }
  }
}
</style>
