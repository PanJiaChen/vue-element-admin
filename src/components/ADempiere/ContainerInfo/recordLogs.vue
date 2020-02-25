<template>
  <div>
    <el-card
      v-if="getIsChangeLog"
      :class="classIsMobilePanel"
    >
      <el-scrollbar :wrap-class="classIsMobilePanel">
        <el-timeline>
          <el-timeline-item
            v-for="(listLogs, key) in gettersListRecordLogs"
            :key="key"
            :timestamp="translateDate(listLogs.logDate)"
            placement="top"
            color="#008fd3"
          >
            <el-card shadow="hover" class="clearfix">
              <div>
                {{ listLogs.userName }}
                <el-link type="primary" style="float: right;" @click="showkey(key)"> {{ $t('window.containerInfo.changeDetail') }} </el-link>
              </div>
              <el-collapse-transition>
                <div v-show="(currentKey === key)">
                  <span v-for="(list, index) in listLogs.changeLogs" :key="index">
                    <p v-if="list.columnName === 'DocStatus'"><b> {{ list.displayColumnName }} :</b> <strike> <el-tag :type="tagStatus(list.oldValue)"> {{ list.oldDisplayValue }} </el-tag> </strike> <el-tag :type="tagStatus(list.newValue)"> {{ list.newDisplayValue }} </el-tag> </p>
                    <p v-else><b> {{ list.displayColumnName }} :</b> <strike> <el-link type="danger"> {{ list.oldDisplayValue }} </el-link> </strike> <el-link type="success"> {{ list.newDisplayValue }} </el-link> </p>
                  </span>
                </div>
              </el-collapse-transition>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </el-card>
  </div>
</template>
<script>
import { MixinInfo } from '@/components/ADempiere/ContainerInfo/mixinInfo'
export default {
  name: 'RecordLogs',
  mixins: [MixinInfo],
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
    }
  }
}
</script>

<style>
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
    height: 100vh;
  }
</style>
