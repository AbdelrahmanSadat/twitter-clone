<template>
  <section class="container">
    <div>
        Verification
        <form v-on:submit.prevent="onSubmit" method="POST">
          <label>
            Verification Code
            <input type="number" name="verificationCode">
          </label>
          <br>
          <button>Verify</button>
        </form> 
    </div>
  </section>
</template>

<script>
export default {
  methods:{
    onSubmit(e){
      // TODO: send request to backend server
      console.log("Submitted")
    }
  }
}
</script>

<style scoped>
/* TODO: remove this and add some styling */
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>

