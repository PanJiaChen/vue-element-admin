<template>
  <div class='tinymce-container editor-container'>
    <textarea class='tinymce-textarea' :id="id"></textarea>
  </div>
</template>

<script>
    // import { getToken, upload } from 'api/qiniu'; // 七牛
    export default {
      name: 'tinymce',
      props: {
        id: {
          type: String,
          default: 'tinymceEditor'
        },
        value: {
          type: String,
          default: ''
        },
        toolbar: {
          type: Array,
          required: false,
          default() {
            return ['removeformat undo redo |  bullist numlist | outdent indent | forecolor | fullscreen code', 'bold italic blockquote | h2 p  media link | alignleft aligncenter alignright']
          }
        },
        data() {
          return {
            hasChange: false,
            hasInit: false
          }
        },
        menubar: {
          default: ''
        },
        height: {
          type: Number,
          required: false,
          default: 360
        }
      },
      watch: {
        value(val) {
          if (!this.hasChange && this.hasInit) {
            this.$nextTick(() => tinymce.get(this.id).setContent(val))
          }
        }
      },
      mounted() {
        const _this = this;
        tinymce.init({
          selector: `#${this.id}`,
          height: this.height,
          body_class: 'panel-body ',
          object_resizing: false,
          //  language: 'zh_CN',
          //  language_url: '/static/tinymce/langs/zh_CN.js',
          toolbar: this.toolbar,
          menubar: this.menubar,
          plugins: 'advlist,autolink,code,paste,textcolor, colorpicker,fullscreen,link,lists,media,wordcount, imagetools,watermark',
          end_container_on_empty_block: true,
          powerpaste_word_import: 'clean',
          code_dialog_height: 450,
          code_dialog_width: 1000,
          advlist_bullet_styles: 'square',
          advlist_number_styles: 'default',
          block_formats: '普通标签=p;小标题=h2;',
          imagetools_cors_hosts: ['wpimg.wallstcn.com', 'wallstreetcn.com'],
          imagetools_toolbar: 'watermark',
          default_link_target: '_blank',
          link_title: false,
          init_instance_callback: editor => {
            if (_this.value) {
              editor.setContent(_this.value)
            }
            _this.hasInit = true;
            editor.on('NodeChange Change KeyUp', () => {
              this.hasChange = true;
              this.$emit('input', editor.getContent({ format: 'raw' }));
            });
          },
          // 整合七牛上传
          // images_dataimg_filter(img) {
          //   setTimeout(() => {
          //     const $image = $(img);
          //     $image.removeAttr('width');
          //     $image.removeAttr('height');
          //     if ($image[0].height && $image[0].width) {
          //       $image.attr('data-wscntype', 'image');
          //       $image.attr('data-wscnh', $image[0].height);
          //       $image.attr('data-wscnw', $image[0].width);
          //       $image.addClass('wscnph');
          //     }
          //   }, 0);
          //   return img
          // },
          // images_upload_handler(blobInfo, success, failure, progress) {
          //   progress(0);
          //   const token = _this.$store.getters.token;
          //   getToken(token).then(response => {
          //     const url = response.data.qiniu_url;
          //     const formData = new FormData();
          //     formData.append('token', response.data.qiniu_token);
          //     formData.append('key', response.data.qiniu_key);
          //     formData.append('file', blobInfo.blob(), url);
          //     upload(formData).then(() => {
          //       success(url);
          //       progress(100);
          //     })
          //   }).catch(err => {
          //     failure('出现未知问题，刷新页面，或者联系程序员')
          //     console.log(err);
          //   });
          // },
          setup(editor) {
            editor.addButton('h2', {
              title: '小标题', // tooltip text seen on mouseover
              text: '小标题',
              onclick() {
                editor.execCommand('mceToggleFormat', false, 'h2');
              },
              onPostRender() {
                const btn = this;
                editor.on('init', () => {
                  editor.formatter.formatChanged('h2', state => {
                    btn.active(state);
                  });
                });
              }
            });
            editor.addButton('p', {
              title: '正文',
              text: '正文',
              onclick() {
                editor.execCommand('mceToggleFormat', false, 'p');
              },
              onPostRender() {
                const btn = this;
                editor.on('init', () => {
                  editor.formatter.formatChanged('p', state => {
                    btn.active(state);
                  });
                });
              }
            });
          }
        });
      },
      destroyed() {
        tinymce.get(this.id).destroy();
      }
}
</script>

<style scoped>
.tinymce-container {
  position: relative
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 15px;
  top: 18px;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
