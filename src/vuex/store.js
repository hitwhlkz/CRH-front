import Vue from 'vue';
import Vuex from 'vuex';

import createPersistedState from "vuex-persistedstate";


Vue.use(Vuex);
// 登录验证
export default new Vuex.Store({
    state: {
      user: {},
      isLogin: false
    },
    mutations: {
        // 登录
        login(state, payload) {
          state.user = payload
        },
        // 退出
        logout(state, payload) {
        },
        islogin(state, payload) {
          state.isLogin = payload
        }
    },
    actions: {
       getLogin(state, payload) {
          commit(state, payload)
       }
    },
  plugins: [createPersistedState({ storage: window.sessionStorage })]

})
