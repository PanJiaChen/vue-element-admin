<template>
  <div class='tinymce-container editor-container'>
    <textarea class='tinymce-textarea' :id="id"></textarea>
    <div class="editor-custom-btn-container">
      <editorSlide v-if="customButton.indexOf('editorSlide')>=0" color="#3A71A8" class="editor-upload-btn" @successCBK="slideSuccessCBK"></editorSlide>
      <editorAudio v-if="customButton.indexOf('editorAudio')>=0" color="#30B08F" class="editor-upload-btn" @successCBK="aduioSuccessCBK"></editorAudio>
      <editorVideo v-if="customButton.indexOf('editorVideo')>=0" color="#E65D6E" class="editor-upload-btn" @successCBK="videoSuccessCBK"></editorVideo>
       <editorImage v-if="customButton.indexOf('editorImage')>=0" color="#20a0ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
    </div>
  </div>
</template>

<script>
    import editorAudio from './components/editorAudio';
    import editorVideo from './components/editorVideo';
    import editorSlide from './components/editorSlide';
    import editorImage from './components/editorImage';
    import { getToken, upload } from 'api/qiniu';
    export default {
      name: 'tinymce',
      components: { editorImage, editorAudio, editorSlide, editorVideo },
      props: {
        id: {
          type: String,
          default: 'tinymceEditor'
        },
        value: {
          type: String,
          default: ''
        },
        customButton: {
          type: Array,
          required: false,
          default() {
            return ['editorAudio', 'editorImage']
          }
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
          textcolor_map: [
            '1482f0', '1482f0',
            '4595e6', '4595e6'],
          init_instance_callback: editor => {
            if (_this.value) {
              editor.setContent(_this.value)
            }
            _this.hasInit = true;
            editor.on('Change', () => {
              this.hasChange = true;
              this.$emit('input', editor.getContent({ format: 'raw' }));
            });
          },
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
              title: '正文', // tooltip text seen on mouseover
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
      methods: {
        imageSuccessCBK(arr) {
          console.log(arr)
          const _this = this;
          arr.forEach(v => {
            const node = document.createElement('img');
            node.setAttribute('src', v);
            node.onload = function() {
              $(this).addClass('wscnph');
              $(this).attr('data-wscntype', 'image');
              $(this).attr('data-wscnh', this.height);
              $(this).attr('data-wscnw', this.width);
              tinymce.get(_this.id).insertContent(node.outerHTML)
            }
          })
        },
        slideSuccessCBK(arr) {
          const node = document.createElement('img');
          node.setAttribute('data-wscntype', 'slide');
          node.setAttribute('data-uri', arr.toString());
          node.setAttribute('data-wscnh', '190');
          node.setAttribute('data-wscnw', '200');
          node.setAttribute('src', ' https://wdl.wallstreetcn.com/6410b47d-a54c-4826-9bc1-c3e5df31280c');
          node.className = 'wscnph editor-placeholder';
          tinymce.get(this.id).insertContent(node.outerHTML)
        },
        videoSuccessCBK(form) {
          const node = document.createElement('img');
          node.setAttribute('data-wscntype', 'video');
          node.setAttribute('data-uri', form.url);
          node.setAttribute('data-cover-img-uri', form.image);
          node.setAttribute('data-title', form.title);
          node.setAttribute('src', 'https://wdl.wallstreetcn.com/07aeb3e7-f4ca-4207-befb-c987b3dc7011');
          node.className = 'wscnph editor-placeholder';
          tinymce.get(this.id).insertContent(node.outerHTML)
        },
        aduioSuccessCBK(form) {
          const node = document.createElement('img');
          node.setAttribute('data-wscntype', 'audio');
          node.setAttribute('data-uri', form.url);
          node.setAttribute('data-title', form.title);
          node.setAttribute('data-text', form.text);
          node.setAttribute('src', 'https://wdl.wallstreetcn.com/2ed0c8c8-fb82-499d-b81c-3fd1de114eae');
          node.className = 'wscnph editor-placeholder';
          tinymce.get(this.id).insertContent(node.outerHTML)
        }
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
  /*z-index: 2005;*/
  top: 18px;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
