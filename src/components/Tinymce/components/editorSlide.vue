<template>
    <div class="upload-container">
        <el-button :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上传轮播图
        </el-button>
        <el-dialog v-model="dialogVisible">
            <el-upload
                    class="editor-slide-upload"
                    action="https://upload.qbox.me"
                    :data="dataObj"
                    :multiple="true"
                    :show-file-list="true"
                    list-type="picture-card"
                    :on-remove="handleRemove"
                    :before-upload="beforeUpload">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </el-dialog>
    </div>
</template>
<script>
    import { getToken } from 'api/qiniu';

    export default {
      name: 'editorSlideUpload',
      props: {
        color: {
          type: String,
          default: '#20a0ff'
        }
      },
      data() {
        return {
          dialogVisible: false,
          dataObj: { token: '', key: '' },
          list: []
        };
      },
      methods: {
        handleSubmit() {
          const arr = this.list.map(v => v.url);
          this.$emit('successCBK', arr);
          this.list = [];
          this.dialogVisible = false;
        },
        handleRemove(file) {
          const key = file.response.key;
          for (let i = 0, len = this.list.length; i < len; i++) {
            if (this.list[i].key === key) {
              this.list.splice(i, 1);
              return
            }
          }
        },
        beforeUpload() {
          const _self = this;
          return new Promise((resolve, reject) => {
            getToken().then(response => {
              const key = response.data.qiniu_key;
              const token = response.data.qiniu_token;
              _self._data.dataObj.token = token;
              _self._data.dataObj.key = key;
              this.list.push({ key, url: response.data.qiniu_url });
              resolve(true);
            }).catch(err => {
              console.log(err);
              reject(false)
            });
          });
        }
      }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .upload-container {
        .editor-slide-upload {
            margin-bottom: 20px;
        }
    }
</style>
