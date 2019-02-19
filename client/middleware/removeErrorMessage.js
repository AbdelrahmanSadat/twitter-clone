export default function ({store}) {
    if(store.state.error)
        store.dispatch("deleteError");
  }