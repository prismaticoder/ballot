import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    election: "",
    token: localStorage.getItem('userToken') || '',
    user: localStorage.getItem('username') || ""
  },
  getters: {
    isLoggedIn: state => !!state.token,
    state: state => state.election
  },
  mutations: {
    CHANGE_ELECTION_STATE(state, newState) {
      state.election = newState;
    },
    USER_LOGIN(state, data) {
      state.token = data.token,
      state.user = data.username
    },
    USER_LOGOUT(state) {
      state.token = "",
      state.user = ""
    }
  },
  actions: {
    setState({commit}) {
      return new Promise((resolve, reject) => {
        axios.get(`checkappstate`)
        .then(res => {
            commit('CHANGE_ELECTION_STATE', res.data.state)
            resolve(res.data.state);
        })
        .catch(err => {
          reject(err)
        })
      })
      
    },
    logout({commit}) {
      return new Promise((resolve) => {
        localStorage.removeItem('userToken')
        localStorage.removeItem('username')
        delete axios.defaults.headers.common['Authorization']
        commit('USER_LOGOUT')
        resolve()
      })
    },
    loginUser({commit}, data) {
      return new Promise((resolve) => {
        localStorage.setItem('userToken', data.token)
        localStorage.setItem('username', data.username)
        commit('USER_LOGIN', data)
        resolve()
      })
    }
  },
  modules: {
  }
})
