<template>
  <div class="home">
    <header>
      <h1>东海钢铁集团</h1>
      <Person />
    </header>
    <main>
      <h2>智慧钢铁管理平台</h2>
      <div class="Onionparody"></div>
      <div class="YouShangTu"></div>
      <div class="Thefigurebelow"></div>
      <div class="TheportalDe">
        <div class="TheportalList">
          <section v-for="(item, i) in menu" :key="i">
            <div class="Thefirstfigure">
              <IconFont class="icon" theme="multi" :type="item.meta.icon" />
            </div>
            <h3>{{item.meta.label}}</h3>
            <ul class="optionsList" :class="{two_col: item.children.length > 5}">
              <li v-for="(cItem, cI) in item.children" :key="`${i}-${cI}`" :class="{disabled: cItem.meta.disabled}" @click="routeHandle(cItem)">
                <Tooltip v-if="cItem.meta.disabled" class="tooltip" placement="right" :mouseEnterDelay="0.5">
                  <template slot="title">
                    <span>努力开发中...</span>
                  </template>
                </Tooltip>
                <i v-if="cItem.meta.icon" :class="`font_family icon-${cItem.meta.icon}`"/>
                {{cItem.meta.label}}
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Person from '@/components/business/Person.vue'
import IconFont from '@/components/IconFont.vue'
import { Tooltip } from 'ant-design-vue'
import { mapState } from 'vuex'
export default Vue.extend({
  name: 'home',
  components: {
    Person,
    Tooltip,
    IconFont
  },
  computed: {
    ...mapState({
      menu: (state: any) => state.permission.addRoutes
    })
  },
  methods: {
    routeHandle (curRoute: {path: string, meta: {disabled: boolean}, children: any[]}): void {
      if (curRoute.meta.disabled) return
      const route = this.getLastChild(curRoute)
      this.$router.push(route.path)
    },
    getLastChild(route: {path: string, children: any[]}): any {
      if (route.children && route.children[0]) {
        return this.getLastChild(route.children[0])
      } else {
        return route
      }
    }
  }
})
</script>
<style lang="scss">
.home {
  height: 100%;
  background: rgba(230, 237, 245, 1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    padding: 0 20px 0 19px;
    height: 64px;
    h1 {
      width: 179px;
      height: 33px;
      text-indent: -9999px;
      background: url("~@/assets/images/logo.svg");
      margin-bottom: 0;
    }
  }
  main {
    padding: 10px 0 50px;
    flex: 1;
    h2 {
      height: 67px;
      font-size: 48px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 550;
      color: rgba(4, 8, 28, 1);
      line-height: 67px;
      text-align: center;
      margin: 0;
      margin-bottom: 56px;
    }
   
    .Onionparody {
      width: 235px;
      height: 235px;
      background: url("~@/assets/images/Onionparody.svg");
      background-size: 235px 235px;
      position: absolute;
      top: 90px;
    }
    .YouShangTu {
      width: 143px;
      height: 265px;
      background: url("~@/assets/images/YouShangTu.svg");
      position: absolute;
      right: 0px;
    }
    .Thefigurebelow {
      width: 662px;
      height: 168px;
      background: url("~@/assets/images/Thefigurebelow.svg");
      position: absolute;
      bottom: 21px;
      right: 199px;
    }
    .TheportalDe {
      display: flex;
      justify-content: center;
    }
    .TheportalList {
      width: 1248px;
      height: 500px;
      text-align: center;
      display: flex;
      justify-content: center;
    }
    section {
      width: 376px;
      height: 500px;
      background: #fff;
      margin-right: 40px;
      padding-top: 22px;
      box-sizing: border-box;
      z-index: 10;
      &:last-child {
        margin-right: 0;
      }
      .Thefirstfigure {
        width: 80px;
        height: 80px;
        margin: auto;
        .icon {
          font-size: 80px;
        }
      }
      h3 {
        height: 42px;
        font-size: 30px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 550;
        color: rgba(4, 8, 28, 1);
        line-height: 42px;
        margin: auto;
        margin-top: 13px;
        margin-bottom: 40px;
      }
      ul {
        li {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 160px;
          height: 40px;
          background: rgba(230, 237, 245, 1);
          border-radius: 2px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #000;
          line-height: 40px;
          margin-bottom: 16px;
          cursor: pointer;
          &:not(.disabled):hover {
            background-color: $themeColor;
            color: #fff;
            .font_family {
              color: #fff;
            }
          }
          &.disabled {
            color: #999;
            cursor: not-allowed;
            .font_family {
              color: #999;
            }
            .tooltip {
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
            }
          }
          .font_family {
            font-size: 24px;
            color: $themeColor;
          }
        }
      
      }
      .optionsList {
        width: 160px;
        margin: auto;
        &.two_col {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          width: 338px;
        }
      }
    }
  }
}
</style>