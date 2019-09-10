<template>
  <div class="example-full">
    <button type="button" class="btn btn-danger float-right btn-is-option" @click.prevent="isOption = !isOption">
      <i class="fa fa-cog" aria-hidden="true" />
      Options
    </button>
    <h1 id="example-title" class="example-title">Data Uploader</h1>

    <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
      <h3>Drop files to upload</h3>
    </div>
    <div v-show="!isOption" class="upload">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Thumb</th>
              <th>Name</th>
              <th>Size</th>
              <th>Speed</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!files.length">
              <td colspan="7">
                <div class="text-center p-5">
                  <h4>Drop files anywhere to upload<br>or</h4>
                  <label :for="name" class="btn btn-lg btn-primary">Select Files</label>
                </div>
              </td>
            </tr>
            <tr v-for="(file, index) in files" :key="file.id">
              <td>{{ index }}</td>
              <td>
                <img v-if="file.thumb" :src="file.thumb" width="40" height="auto">
                <span v-else>No Image</span>
              </td>
              <td>
                <div class="filename">
                  {{ file.name }}
                </div>
                <div v-if="file.active || file.progress !== '0.00'" class="progress">
                  <div :class="{'progress-bar': true, 'progress-bar-striped': true, 'bg-danger': file.error, 'progress-bar-animated': file.active}" role="progressbar" :style="{width: file.progress + '%'}">{{ file.progress }}%</div>
                </div>
              </td>
              <td>{{ file.size | formatSize }}</td>
              <td>{{ file.speed | formatSize }}</td>

              <td v-if="file.error">{{ file.error }}</td>
              <td v-else-if="file.success">success</td>
              <td v-else-if="file.active">active</td>
              <td v-else />
              <td>
                <div class="btn-group">
                  <button class="btn btn-secondary btn-sm dropdown-toggle" type="button">
                    Action
                  </button>
                  <div class="dropdown-menu">
                    <a :class="{'dropdown-item': true, disabled: file.active || file.success || file.error === 'compressing'}" href="#" @click.prevent="file.active || file.success || file.error === 'compressing' ? false : onEditFileShow(file)">Edit</a>
                    <a :class="{'dropdown-item': true, disabled: !file.active}" href="#" @click.prevent="file.active ? $refs.upload.update(file, {error: 'cancel'}) : false">Cancel</a>

                    <a v-if="file.active" class="dropdown-item" href="#" @click.prevent="$refs.upload.update(file, {active: false})">Abort</a>
                    <a v-else-if="file.error && file.error !== 'compressing' && $refs.upload.features.html5" class="dropdown-item" href="#" @click.prevent="$refs.upload.update(file, {active: true, error: '', progress: '0.00'})">Retry upload</a>
                    <a v-else :class="{'dropdown-item': true, disabled: file.success || file.error === 'compressing'}" href="#" @click.prevent="file.success || file.error === 'compressing' ? false : $refs.upload.update(file, {active: true})">Upload</a>

                    <div class="dropdown-divider" />
                    <a class="dropdown-item" href="#" @click.prevent="$refs.upload.remove(file)">Remove</a>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="example-foorer">
        <div class="footer-status float-right">
          Drop: {{ $refs.upload ? $refs.upload.drop : false }},
          Active: {{ $refs.upload ? $refs.upload.active : false }},
          Uploaded: {{ $refs.upload ? $refs.upload.uploaded : true }},
          Drop active: {{ $refs.upload ? $refs.upload.dropActive : false }}
        </div>
        <div class="btn-group">
          <file-upload
            class="btn btn-primary dropdown-toggle"
            :post-action="postAction"
            :put-action="putAction"
            :extensions="extensions"
            :accept="accept"
            v-model="files"
            :multiple="multiple"
            :directory="directory"
            ref="upload"
            :size="size || 0"
            :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)"
            :headers="headers"
            :data="data"
            :drop="drop"
            :drop-directory="dropDirectory"
            :add-index="addIndex"
            @input-filter="inputFilter"
            @input-file="inputFile"
          >
            <i class="fa fa-plus" />
            Select
          </file-upload>
          <div class="dropdown-menu">
            <label class="dropdown-item" :for="name">Add files</label>
            <a class="dropdown-item" href="#" @click="onAddFolader">Add folder</a>
            <a class="dropdown-item" href="#" @click.prevent="addData.show = true">Add data</a>
          </div>
        </div>
        <button v-if="!$refs.upload || !$refs.upload.active" type="button" class="btn btn-success" @click.prevent="$refs.upload.active = true">
          <i class="fa fa-arrow-up" aria-hidden="true" />
          Start Upload
        </button>
        <button v-if="!$refs.upload || !$refs.upload.active" type="button" class="btn btn-warning" @click.prevent="onSendAnalyzeRequest">
          Analyze
        </button>
        <button v-else type="button" class="btn btn-danger" @click.prevent="$refs.upload.active = false">
          <i class="fa fa-stop" aria-hidden="true" />
          Stop Upload
        </button>
      </div>
    </div>

    <div v-show="isOption" class="option">
      <div class="form-group">
        <label for="accept">Accept:</label>
        <input id="accept" v-model="accept" type="text" class="form-control">
        <small class="form-text text-muted">Allow upload mime type</small>
      </div>
      <div class="form-group">
        <label for="extensions">Extensions:</label>
        <input id="extensions" v-model="extensions" type="text" class="form-control">
        <small class="form-text text-muted">Allow upload file extension</small>
      </div>
      <div class="form-group">
        <label>PUT Upload:</label>
        <div class="form-check">
          <label class="form-check-label">
            <input id="put-action" v-model="putAction" class="form-check-input" type="radio" name="put-action" value=""> Off
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input id="put-action" v-model="putAction" class="form-check-input" type="radio" name="put-action" value="/upload/put"> On
          </label>
        </div>
        <small class="form-text text-muted">After the shutdown, use the POST method to upload</small>
      </div>
      <div class="form-group">
        <label for="thread">Thread:</label>
        <input id="thread" v-model.number="thread" type="number" max="5" min="1" class="form-control">
        <small class="form-text text-muted">Also upload the number of files at the same time (number of threads)</small>
      </div>
      <div class="form-group">
        <label for="size">Max size:</label>
        <input id="size" v-model.number="size" type="number" min="0" class="form-control">
      </div>
      <div class="form-group">
        <label for="minSize">Min size:</label>
        <input id="minSize" v-model.number="minSize" type="number" min="0" class="form-control">
      </div>
      <div class="form-group">
        <label for="autoCompress">Automatically compress:</label>
        <input id="autoCompress" v-model.number="autoCompress" type="number" min="0" class="form-control">
        <small v-if="autoCompress > 0" class="form-text text-muted">More than {{ autoCompress | formatSize }} files are automatically compressed</small>
        <small v-else class="form-text text-muted">Set up automatic compression</small>
      </div>

      <div class="form-group">
        <div class="form-check">
          <label class="form-check-label">
            <input id="add-index" v-model="addIndex" type="checkbox" class="form-check-input"> Start position to add
          </label>
        </div>
        <small class="form-text text-muted">Add a file list to start the location to add</small>
      </div>

      <div class="form-group">
        <div class="form-check">
          <label class="form-check-label">
            <input id="drop" v-model="drop" type="checkbox" class="form-check-input"> Drop
          </label>
        </div>
        <small class="form-text text-muted">Drag and drop upload</small>
      </div>
      <div class="form-group">
        <div class="form-check">
          <label class="form-check-label">
            <input id="drop-directory" v-model="dropDirectory" type="checkbox" class="form-check-input"> Drop directory
          </label>
        </div>
        <small class="form-text text-muted">Not checked, filter the dragged folder</small>
      </div>
      <div class="form-group">
        <div class="form-check">
          <label class="form-check-label">
            <input id="upload-auto" v-model="uploadAuto" type="checkbox" class="form-check-input"> Auto start
          </label>
        </div>
        <small class="form-text text-muted">Automatically activate upload</small>
      </div>
      <div class="form-group">
        <button type="button" class="btn btn-primary btn-lg btn-block" @click.prevent="isOption = !isOption">Confirm</button>
      </div>
    </div>

    <div :class="{'modal-backdrop': true, 'fade': true, show: addData.show}" />
    <div id="modal-add-data" :class="{modal: true, fade: true, show: addData.show}" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add data</h5>
            <button type="button" class="close" @click.prevent="addData.show = false">
              <span>&times;</span>
            </button>
          </div>
          <form @submit.prevent="onAddData">
            <div class="modal-body">
              <div class="form-group">
                <label for="name">Name:</label>
                <input id="name" v-model="addData.name" type="text" class="form-control" required placeholder="Please enter a file name">
                <small class="form-text text-muted">Such as <code>filename.txt</code></small>
              </div>
              <div class="form-group">
                <label for="type">Type:</label>
                <input id="type" v-model="addData.type" type="text" class="form-control" required placeholder="Please enter the MIME type">
                <small class="form-text text-muted">Such as <code>text/plain</code></small>
              </div>
              <div class="form-group">
                <label for="content">Content:</label>
                <textarea id="content" v-model="addData.content" class="form-control" required rows="3" placeholder="Please enter the file contents" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click.prevent="addData.show = false">Close</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div :class="{'modal-backdrop': true, 'fade': true, show: editFile.show}" />
    <div id="modal-edit-file" :class="{modal: true, fade: true, show: editFile.show}" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit file</h5>
            <button type="button" class="close" @click.prevent="editFile.show = false">
              <span>&times;</span>
            </button>
          </div>
          <form @submit.prevent="onEditorFile">
            <div class="modal-body">
              <div class="form-group">
                <label for="name">Name:</label>
                <input id="name" v-model="editFile.name" type="text" class="form-control" required placeholder="Please enter a file name">
              </div>
              <div v-if="editFile.show && editFile.blob && editFile.type && editFile.type.substr(0, 6) === 'image/'" class="form-group">
                <label>Image: </label>
                <div class="edit-image">
                  <img ref="editImage" :src="editFile.blob">
                </div>

                <div class="edit-image-tool">
                  <div class="btn-group" role="group">
                    <button type="button" class="btn btn-primary" title="cropper.rotate(-90)" @click="editFile.cropper.rotate(-90)"><i class="fa fa-undo" aria-hidden="true" /></button>
                    <button type="button" class="btn btn-primary" title="cropper.rotate(90)" @click="editFile.cropper.rotate(90)"><i class="fa fa-repeat" aria-hidden="true" /></button>
                  </div>
                  <div class="btn-group" role="group">
                    <button type="button" class="btn btn-primary" title="cropper.crop()" @click="editFile.cropper.crop()"><i class="fa fa-check" aria-hidden="true" /></button>
                    <button type="button" class="btn btn-primary" title="cropper.clear()" @click="editFile.cropper.clear()"><i class="fa fa-remove" aria-hidden="true" /></button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click.prevent="editFile.show = false">Close</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Cropper from 'cropperjs'
