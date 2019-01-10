<template>
  <section class="container">
    <div>
        Registeration
        <form v-on:submit.prevent="onSubmit" method="POST">
          <label>
            Email
            <input type="email" name="email" placeholder="example@example.com" >
          </label>
          <br>
          <label>
            Password
            <input type="password" name="password" placeholder="Eight or more characters">
          </label>
          <br>
          <label for="password re-entry">
            Re-enter Password
            <input type="password" name="password re-entry" placeholder="Please re-enter your password">
          </label>
          <br>
          <button>Register</button>
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

