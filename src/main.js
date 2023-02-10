import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false

//大转盘抽奖组件
import LuckyCanvas from '@lucky-canvas/vue'
Vue.use(LuckyCanvas)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