import ImageCompressor from '@xkeshi/image-compressor'
import FileUpload from 'vue-upload-component'
import { sendAnalyzeRequest } from '@/api/user'
// import 'bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css'
export default {
  components: {
    FileUpload
  },
  data() {
    return {
      files: [],
      accept: '',
      extensions: '',
      // extensions: ['gif', 'jpg', 'jpeg','png', 'webp'],
      // extensions: /\.(gif|jpe?g|png|webp)$/i,
      minSize: 1024,
      size: 1024 * 1024 * 10,
      multiple: true,
      directory: false,
      drop: true,
      dropDirectory: true,
      addIndex: false,
      thread: 3,
      name: 'file',
      postAction: '/upload/post',
      putAction: 'http://localhost:8010/uploader',
      headers: {
        // 'X-Csrf-Token': 'xxxx',
      },
      data: {
        // '_csrf_token': 'xxxxxx',
      },
      autoCompress: 1024 * 1024,
      uploadAuto: false,
      isOption: false,
      addData: {
        show: false,
        name: '',
        type: '',
        content: ''
      },
      editFile: {
        show: false,
        name: ''
      }
    }
  },
  watch: {
    'editFile.show'(newValue, oldValue) {
      // 关闭了 自动删除 error
      if (!newValue && oldValue) {
        this.$refs.upload.update(this.editFile.id, { error: this.editFile.error || '' })
      }
      if (newValue) {
        this.$nextTick(function() {
          if (!this.$refs.editImage) {
            return
          }
          const cropper = new Cropper(this.$refs.editImage, {
            autoCrop: false
          })
          this.editFile = {
            ...this.editFile,
            cropper
          }
        })
      }
    },
    'addData.show'(show) {
      if (show) {
        this.addData.name = ''
        this.addData.type = ''
        this.addData.content = ''
      }
    }
  },
  methods: {
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前
        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
        // Automatic compression
        // 自动压缩
        if (newFile.file && newFile.type.substr(0, 6) === 'image/' && this.autoCompress > 0 && this.autoCompress < newFile.size) {
          newFile.error = 'compressing'
          const imageCompressor = new ImageCompressor(null, {
            convertSize: Infinity,
            maxWidth: 512,
            maxHeight: 512
          })
          imageCompressor.compress(newFile.file)
            .then((file) => {
              this.$refs.upload.update(newFile, { error: '', file, size: file.size, type: file.type })
            })
            .catch((err) => {
              this.$refs.upload.update(newFile, { error: err.message || 'compress' })
            })
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        // 创建 blob 字段
        newFile.blob = ''
        const URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }
        // Thumbnails
        // 缩略图
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }
      }
    },
    // add, update, remove File Event
    inputFile(newFile, oldFile) {
      if (newFile && oldFile) {
        // update
        if (newFile.active && !oldFile.active) {
          // beforeSend
          // min size
          if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
            this.$refs.upload.update(newFile, { error: 'size' })
          }
        }
        if (newFile.progress !== oldFile.progress) {
          // progress
        }
        if (newFile.error && !oldFile.error) {
          // error
        }
        if (newFile.success && !oldFile.success) {
          // success
        }
      }
      if (!newFile && oldFile) {
        // remove
        if (oldFile.success && oldFile.response.id) {
          // $.ajax({
          //   type: 'DELETE',
          //   url: '/upload/delete?id=' + oldFile.response.id,
          // })
        }
      }
      // Automatically activate upload
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (this.uploadAuto && !this.$refs.upload.active) {
          this.$refs.upload.active = true
        }
      }
    },
    alert(message) {
      alert(message)
    },
    onEditFileShow(file) {
      this.editFile = { ...file, show: true }
      this.$refs.upload.update(file, { error: 'edit' })
    },
    onEditorFile() {
      if (!this.$refs.upload.features.html5) {
        this.alert('Your browser does not support')
        this.editFile.show = false
        return
      }
      const data = {
        name: this.editFile.name
      }
      if (this.editFile.cropper) {
        const binStr = atob(this.editFile.cropper.getCroppedCanvas().toDataURL(this.editFile.type).split(',')[1])
        const arr = new Uint8Array(binStr.length)
        for (let i = 0; i < binStr.length; i++) {
          arr[i] = binStr.charCodeAt(i)
        }
        data.file = new File([arr], data.name, { type: this.editFile.type })
        data.size = data.file.size
      }
      this.$refs.upload.update(this.editFile.id, data)
      this.editFile.error = ''
      this.editFile.show = false
    },
    // add folader
    onAddFolader() {
      if (!this.$refs.upload.features.directory) {
        this.alert('Your browser does not support')
        return
      }
      const input = this.$refs.upload.$el.querySelector('input')
      input.directory = true
      input.webkitdirectory = true
      this.directory = true
      input.onclick = null
      input.click()
      input.onclick = (e) => {
        this.directory = false
        input.directory = false
        input.webkitdirectory = false
      }
    },
    onAddData() {
      this.addData.show = false
      if (!this.$refs.upload.features.html5) {
        this.alert('Your browser does not support')
        return
      }
      const file = new window.File([this.addData.content], this.addData.name, {
        type: this.addData.type
      })
      this.$refs.upload.add(file)
    },

    onSendAnalyzeRequest() {
      this.listLoading = true
      sendAnalyzeRequest().then(response => {
        this.list = response.data.items
        this.listLoading = false
        // if the response from the server indicating that it's running the analysis, then redirect to a loading view
        if (this.list.indexOf('anylyzing') >= 0) {
          // this.$router.push('@/views/Analyzing/analyzing')
        }
      })
    }
  }
}

