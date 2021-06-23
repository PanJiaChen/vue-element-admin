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
  <component
    :is="SmartBrowserView"
    :uuid="uuid"
  />
</template>

<script>
import { defineComponent } from '@vue/composition-api'

import SmartBrowserView from '@/views/ADempiere/BrowserView'

export default defineComponent({
  name: 'TestSmartBrowserView',

  setup() {
    // Request Browser
    const uuid = '8aaf09f0-fb40-11e8-a479-7a0060f0aa01'

    return {
      SmartBrowserView,
      uuid
    }
  }
})
</script>
