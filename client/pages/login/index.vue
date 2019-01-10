<template>
  <section class="container">
    <div>
        Login
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
          <button>Login</button>
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

