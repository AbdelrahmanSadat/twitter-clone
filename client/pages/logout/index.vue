<template>
  <section>
  </section>
</template>

<script>
// TODO: add some error handling
export default {
  async mounted(){
      await this.$store.dispatch("deleteToken");
      this.$router.push("/", ()=>this.$router.go(0));
  }
}
</script>

