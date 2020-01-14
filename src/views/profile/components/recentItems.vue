<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) of recentItems"
        :key="index"
        placement="top"
        type="primary"
        size="large"
        :timestamp="translateDate(item.updated)"
      >
        <el-card @click.native="redirect(item)">
          <h4>
            {{ item.displayName }}
            <el-tag v-show="checkOpened(item.menuUuid)">{{ $t('notifications.opened') }}</el-tag>
          </h4>
          <p>{{ item.description }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  name: 'RecentItems',
  data() {
    return {
      recentItems: []
    }
  },
  computed: {
    getterRecentItems() {
      return this.$store.getters.getRecentItems
    },
    cachedViews() {
      return this.$store.getters.cachedViews
    }
  },
  mounted() {
    this.getRecentItems()
    this.subscribeChanges()
  },
  methods: {
    checkOpened(uuid) {
      return this.cachedViews.includes(uuid)
    },
    redirect(item) {
      if (!this.isEmptyValue(item.uuidRecord)) {
        this.$router.push({ name: item.menuUuid, query: { action: item.uuidRecord, tabParent: 0 }})
      } else {
        this.$router.push({ name: item.menuUuid })
      }
    },
    getRecentItems() {
      var items = this.getterRecentItems
      if (items === undefined || items.length < 1) {
        this.$store.dispatch('getRecentItemsFromServer')
          .then(response => {
            this.recentItems = response
          })
      } else {
        this.recentItems = items
      }
    },
    subscribeChanges() {
      this.$store.subscribe((mutation, state) => {
        // The mutation comes in the format of `{ type, payload }`.
        if (mutation.type === 'setRecentItems') {
          this.recentItems = this.getterRecentItems
        }
      })
    },
    translateDate(value) {
      return this.$d(new Date(value), 'long', this.language)
    }
  }
}
</script>
