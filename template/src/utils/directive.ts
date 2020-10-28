import Vue from 'vue'
import store from '@/store/index'
import moment from 'moment'

Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})

Vue.directive('select', {
  inserted: function (el) {
    // setTimeout是为了支持mousedown等类似事件触组件初始化时能选中
    setTimeout(() => {
      (el as any).select()
    }, 0)
  }
})

Vue.directive('perm-btn', {
  inserted(el, binding) {
    if (!permissionJudge(binding.value) && el.parentNode) {
      el.parentNode.removeChild(el);
    }
    function permissionJudge(value: string) {
      // 此处store.getters.getMenuBtnList代表vuex中储存的按钮菜单数据
      let list = store.getters.perm_btn
      for (let item of list) {
        if (item === value) {
          return true
        }
      }
      return false
    }
  }
})

// 暗夜模式
let timer: any
const darkNight = function (el: Element) {
  console.log(moment().format('HH'))
  if (parseInt(moment().format('HH')) >= 18 || parseInt(moment().format('HH')) < 7) { // 暗夜时间内
    console.log('开启暗夜模式')
    el.classList.add('DARK_NIGHT_H')
    const endDate = parseInt(moment().format('HH')) < 7 ? moment().format('YYYY-MM-DD') + ' 07:00:00' : moment().add(1, 'd').format('YYYY-MM-DD') + ' 07:00:00'
    const timeout = (moment(endDate).valueOf() - moment().valueOf()) * 0.7
    console.log(`${moment().format('HH:mm:ss')}：${timeout / 1000}s后校准时间`)
    timer = setTimeout(() => {
      darkNight(el)
    }, timeout) // 时间校准
  } else { // 暗夜时间外
    console.log('关闭暗夜模式')
    el.classList.remove('DARK_NIGHT_H')
    const startDate = moment().format('YYYY-MM-DD') + ' 18:00:00'
    const timeout = (moment(startDate).valueOf() - moment().valueOf()) * 0.7
    console.log(`${moment().format('HH:mm:ss')}：${timeout / 1000}s后校准时间`)
    timer = setTimeout(() => {
      darkNight(el)
    }, timeout) // 时间校准
  }
}

Vue.directive('dark-night', {
  inserted: function (el) {
    el.classList.add('DARK_NIGHT')
    darkNight(el)
  },
  unbind: function() {
    console.log('取消绑定')
    clearTimeout(timer)
  }
})