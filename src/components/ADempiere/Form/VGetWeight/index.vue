<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt edwinBetanc0urt@hotmail.com www.erpya.com
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
  <el-card shadow="always" class="box-card">
    <el-container>
      <el-header class="header">
        <el-container :class="'container-number' + isMobile">
          <el-aside :class="'aside' + isMobile">
            <h1 class="title">
              {{
                $t('form.weight')
              }}
            </h1> <br>
          </el-aside>
          <el-main class="main">
            <el-row style="height: 100%; border: 1px solid #eee;">
              <el-col :span="24" style="height: 100%">
                <p class="weight">
                  {{
                    weight
                  }}
                </p>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-header>
      <el-main class="main">
        <template v-if="!isEmptyValue(scales)">
          <el-button
            v-for="(scale, key) in scales"
            :key="key"
            type="primary"
            plain
            class="button-scale"
            @click="selectScale(scale)"
          >
            {{ scale.name }}
          </el-button>
        </template>
        <el-button type="primary" icon="el-icon-check" class="button-action" />
        <el-button type="danger" icon="el-icon-close" class="button-action" />
      </el-main>
    </el-container>
  </el-card>
</template>

<script>
import { getListScale, getWeight } from '@/api/ADempiere/form/weight.js'

export default {
  name: 'VGetWeight',
  data() {
    return {
      weight: 0,
      scales: [],
      currentScale: {}
    }
  },
  computed: {
    device() {
      return this.$store.state.app.device
    },
    isMobile() {
      if (this.device === 'mobile') {
        return '-mobile'
      }
      return ''
    }
  },
  mounted() {
    this.getLlistScale()
    if (!this.isEmptyValue(this.currentScale)) {
      this.selectScale(this.currentScale)
    }
  },
  methods: {
    getListScale,
    getWeight,
    getLlistScale() {
      console.log('getLlistScale')
      this.getListScale()
        .then(response => {
          this.scales = response
        })
        .catch(error => {
          console.warn(`Error getting listScale: ${error.message}. Code: ${error.code}.`)
        })
    },
    selectScale(scale) {
      console.log('selectScale')
      this.getWeight({
        idScale: scale.id
      })
        .then(scale => {
          this.weight = scale.weight
          this.currentScale = scale
        })
        .catch(error => {
          console.warn(`Error getting getWeight: ${error.message}. Code: ${error.code}.`)
        })
    }
  }
}
</script>
<style scoped>
  .header {
    padding: 0px;
    margin: 0px;
    height: -webkit-fill-available !important;
    display: contents;
  }
  .main  {
    padding: 0px;
    overflow: hidden;
    display: inline-table;
  }
  aside {
    background: white;
    width: 20%;
    overflow: hidden;
    height: 130% !important;
  }
  .aside-mobile {
    background: white;
    width: 64%!important;
    overflow: hidden;
    height: 65% !important;
    padding: 0px;
    margin: 0px;
}
  .weight {
    font-size: 140px;
    font-weight: bold;
    margin: 0;
    height: 100%;
    line-height: 100%;
  }
  .button-action {
    float: right;
  }
  .button-scale {
    float: left;
  }
  .container-number-mobile {
    display: contents
  }
  .title {
    padding: 0px;
    margin: 0px;
    margin-top: 15%;
    font-size: 5em;
  }
</style>
