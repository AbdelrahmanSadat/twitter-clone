<template>
    <section class="container">
      <div>
          <h1>Tweet</h1>
          <br>
          <form v-on:submit.prevent="onSubmit" method="POST" enctype="multipart/form-data">
          <label>
            Text
            <input v-model="text" type="text" name="text">
          </label>
          <br>
          <label>
            Image
            <input type="file" id="file" ref="file" name="file" v-on:change="onFileChange">
          </label>
          <br>
          <button>Tweet</button>
        </form> 
      </div>
    </section>
</template>

<script>
import gql from "graphql-tag";
import axios from "axios";
import apolloClient from '~/plugins/apolloClient.js'

// TODO: add some error handling
export default {
  data(){
    return{
      text:"",
      file: ""
    }
  },
  methods:{
    async onSubmit(store){
        const imageName = await this.uploadFile();
        const mutation = gql`
            mutation tweet($text: String, $image: String){
                tweet(text: $text, image: $image){
                    text,
                    image,
                    author{
                        id,
                        email
                    }
                }
            }
        `
        const res = await apolloClient.mutate({
            mutation,
            variables: { text: this.text, image:imageName}
        })
        console.log("Submitted")
        this.$router.push("timeline");
    },
    onFileChange(){
        this.file = this.$refs.file.files[0];
    },
    async uploadFile(){
        console.log("uploading");
        this.file = await this.$refs.file.files[0];
        let formData = new FormData();
        formData.append('image', this.file);
        const res = await axios.post(process.env.API_BASE_URL+"/upload",
            formData,
            {
                headers: {
                    'Content-type': 'multipart/form-data'
                }
            }
        );
        return res.data.filename;
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
