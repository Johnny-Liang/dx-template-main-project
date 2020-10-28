<template>
	<a-locale-provider :locale="locale">
    <div class="layout">
      <TopMenu :hide="fullScreen" />
      <div class="container_wrap">
        <LeftMenu :hide="fullScreen" />
        <div class="layout_content_wrap">
          <CacheTags :class="{'no_cache': noCache}" class="cache_tags" />
          <div class="router_view_wrap" :class="{'no_cache': noCache}">
            <keep-alive><router-view/></keep-alive>
          </div>
        </div>
      </div>
    </div>
	</a-locale-provider>
</template>
<script>
import Vue from 'vue'
import LeftMenu from '@/components/business/menu/LeftMenu.vue'
import TopMenu from '@/components/business/menu/TopMenu.vue'
import CacheTags from '@/components/CacheTags.vue'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { LocaleProvider } from 'ant-design-vue'
import { mapState } from 'vuex'
export default Vue.extend({
	data(){
		return {
      locale: zhCN
		}
	},
	components: {
		ALocaleProvider:LocaleProvider,
    LeftMenu,
    TopMenu,
    CacheTags
	},
  computed: {
    noCache() {
      return this.$store.state.cacheView.noCache
    },
    ...mapState({
      fullScreen: (state) => state.app.fullScreen
    })
  }
})
</script>
<style lang="scss" scoped>
$cacheTagH: 34px;
.layout {
  height: 100%;
  .container_wrap {
    overflow: hidden;
    .layout_content_wrap {
      flex-grow: 1;
      width: calc(100% - 465px);
      .cache_tags {
        position: relative;
        z-index: 10;
        height: $cacheTagH;
        background-color: #fff;
        border-top: 1px solid #d9d9d9;
        box-shadow: 0 1px 5px 0 #ccc;
        &.no_cache {
          height: 0;
          overflow: hidden;
        }
      }
      .router_view_wrap {
        height: calc(100% - #{$cacheTagH});
        overflow: hidden;
        &.no_cache {
          height: 100%;
        }
      }
    }
  }
}
</style>