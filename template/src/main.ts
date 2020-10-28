import Vue from 'vue'
import Main from './Main.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import router from './router'
import './router/permission' // permission control
import store from './store'
import DhgtUi from 'dhgt-ui'
import 'dhgt-ui/lib/dhgt-ui.css'
import 'ant-design-vue/dist/antd.less'
import axios from './utils/axios'
// process.env.NODE_ENV === 'development' && require('../mock/mock')
import './utils/directive'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
Vue.config.productionTip = false


Vue.prototype.$fetch = axios
Vue.prototype.moment = moment

Vue.use(Antd)
Vue.use(DhgtUi)

// import '../module_cache/modules.import'
export default new Vue({
  router,
  store,
  render: h => h(Main)
}).$mount('#app')
