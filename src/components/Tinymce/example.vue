<template>
  <div class="layout-container">
    <div ref="list" class="layout-body">
      <tinymce
        v-model="content"
        :menu="menu"
        :height="height"
        :new-event-list="eventList"
      />
    </div>
    <div class="util-component" style="display:none;">
      <el-upload
        :multiple="true"
        :file-list="dataList.list"
        :on-progress="uploadProgress"
        :on-success="handleSuccess"
        class="editor-slide-upload"
        action="https://httpbin.org/post"
        list-type="picture-card"
      >
        <el-button id="editorUploader" size="small" type="primary">
          Click upload
        </el-button>
      </el-upload>
    </div>
    <div ref="imageWrapper" class="show-html" v-html="content" />
  </div>
</template>

<script>
import Tinymce from './index'
import html2canvas from 'html2canvas'
import { Loading } from 'element-ui'
export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  data() {
    return {
      showPreviewDialog: false,
      dataurl: '',
      eventList: [
        {
          toolbarName: 'uploadImg',
          tooltip: 'uploadImg',
          text: 'uploadImg',
          fn: (e, callback) => {
            this.handleAdd('uploadImg', data => {
              if (callback && typeof callback === 'function') {
                callback(data)
              }
            })
          }
        },
        // {
        //   toolbarName: 'uploadVideo',
        //   tooltip: 'uploadVideo',
        //   text: 'uploadVideo',
        //   fn: (e, callback) => {
        //     this.handleAdd('uploadVideo', data => {
        //       if (callback && typeof callback === 'function') {
        //         callback(data)
        //       }
        //     })
        //   }
        // },
        {
          toolbarName: 'spreview',
          tooltip: 'spreview',
          text: 'spreview',
          fn: (e, callback) => {
            this.toImage()
          }
        }
      ],
      isUpload: false,
      dataList: {
        list: [
          {
            url: ''
          }
        ],
        type: 'image',
        setDom: v => `<a>${v.dom}</a>`
      },
      height: 700,
      menu: {
        file: { title: '文件', items: 'newdocument' },
        edit: {
          title: '编辑',
          items: 'undo redo | cut copy paste pastetext | selectall'
        },
        insert: { title: '插入', items: 'link media | image hr' },
        view: { title: '查看', items: 'visualaid' },
        format: {
          title: '格式',
          items:
            'bold italic underline strikethrough superscript subscript | formats | removeformat'
        },
        table: {
          title: '表格',
          items: 'inserttable tableprops deletetable | cell row column'
        },
        tools: { title: '工具', items: 'spellchecker code' }
      },
      loadingInstance: null,
      content: `<h1 style="text-align: center;">测试demo!</h1>
                <p>嗨</p>
               <img class="img" src="https://ali-image-test.dabanjia.com/image/20200508/1588911589606_5140%24ban.jpg" width="200"/>
                <p>枕着幸福在梦中微笑，清零生活的压力烦恼，阳光透过窗与你拥抱，伸伸懒腰迎接周末来到，问候源于无法按捺的心跳，愿你周末乐逍遥，生活更美妙！
                    周末来到，让烦恼跑光，让忧愁找不到，跟寂寞说再见，跟压力说拜拜，跟快乐说你好，牵着幸福的手，携上平安，开开心心的过周末！
                    每个人，都有一个世界；每首歌，都有一个故事；每一周，都有一个周末；每个人，都要一个愿望；我的愿望很现实：周末清晨，搅黄你的美梦！周末快乐！
                </p>
                `
    }
  },
  computed: {
    fileType() {
      // 自定义配置上传组件支持的文件，需要对上传组件进行封装，制定文件规格
      if (this.dataList.type === 'image') {
        return 'png|jpe?g|gif|svg'
      }
      if (this.dataList.type === 'video') {
        // 暂时只支持mp4
        return 'mp4'
        // return "mp4|webm|ogg|mp3|wav|flac|aac";
      }
      return ''
    }
  },
  mounted() {
    // 实时获取高度，并减去padding值
    this.height = this.$refs.list.clientHeight - 32
  },
  methods: {
    toImage() {
      var width = 330 // 获取dom 宽度
      var height = this.$refs.imageWrapper.scrollHeight // 获取dom 高度
      var canvas = document.createElement('canvas') // 创建一个canvas节点
      var scale = 2 // 定义任意放大倍数 支持小数默认设置为2，确保图片清晰度
      canvas.width = width * scale * scale // 定义canvas 宽度 * 缩放
      canvas.height = height * scale * scale // 定义canvas高度 *缩放
      canvas.getContext('2d').scale(scale, scale) // 获取context,设置scale
      var opts = {
        tainttest: true, // 检测每张图片都已经加载完成
        scale: scale, // 添加的scale 参数
        useCORS: true,
        canvas: canvas, // 自定义 canvas
        logging: true, // 日志开关
        width: width, // dom 原始宽度
        height: height // dom 原始高度
      }
      html2canvas(this.$refs.imageWrapper, opts).then(canvas => {
        const dataurl = canvas.toDataURL('image/png')
        this.dataurl = dataurl
        if (this.dataurl !== '') {
          console.log(this.dataurl, '生成base64')
        }
      })
    },
    error(e) {
      console.log(e)
    },
    handleAdd(key, callback) {
      this.dataList.list[0].url = ''
      this.isUpload = false
      switch (key) {
        case 'uploadImg':
          this.dataList.type = 'image'
          document.getElementById('editorUploader').click()

          break
        case 'uploadVideo':
          this.dataList.type = 'video'
          document.getElementById('editorUploader').click()

          break
        // 批量操作,可自定义所有操作
        case 'selectImg':
          break
        case 'selectVideo':
          break
      }
      const unWatch = this.$watch('isUpload', val => {
        if (val && callback && typeof callback === 'function') {
          callback(this.dataList)
          // 取消监听
          unWatch()
        }
      })
    },
    uploadProgress() {
      this.loadingInstance = Loading.service({
        lock: true,
        text: '数据加载中，请稍后...',
        background: 'rgba(0, 0, 0, 0.1)'
      })
    },
    // 定义模板
    handleSuccess(data, file) {
      this.loadingInstance.close()
      this.dataList.list[0].url = file.url
      const { type } = this.dataList
      if (type === 'image') {
        this.dataList.setDom = v =>
          `<img class="img-scale" src="${v.url}" width="200">`
      }
      if (type === 'video') {
        // 自定义配置模板信息，宽高后期都可变成输入
        this.dataList.setDom = v =>
          `<p >
              <video controls="controls" width="200" height="350"   >
                 <source src="https://dev-saas.oss-cn-beijing.aliyuncs.com/056eb234fa9844b0b7ec3e13bd39faf7.mp4" type="video/mp4" />
                 <source src="${v.url}" type="video/mp4" />
              </video>
               
            </p>
            `
      }
      this.isUpload = true
    }
  }
}
</script>
<style scoped>
.show-html {
  position: fixed;
  right: 40px;
  top: 80px;
  width: 330px;
  padding: 16px;
  background: #fff;
  border: 1px solid goldenrod;
}
</style>
