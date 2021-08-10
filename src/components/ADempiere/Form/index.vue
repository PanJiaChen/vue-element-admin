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
  <component
    :is="componentRender"
    :metadata="metadata"
  />
</template>

<script>
export default {
  name: 'FormPanel',
  props: {
    metadata: {
      type: Object,
      required: true
    }
  },
  computed: {
    // load the component that is indicated in the attributes of received property
    componentRender() {
      let form
      switch (this.metadata.fileName) {
        case 'PriceChecking':
          form = import('@/components/ADempiere/Form/PriceChecking')
          this.$store.dispatch('settings/changeSetting', {
            key: 'showMenu',
            value: false
          })
          this.$store.dispatch('app/toggleSideBar', false)
          this.$store.dispatch('settings/changeSetting', {
            key: 'tagsView',
            value: false
          })
          break
        case 'BarcodeReader':
          form = import('@/components/ADempiere/Form/BarcodeReader')
          break
        case 'ProductInfo':
          form = import('@/components/ADempiere/Form/ProductInfo')
          break
        case 'WFActivity':
          form = import('@/components/ADempiere/Form/WorkflowActivity')
          break
        case 'VMatch':
          form = import('@/components/ADempiere/Form/VMatch')
          break
        case 'VPOS':
          this.$store.dispatch('settings/changeSetting', {
            key: 'showContextMenu',
            value: false
          })
          form = import('@/components/ADempiere/Form/VPOS')
          break
        case 'VGetWeight':
          form = import('@/components/ADempiere/Form/VGetWeight')
          break
        default:
          form = import('@/views/ADempiere/Unsupported')
          break
      }

      return () => {
        return new Promise(resolve => {
          form
            .then(formFile => {
              resolve(formFile)
            })
            .catch(() => {
              import('@/views/ADempiere/Unsupported')
                .then(unsupportedFile => {
                  resolve(unsupportedFile)
                })
            })
        })
      }
    }
  }
}
</script>
