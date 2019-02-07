<template>
  <section>
  </section>
</template>

<script>
// TODO: add some error handling
export default {
  async mounted(){
    await this.$store.dispatch("deleteToken");
    await this.$apolloClient.resetStore();
    this.$router.push("/");
  }
}
</script>