</script>

<style>
@import '~bootstrap/dist/css/bootstrap.min.css';
.example-full .btn-group .dropdown-menu {
  display: block;
  visibility: hidden;
  transition: all .2s
}
.example-full .btn-group:hover > .dropdown-menu {
  visibility: visible;
}
.example-full label.dropdown-item {
  margin-bottom: 0;
}
.example-full .btn-group .dropdown-toggle {
  margin-right: .6rem
}
.example-full .filename {
  margin-bottom: .3rem
}
.example-full .btn-is-option {
  margin-top: 0.25rem;
}
.example-full .example-foorer {
  padding: .5rem 0;
  border-top: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
}
.example-full .edit-image img {
  max-width: 100%;
}
.example-full .edit-image-tool {
  margin-top: .6rem;
}
.example-full .edit-image-tool .btn-group{
  margin-right: .6rem;
}
.example-full .footer-status {
  padding-top: .4rem;
}
.example-full .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: .6;
  text-align: center;
  background: #000;
}
.example-full .drop-active h3 {
  margin: -.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}
.example-full {
  padding-left: 5;
  padding-right: 5;
}
.modal-backdrop {
  z-index: -1;
}
.modal-open {
  position: fixed;
  overflow: scroll;
  width: 100%;
  padding-right: 0!important;
}
</style>

<!-- <template>
  <div class="app-container">
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
const VueUploadComponent = require('vue-upload-component')
Vue.component('file-upload', VueUploadComponent)
</script>

<script>
import VueUploadComponent from 'vue-upload-component'
export default {
  name: 'VueUploader',
  data() {
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
}
</script>

<style>

import 'vue-upload-component/dist/vue-upload-component.part.css'
@import "vue-upload-component/dist/vue-upload-component.part.css"

.file-uploads {
  overflow: hidden;
  position: relative;
  text-align: center;
  display: inline-block;
}
.file-uploads.file-uploads-html4 input[type="file"] {
  opacity: 0;
  font-size: 20em;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}
.file-uploads.file-uploads-html5 input[type="file"] {
  overflow: hidden;
  position: fixed;
  width: 1px;
  height: 1px;
  z-index: -1;
  opacity: 0;
}
</style>
 -->
