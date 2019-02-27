<template>
  <section>
  </section>
</template>

<script>
// TODO: add some error handling
export default {
  async mounted(){
    await this.$store.dispatch("deleteToken");
    if(this.$store.state.testUnsubscription)
      await this.$store.state.testUnsubscription()
    await this.$apolloClient.resetStore();
    this.$router.push("/");
  }
}
</script>

