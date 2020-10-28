import { recursiveTreeSearch } from '@/utils/ADempiere/valueUtils.js'

export default {
  name: 'MixinDashboard',
  props: {
    metadata: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      search: '',
      unsubscribe: () => {}
    }
  },
  computed: {
    permissionRoutes() {
      return this.$store.getters.permission_routes
    }
  },
  methods: {
    recursiveTreeSearch,
    handleClick(row) {
      const viewSearch = this.recursiveTreeSearch({
        treeData: this.permissionRoutes,
        attributeValue: row.referenceUuid,
        attributeName: 'meta',
        secondAttribute: 'uuid',
        attributeChilds: 'children'
      })

      if (viewSearch) {
        let recordUuid
        if (!this.isEmptyValue(row.uuidRecord)) {
          recordUuid = row.uuidRecord
        }
        let tabParent
        if (row.action === 'window') {
          tabParent = 0
        }

        this.$router.push({
          name: viewSearch.name,
          query: {
            action: recordUuid,
            tabParent
          }
        }, () => {})
      } else {
        this.$message({
          type: 'error',
          message: this.$t('notifications.noRoleAccess')
        })
      }
      // conditions for the registration amount (operador: row.criteria.whereClause)
    },
    filterResult(search) {
      const searchFilter = this.ignoreAccent(search.toLowerCase())
      return this.documents.filter(item => {
        return this.ignoreAccent(item.name)
          .toLowerCase()
          .includes(searchFilter)
      })
    },
    ignoreAccent(s) {
      if (!s) {
        return ''
      }
      return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    }
  }
}
