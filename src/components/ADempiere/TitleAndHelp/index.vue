<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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
  <h3 class="title-header text-center">
    <el-popover
      v-if="!isEmptyValue(help)"
      ref="helpTitle"
      placement="top-start"
      :title="title"
      :class="cssClassHelp"
      width="400"
      trigger="hover"
    >
      <div class="content-help" v-html="help" />
    </el-popover>

    <el-button
      v-popover:helpTitle
      type="text"
      class="container-title text-center"
    >
      {{ title }}
    </el-button>

    <slot />
  </h3>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'TitleAndHelp',

  props: {
    name: {
      type: String,
      default: ''
    },
    help: {
      type: String,
      default: ''
    }
  },

  setup(props, { root }) {
    const title = computed(() => {
      return props.name || root.$route.meta.title
    })

    const cssClassHelp = computed(() => {
      if (root.$store.state.app.device === 'mobile') {
        return 'container-help-mobile'
      }
      return 'container-help'
    })

    return {
      cssClassHelp,
      title
    }
  }

})
</script>

<style>
  /* text content title */
  .el-popover__title {
    padding-top: 10px;
    padding-left: 10px;
  }
</style>
<style lang="scss" scoped>
  // title container
  .title-header {
    margin: 0px 0px !important;
    padding-top: 0px !important;
  }

  // text content help into popover
  .content-help {
    padding-right: 10px;
    padding-left: 10px;
    padding-top: 0px !important;
    padding-bottom: 10px;
    word-break: break-word;
  }
  // title of the main views into popover
  .container-title {
    text-align: center;
    color: #000000;
    // text-size-adjust: 20px;
    font-size: 100%;
    font-weight: 605 !important;
  }

  // smart browser help in title popover
  .container-help {
    width: 100%;
    height: 200%;
    padding-left: 39px !important;
  }
  // mobile smart browser help in title popover
  .container-help-mobile {
    width: 50%;
    height: 50%;
    padding-left: 15px !important;
  }
</style>
