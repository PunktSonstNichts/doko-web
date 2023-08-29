<template>
  <div class="container">
    <h2>Single File</h2>
    <label>Datenbank
      <input type="file" @change="handleFileUpload( $event )"/>
    </label>
    <button v-on:click="submitFile()">Submit</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UploadDatabase",
  data(){
    return{
      file: null
    }
  },
  methods: {
    handleFileUpload( event ){
      this.file = event.target.files[0];
    },
    submitFile(){
      const formData = new FormData();
      formData.append('file', this.file);
      console.log(formData);
      axios.post( `${this.$hostname}/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
      )
    }
  }
}
</script>

<style scoped>

</style>