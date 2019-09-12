<template>
  <div id="app">
    <ul>
      <li v-for="file in files" :key="file">{{ file.name }} - Error: {{ file.error }}, Success: {{ file.success }}</li>
    </ul>
    <file-upload
      ref="upload"
      v-model="files"
      post-action="/post.method"
      put-action="/put.method"
      @input-file="inputFile"
      @input-filter="inputFilter"
    >
      Upload file
    </file-upload>
    <button v-show="!$refs.upload || !$refs.upload.active" type="button" @click.prevent="$refs.upload.active = true">Start upload</button>
    <button v-show="$refs.upload && $refs.upload.active" type="button" @click.prevent="$refs.upload.active = false">Stop upload</button>
  </div>
</template>

<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vue-upload-component"></script>
<script>
Vue.component('file-upload', VueUploadComponent)
</script>

<script>
new Vue({
  el: '#app',
  data: function () {
    return {
      files: []
    }
  },
  components: {
    FileUpload: VueUploadComponent
  },
  methods: {
    /**
     * Has changed
     * @param  Object|undefined   newFile   Read only
     * @param  Object|undefined   oldFile   Read only
     * @return undefined
     */
    inputFile: function (newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // Get response data
        console.log('response', newFile.response)
        if (newFile.xhr) {
          //  Get the response status code
          console.log('status', newFile.xhr.status)
        }
      }
    },
    /**
     * Pretreatment
     * @param  Object|undefined   newFile   Read and write
     * @param  Object|undefined   oldFile   Read only
     * @param  Function           prevent   Prevent changing
     * @return undefined
     */
    inputFilter: function (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Filter non-image file
        if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
          return prevent()
        }
      }

      // Create a blob field
      newFile.blob = ''
      let URL = window.URL || window.webkitURL
      if (URL && URL.createObjectURL) {
        newFile.blob = URL.createObjectURL(newFile.file)
      }
    }
  }
});
</script>
