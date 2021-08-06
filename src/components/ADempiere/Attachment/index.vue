<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
<template>
  <div>
    <el-card :class="classIsMobilePanel">
      <div slot="header" class="clearfix">
        <span> {{ $t('window.containerInfo.attachment') }} </span>
        <el-button style="float: right;padding: 3px 0px;color: black;" type="text" @click="changeDisplay">
          <svg-icon :icon-class="display ? 'component' : 'list'" />
        </el-button>
      </div>
      <el-scrollbar :wrap-class="classIsMobileScroll">
        <el-upload
          v-if="display"
          class="upload-demo"
          drag
          action="#"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="listAttachment"
          list-type="picture"
          multiple
        >
          <i class="el-icon-upload" />
        </el-upload>
        <el-upload
          v-else
          action="#"
          list-type="picture-card"
          :file-list="listAttachment"
          :auto-upload="false"
          class="upload-demo"
        >
          <i class="el-icon-plus" />
          <div slot="file" slot-scope="{file}">
            <img
              id="download"
              :src="file.url"
              fit="fill"
              style="width: 100%; height: 100%"
            >
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in" />
              </span>
              <span
                class="el-upload-list__item-delete"
                @click="handleDownload(file)"
              >
                <i class="el-icon-download" />
              </span>
              <span
                class="el-upload-list__item-delete"
                @click="handleRemove(file, listAttachment)"
              >
                <i class="el-icon-delete" />
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :title="dialogImage.name" :visible.sync="dialogVisible">
          <img :src="dialogImage.url" style="width: 50%; height: 50%">
        </el-dialog>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script>
import { getImagePath } from '@/utils/ADempiere/resource.js'

export default {
  name: 'Attachment',
  data() {
    return {
      dialogImage: '',
      dialogVisible: false,
      display: false
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    classIsMobileScroll() {
      if (this.isMobile) {
        return 'scroll-window-log-change-mobile'
      }
      return 'scroll-window-log-change'
    },
    classIsMobilePanel() {
      if (this.isMobile) {
        return 'panel-mobile'
      }
      return 'panel'
    },
    listAttachment() {
      if (this.isEmptyValue(this.$store.getters.getListAttachment)) {
        return []
      }
      return this.$store.getters.getListAttachment.map(attachment => {
        return {
          ...attachment,
          type: this.fileType(attachment.type),
          url: this.getImageFromSource(attachment.name, this.fileType(attachment.type))
        }
      })
    }
  },
  methods: {
    handleRemove(file) {
      const fileList = this.listAttachment
      const index = this.listAttachment.findIndex(attachment => attachment.uuid === file.uuid)
      fileList.splice(index, 1)
      this.$store.commit('setListAttachment', fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImage = {
        name: file.name,
        url: file.url
      }
      this.dialogVisible = true
    },
    handleDownload(file) {
      const download = document.createElement('a')
      download.href = file.url
      download.download = file.name
      download.click()
    },
    defaultImage(type) {
      let image
      switch (type) {
        case 'html':
          image = require('@/image/ADempiere/html.png')
          break
        case 'Excel':
          image = require('@/image/ADempiere/excel.png')
          break
        case 'pdf':
          image = require('@/image/ADempiere/pdf.png')
          break
        default:
          image = require('@/image/ADempiere/priceChecking/no-image.jpg')
          break
      }
      return image
    },
    getImageFromSource(fileName, type) {
      if (type !== 'image') {
        return this.defaultImage(type)
      }
      const image = getImagePath({
        file: fileName,
        width: 300,
        height: 300
      })
      return image.uri
    },
    fileType(type) {
      let file
      switch (type) {
        case 'image/jpeg':
        case 'image/png':
          file = 'image'
          break
        case 'image/bmp':
          file = 'bmp'
          break
        case 'text/html':
          file = 'html'
          break
        case 'application/octet-stream':
          file = 'Excel'
          break
        case 'application/pdf':
          file = 'pdf'
          break
        default:
          file = type
          break
      }
      return file
    },
    changeDisplay() {
      this.display = !this.display
    }
  }
}
</script>

<style>
  .scroll-window-log-change {
    max-height: 74vh !important;
  }
  .custom-card {
    margin: 1px;
    cursor: pointer;
  }
  .custom-card:hover {
    background-color: #eaf5fe;
    border: 1px solid #36a3f7;
  }
  .scroll-window-log-change {
    max-height: 74vh !important;
  }
  .scroll-window-log-change-mobile {
    max-height: 56vh !important;
  }
  .panel-mobile {
    height: 57vh;
  }
  .panel {
    height: 75vh;
  }
  .el-upload {
    display: none;
    text-align: center;
    cursor: pointer;
    outline: none;
  }
</style>
