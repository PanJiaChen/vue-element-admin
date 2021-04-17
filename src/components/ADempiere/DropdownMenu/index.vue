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
  <el-col v-if="!isEmptyValue(items.children)" key="is-desktop-dropdown" :span="24">
    <el-collapse v-model="activeNames">
      <el-collapse-item :title="title" name="1" class="collapse-item">
        <el-row justify="space-around">
          <template v-for="(item, index) in items.children">
            <el-col :key="index" :span="isMobile">
              <el-card
                :key="index"
                shadow="never"
                class="custom-card"
                :body-style="{ padding: '10px', height: '100px' }"
                @click.native="redirect(item)"
              >
                <div class="icon-wrapper">
                  <svg-icon :icon-class="item.meta.icon" />
                </div>
                <div class="text-wrapper">
                  <b>{{ item.meta.title }}</b>
                  <p class="three-dots">{{ item.meta.description }}</p>
                </div>
              </el-card>
            </el-col>
          </template>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </el-col>
  <el-col v-else key="is-mobile-dropdown" :span="isMobile">
    <el-card
      shadow="never"
      class="custom-card"
      :body-style="{ padding: '10px', height: '100px' }"
      @click.native="redirect(items)"
    >
      <div class="icon-wrapper">
        <svg-icon :icon-class="items.meta.icon" />
      </div>
      <div class="text-wrapper">
        <b>{{ items.meta.title }}</b>
        <p>{{ items.meta.description }}</p>
      </div>
    </el-card>
  </el-col>
</template>

<script>
export default {
  name: 'DropdownMenu',
  props: {
    items: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeNames: ['1']
    }
  },
  computed: {
    device() {
      return this.$store.state.app.device
    },
    isMobile() {
      if (this.device === 'mobile') {
        return 24
      }
      return 8
    }
  },
  methods: {
    redirect(item) {
      this.openItemMenu(item)

      let tabParent
      if (item.meta && item.meta.type === 'window') {
        tabParent = 0
      }

      this.$router.push({
        name: item.name,
        query: {
          ...this.$router.query,
          tabParent
        },
        params: {
          ...this.$router.params,
          childs: item.children
        }
      }, () => {})
    },
    /**
     * Clear field values, and set default values with open
     * @param view router item with meta attributes
     */
    openItemMenu(view) {
      if (view.meta && view.meta.uuid && view.meta.type) {
        const {
          parentUuid,
          uuid: containerUuid,
          type: panelType
        } = view.meta

        if (panelType !== 'window') {
          this.$store.dispatch('setDefaultValues', {
            parentUuid,
            containerUuid,
            panelType,
            isNewRecord: false
          })

          if (['browser'].includes(panelType)) {
            this.$store.dispatch('deleteRecordContainer', {
              viewUuid: containerUuid
            })
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .custom-card {
    margin: 10px;
    cursor: pointer;
  }
  .icon-wrapper {
    height: 100%;
    width: 20%;
    float: left;
    font-size: 30px;
    line-height: 65px;
    padding: 6px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
    text-align: center;
    color: #36a3f7;
  }
  .custom-card:hover {
    .icon-wrapper {
      color: #fff;
      background: #36a3f7;
    }
  }
  .text-wrapper {
    margin-left: 50px;
    padding-left: 15px;
    vertical-align: middle;
    height: 100%;
    font-size: 13px;
  }
  .collapse-item {
    .el-collapse-item__header {
      height: 60px;
      font-weight: bold;
      font-size: 16px;
      text-align: center;
    }
  }
  .three-dots{
    margin-top: 0 !important;
    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
  }
</style>
