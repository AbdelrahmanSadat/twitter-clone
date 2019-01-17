export const state = () => ({
  token: null
})

export const mutations = {
  setToken(state, token) {
    state.token = token
  },
  deleteToken(state){
    state.token = null
  }
}

export const actions = {
    setToken({commit}, token){
        commit("setToken", token);
    },
    deleteToken({commit}, token){
      commit("deleteToken")
    }
}