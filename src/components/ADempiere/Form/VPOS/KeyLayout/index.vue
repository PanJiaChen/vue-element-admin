<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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
  <el-container style="background: white; height: 100% !important;">
    <el-header>
      <div class="clearfix" style="padding: 0px; margin: 0px">
        <el-row>
          <el-col :span="20" style="padding-left: 20%; padding-right: 0px">
            <p style="text-align: center; padding: 0px; margin: 0px;">
              <b>{{ getLayoutHeader.name }}</b>
              <br>
              {{ getLayoutHeader.description }}
            </p>
          </el-col>
        </el-row>
      </div>
      <el-button
        icon="el-icon-s-home"
        size="small"
        style="float: right"
        circle
        @click="handleCommand"
      />
    </el-header>

    <el-main>
      <el-card
        v-if="!isEmptyValue(getKeyList)"
      >
        <el-row style="padding: 2px">
          <template v-for="(keyValue, key) in getKeyList">
            <el-col :key="key" :span="size">
              <el-card
                shadow="never"
                class="custom-card"
                :body-style="{ padding: '10px' }"
              >
                <span>
                  <p style="padding-left: 10px; font-size: 12px; color: #0e2ea4">
                    <b>{{ keyValue.name }}</b>
                  </p>
                </span>
                <div @click="setKeyActionToOrderLine(keyValue)">
                  <el-image
                    :src="getImageFromSource(keyValue)"
                    class="key-layout"
                    fit="contain"
                  />
                </div>
                <div class="footer-product">
                  <p class="quantity">
                    Cantidad: {{ formatQuantity(keyValue.quantity) }}
                  </p>
                  <br>
                </div>
              </el-card>
            </el-col>
          </template>
        </el-row>
      </el-card>

      <el-card v-else>
        <el-image
          :src="defaultImage"
          class="error-layout"
          fit="contain"
        />
        <div class="error-product">
          <el-link
            @click="handleCommand"
          >
            {{ $t('form.pos.keyLayout.noProducto') }}
            <i class="el-icon-s-home" />
          </el-link>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import { getImagePath } from '@/utils/ADempiere/resource.js'
import { formatQuantity } from '@/utils/ADempiere/valueFormat.js'
export default {
  name: 'KeyLayout',
  data() {
    return {
      resource: {},
      isLoadedKeyLayout: false,
      valuesImage: [{
        identifier: 'undefined',
        value: '',
        isLoaded: true
      }]
    }
  },
  computed: {
    defaultImage() {
      return require('@/image/ADempiere/pos/no-image.jpg')
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    getKeyLayout() {
      return this.$store.getters.getKeyLayout
    },
    getKeyList() {
      const keylist = this.getKeyLayout.keysList
      if (!this.isEmptyValue) {
        return keylist.map(item => {
          return {
            ...item,
            isLoaded: true
          }
        })
      }
      return keylist
    },
    getLayoutHeader() {
      const keyLayout = this.getKeyLayout
      if (keyLayout) {
        return keyLayout
      }
      return {
        name: undefined,
        description: undefined
      }
    },
    // TODO: Verify with panel collection
    isShowedPOSKeyLayout() {
      return this.$store.getters.getShowPOSKeyLayout
    },
    isReadyFromGetData() {
      const { isLoaded, isReload } = this.getKeyLayout
      return (!isLoaded || isReload) && this.isShowedPOSKeyLayout
    },
    size() {
      const size = this.$store.getters.getWidthRight
      return 24 / size
    }
  },
  watch: {
    isReadyFromGetData(isToLoad) {
      if (isToLoad) {
        this.loadKeyLayout()
      }
    }
  },
  mounted() {
    if (this.isReadyFromGetData ||
      (!this.isEmptyValue(this.$store.getters.getKeyLayout.uuid) &&
      this.currentPointOfSales.keyLayoutUuid !== this.$store.getters.getKeyLayout.uuid)
    ) {
      this.loadKeyLayout(this.currentPointOfSales.keyLayoutUuid)
    }
  },
  methods: {
    formatQuantity,
    loadKeyLayout(uuid = null) {
      const KeyLayoutUuid = this.isEmptyValue(uuid) ? this.currentPointOfSales.keyLayoutUuid : uuid

      this.$store.dispatch('getKeyLayoutFromServer', KeyLayoutUuid)
        .then(() => {
          this.isLoadedKeyLayout = true
        })
    },
    setKeyActionToOrderLine(keyValue) {
      if (!this.isEmptyValue(keyValue.subKeyLayoutUuid)) {
        this.loadKeyLayout(keyValue.subKeyLayoutUuid)
      } else {
        this.$store.dispatch('notifyActionKeyPerformed', {
          columnName: 'ProductValue',
          value: {
            QtyEntered: keyValue.quantity,
            value: keyValue.productValue
          }
        })
      }
    },
    handleCommand(command) {
      const point = this.$store.getters.posAttributes.currentPointOfSales.uuid
      const toReturn = this.getKeyList.find(keyLayoutItem => keyLayoutItem.subKeyLayoutUuid === point)

      let keyLayoutUuid = this.currentPointOfSales.keyLayoutUuid
      if (!this.isEmptyValue(toReturn)) {
        keyLayoutUuid = toReturn.subKeyLayoutUuid
      }
      this.loadKeyLayout(keyLayoutUuid)
    },
    getDefaultImage(keyValue) {
      const { fileName } = keyValue.resourceReference

      if (this.isEmptyValue(fileName)) {
        return true
      }

      const image = this.valuesImage.find(item => item.identifier === fileName)
      if (this.isEmptyValue(image)) {
        return false
      }
      return image.isLoaded
    },
    getImageFromSource(keyValue) {
      const fileName = keyValue.resourceReference.fileName

      if (this.isEmptyValue(fileName)) {
        return this.defaultImage
      }
      const image = getImagePath({
        file: fileName,
        width: 300,
        height: 300
      })
      return image.uri
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-card__header {
    padding: 0px !important;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .key-layout {
    width: 100%;
    height: 200px;
    display: block;
    padding-top: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
  }
  .error-layout {
    width: 100%;
    height: 25%;
    display: block;
    padding-top: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
  }
  .price {
    height: 100%;
    font-size: 15px;
    width: 50%;
    text-align: right;
    padding: 0px !important;
    margin-top: 5px !important;
    margin-bottom: 10px !important;
    margin-left: 0px !important;
    margin-right: 7px !important;
  }
  .quantity {
    height: 100%;
    font-size: 13px;
    text-align: left;
    width: 50%;
    padding: 0px !important;
    margin-top: 5px !important;
    margin-bottom: 10px !important;
    margin-left: 7px !important;
    margin-right: 0px !important;
  }
  .footer-product {
    display: flex;
    width: 100%;
  }
  .error-product {
    width: 100%;
    text-align: center;
  }
  .el-main {
    display: block;
    box-sizing: border-box;
    padding-top: 5px !important;
    padding-bottom: 5px !important;
    padding-left: 5px !important;
    padding-right: 5px !important;
  }
</style>

<style lang="scss">
  .custom-card {
    margin: 1px;
    cursor: pointer;
  }
  .custom-card:hover {
    background-color: #eaf5fe;
    border: 1px solid #36a3f7;
  }
</style>
