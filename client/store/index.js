export const state = () => ({
  token: null,
  error: null,
  testUnsubscription: null
})

export const mutations = {
  setToken(state, token) {
    state.token = token
  },
  deleteToken(state){
    state.token = null
  },
  setError(state, error) {
    state.error = error
  },
  deleteError(state){
    state.error = null
  },
  setTestUnsubscription(state, unsubscriber){
    state.testUnsubscription = unsubscriber
  }
}

export const actions = {
  setToken({commit}, token){
      commit("setToken", token);
  },
  deleteToken({commit}, token){
    commit("deleteToken")
  },
  setError({commit}, error){
      commit("setError", error);
  },
  deleteError({commit}, error){
    commit("deleteError")
  },
  setTestUnsubscription({commit}, unsubscriber){
    commit("setTestUnsubscription", unsubscriber)
  }
}