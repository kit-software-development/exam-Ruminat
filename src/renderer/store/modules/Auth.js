import Store from 'electron-store'

const store = new Store()

const state = {
  window: {
    opened: false,
    mode: 'login'
  },
  username: store.get('username') || ''
}

const mutations = {
  OPEN_WINDOW (state) {
    state.window.opened = true
  },
  CLOSE_WINDOW (state) {
    state.window.opened = false
  },
  REGISTER_MODE (state) {
    state.window.mode = 'register'
  },
  LOGIN_MODE (state) {
    state.window.mode = 'login'
  },
  CHOOSE_USER (state, username) {
    state.username = username
    store.set('username', username)
  },
  LOGOUT (state) {
    state.username = ''
    store.set('username', '')
  }
}

const actions = {
  open ({ commit }) {
    commit('OPEN_WINDOW')
  },
  close ({ commit }) {
    commit('CLOSE_WINDOW')
  },
  registerMode ({ commit }) {
    commit('REGISTER_MODE')
  },
  loginMode ({ commit }) {
    commit('LOGIN_MODE')
  }
}

const getters = {
  win () { return state.window }
}

export default {
  state,
  mutations,
  actions,
  getters
}
