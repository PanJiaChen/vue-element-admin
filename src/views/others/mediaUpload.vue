<template>
    <div class="app-container mediaUpload-container">
        <el-upload
                class="upload-container"
                action="https://upload.qbox.me"
                :data="dataObj"
                drag
                :multiple="true"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="beforeUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>

        <template v-if='fileList.length!=0'>
            <el-table
                    :data="fileList"
                    border
                    style="width: 100%">
                <el-table-column label="名字">
                    <template scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column label="url">
                    <template scope="scope">
                        {{scope.row.url}}
                    </template>
                </el-table-column>
            </el-table>
        </template>
    </div>
</template>
<script>
    import { getToken } from 'api/qiniu';

    export default{
      data() {
        return {
          image_uri: [],
          dataObj: { token: '', key: '' },
          fileList: []
        }
      },
      computed: {
        token() {
          return this.$store.getters.token
        }
      },
      methods: {
        beforeUpload() {
          const _self = this;
          return new Promise((resolve, reject) => {
            getToken(this.token).then(response => {
              const key = response.data.qiniu_key;
              const token = response.data.qiniu_token;
              this.addFile(key, response.data.qiniu_url);
              _self._data.dataObj.token = token;
              _self._data.dataObj.key = key;
              resolve(true);
            }).catch(err => {
              console.log(err)
              reject(false)
            });
          });
        },
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePreview(file) {
          console.log(file);
        },
        handleSuccess(response, file) {
          const key = response.key;
          for (let i = this.fileList.length; i--;) {
            const item = this.fileList[i];
            if (item.key === key) {
              this.fileList[i].name = file.name;
              return
            }
          }
        },

        addFile(key, url) {
          this.fileList.push({
            key,
            url,
            name: ''
          })
        }
      }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .mediaUpload-container {
        .upload-container {
            margin: 30px;
        }
    }
</style>
