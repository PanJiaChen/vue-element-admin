<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com www.erpya.com
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
  <el-carousel :ref="stepReference" arrow="never" :autoplay="false" :initial-index="indicator" style="height: 100%;">
    <el-carousel-item v-for="(item, key) in steps" :key="key">
      <el-card class="box-card" style="height: 100%;">
        <div slot="header" class="clearfix">
          <p style="margin: 0px;text-align: center;">
            <b>
              {{ item.name }}
            </b>
          </p>
          <p style="margin: 0px;text-align: center;">
            {{ item.description }}
          </p>
        </div>
        <div class="text item" style="height: 90%;overflow: auto;">
          <slot />
        </div>
      </el-card>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: 'Carousel',
  props: {
    stepReference: {
      type: String,
      default: 'carousel'
    },
    steps: {
      type: Array,
      default: () => []
    },
    indicator: {
      type: Number,
      default: 0
    }
  },
  watch: {
    indicator(value) {
      this.$refs[this.stepReference].activeIndex = value
    }
  }
}
</script>

<style>
.el-carousel__container {
  position: relative;
  height: 100%;
}
</style>
