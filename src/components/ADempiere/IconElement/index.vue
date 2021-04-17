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
  <div :class="{ 'show-input-search': isShowElement }" class="search-detail">
    <i
      :class="icon + ' props-icon'"
      @click.stop="click"
    />
    <slot
      ref="headerSearchSelect"
    />
  </div>
</template>

<script>
export default {
  name: 'IconElement',
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isShowElement: false // show input from search,
    }
  },
  watch: {
    isShowElement(value) {
      if (value) {
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    }
  },
  methods: {
    click() {
      this.isShowElement = !this.isShowElement
      if (this.isShowElement) {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
      this.options = []
      this.show = false
    }
  }
}
</script>

<style lang="scss">
  .search-detail {
    margin: 0 10px;
    float: right;
    color: #5a5e66;
    height: 39px !important;
    line-height: 39px !important;
    .props-icon {
      cursor: pointer;
      font-size: 18px;
      vertical-align: middle;
    }

    .header-search-input {
      font-size: 18px;
      transition: width 0.2s;
      width: 0;
      overflow: hidden;
      background: transparent;
      border-radius: 0;
      display: inline-block;
      vertical-align: middle;

      ::v-deep .el-input__inner {
        border-radius: 0;
        border: 0;
        padding-left: 0;
        padding-right: 0;
        box-shadow: none !important;
        border-bottom: 1px solid #d9d9d9;
        vertical-align: middle;
      }
    }
    .header-search-select {
      font-size: 12px;
      transition: width 0.2s;
      width: 30px;
      overflow: hidden;
      background: transparent;
      border-radius: 0;
      display: inline-block;
      vertical-align: middle;
      height: 28px;

      ::v-deep .el-input__inner {
        border-radius: 0;
        border: 0;
        padding-left: 0;
        padding-right: 0;
        box-shadow: none !important;
        border-bottom: 1px solid #d9d9d9;
        vertical-align: middle;
      }
    }
    &.show-input-search {
      .header-search-input {
        width: 190px;
      }
    }
    .header-search-input-mobile {
      transition: width 0.2s;
      width: 0 !important;
      overflow: hidden;
      background: transparent;
      border-radius: 0;
      display: inline-block;
      vertical-align: middle;

      ::v-deep .el-input__inner {
        border-radius: 0;
        border: 0;
        padding-left: 0;
        padding-right: 0;
        box-shadow: none !important;
        border-bottom: 1px solid #d9d9d9;
        vertical-align: middle;
      }
    }
    .header-search-select-mobile {
      transition: width 0.2s;
      width: 0 !important;
      overflow: hidden;
      background: transparent;
      border-radius: 0;
      display: inline-block;
      vertical-align: middle;

      ::v-deep .el-input__inner {
        border-radius: 0;
        border: 0;
        padding-left: 0;
        padding-right: 0;
        box-shadow: none !important;
        border-bottom: 1px solid #d9d9d9;
        vertical-align: middle;
      }
    }
    &.show-input-search{
      .header-search-select-mobile {
        width: 120px !important;
      }
    }
    &.show-input-search{
      .header-search-input-mobile {
        width: 120px !important;
      }
    }
  }
</style>
