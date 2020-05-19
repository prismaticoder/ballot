import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    election: "",
    token: localStorage.getItem('userToken') || '',
    user: ""
  },
  getters: {
    isLoggedIn: state => !!state.token,
    state: state => state.election
  },
  mutations: {
    CHANGE_ELECTION_STATE(state, newState) {
      state.election = newState;
    },
    USER_LOGIN(state, token, user) {
      state.token = token,
      state.user = user
    },
    USER_LOGOUT(state) {
      state.token = "",
      state.user = ""
    }
  },
  actions: {
    setState({commit}) {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.VUE_APP_URL}/checkappstate`)
        .then(res => {
          if (res.data.success) {
            commit('CHANGE_ELECTION_STATE', res.data.state)
            resolve("app state set");
          }
          else {
            reject(res.error)
          }
        })
        .catch(err => {
          reject(err)
        })
      })
      
    },
    logout({commit}) {
      return new Promise((resolve) => {
        commit('USER_LOGOUT')
        localStorage.removeItem('userToken')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    }
  },
  modules: {
  }
})
