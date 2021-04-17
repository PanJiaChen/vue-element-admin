// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Edwin Betancourt edwinBetanc0urt@hotmail.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

export default {
  name: 'RelationsMixin',
  computed: {
    relationsList() {
      let menuUuid = this.$route.params.menuParentUuid
      if (this.isEmptyValue(menuUuid)) {
        menuUuid = this.menuParentUuid
      }
      const relations = this.$store.getters.getRelations(menuUuid)
      if (!this.isEmptyValue(relations)) {
        if (!this.isEmptyValue(relations.children)) {
          return relations.children
        }
        if (relations.meta && !this.isEmptyValue(relations.meta.childs)) {
          return relations.meta.childs
        }
      }
      return []
    },
    isEmptyChilds() {
      const childs = this.relationsList
      const len = childs.length
      if (len < 1) {
        return true
      }
      if (len === 1) {
        // diferent to current view
        return childs[0].meta.uuid === this.$route.meta.uuid
      }
      return false
    }
  },
  methods: {
    getChilds(item) {
      if (!this.isEmptyValue(item.children)) {
        return item.children
      }
      if (item.meta && !this.isEmptyValue(item.meta.childs)) {
        return item.meta.childs
      }
      return []
    }
  }
}
