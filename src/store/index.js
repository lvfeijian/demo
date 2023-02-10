import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: 'lfj',
    age: 10
  },
  getters: {
  },
  mutations: {
    incre(state, params) {
      console.log(state, params);
      state.age++
    },
    decre(state, params) {
      console.log(state, params);
      state.age--
    }
  },
  actions: {
  },
  modules: {
  }
})
