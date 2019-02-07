<template>
    <section class="container">
      <div>
        <h1>Tweet</h1>
        <br/>
        <form v-on:submit.prevent="onSubmit" method="POST" enctype="multipart/form-data">
          <label>
            Text
            <input v-model="text" type="text" name="text">
          </label>
          <br/>
          <br/>
          <Dropzone 
            v-on:vdropzone-file-added="onFileAdd" 
            id="file" 
            name="file" 
            ref="dropzone" 
            :options="dropzoneOptions" 
            :destroyDropzone="true"
            v-on:vdropzone-success="onUploadSuccess"
          >
          </Dropzone>
          <br/>
          <button>Tweet</button>
        </form> 
      </div>
    </section>
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'
import mutations from "@/gql/mutations";
import mutate from "@/helpers/mutate";
import queries from "@/gql/queries";

// TODO: add some error handling
export default {
  components: {
    Dropzone
  },
  data(){
    return{
      text:"",
      filename: null,
      dropzoneOptions: {
        url: process.env.API_BASE_URL+"/upload",
        maxFileSize: 1024*1024, //10MB?
        paramName: "image",
        maxFiles: 1,
        acceptedFiles: ".png,.jpg,.jpeg,.gif",
        autoProcessQueue: false, // !!!!!!!!!!!!!!!!!!!!!
        autoQueue: true,
        addRemoveLinks: true // ????????

        // resizing and changing quality
        // fallback
        // dictFallbackMessage/dictFallbackText
        // forceFallback?
        // capture
        // hiddenInputContainer?
        // withCredentials?
      }
    }
  },
  methods:{
    async onSubmit(store){
      const dropzone = this.$refs.dropzone
      // console.log(dropzone.getQueuedFiles())
      // console.log(dropzone.getAddedFiles())
      // console.log(dropzone.getAcceptedFiles())
      
      // if a file has been added:
      if(dropzone.getQueuedFiles().length > 0)
        await dropzone.processQueue();
      else{
        this.sendMutation()
      }
    },
    onFileAdd(file){
      console.log("file added")
      console.log(file)
    },
    async onUploadSuccess(file, response){
      console.log("file uploaded")
      console.log(file)
      this.filename = response.filename
      this.sendMutation()
    },
    async sendMutation(){
      const variables = { text: this.text, image:this.filename}
      const refetchQueries = [{query: queries.timeline}, {query: queries.currentUserProfile}]
      const awaitRefetchQueries = true
      const options = {mutation: mutations.tweet, variables, refetchQueries, awaitRefetchQueries}
      const res = await mutate(this.$apolloClient, options)
      .catch((err)=>{ this.$store.dispatch("setError", err.message) } )
      if(res) this.$router.push("timeline");
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
