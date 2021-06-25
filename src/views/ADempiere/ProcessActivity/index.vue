<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Leonel Matos lmatos@erpya.com www.erpya.com
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
    :is="templateDevice"
  />
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'ProcessActivityFromDevice',

  setup(props, { root }) {
    const isMobile = computed(() => {
      return root.$store.state.app.device === 'mobile'
    })

    const templateDevice = computed(() => {
      if (isMobile.value) {
        return () => import('@/views/ADempiere/ProcessActivity/modeMobile')
      }
      return () => import('@/views/ADempiere/ProcessActivity/modeDesktop')
    })

    return {
      // computeds
      templateDevice
    }
  }
})
</script>

<style lang="scss" scoped src="./processActivityStyle.scss">
</style>
<style>
  .popover-scroll {
    max-height: 200px !important;
  }
</style>
