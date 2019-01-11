export const state = () => ({
  token: null
})

export const mutations = {
  setToken (state, token) {
    state.token = token
  }
}

export const actions = {
    setToken({commit}, token){
        commit("setToken", token);
    }
}