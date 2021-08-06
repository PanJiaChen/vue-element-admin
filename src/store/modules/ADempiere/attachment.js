import { requestAttachment } from '@/api/ADempiere/user-interface.js'

const initStateAttachment = {
  listAttachment: []
}

const attachment = {
  state: initStateAttachment,
  mutations: {
    setListAttachment(state, payload) {
      state.listAttachment = payload
    }
  },
  actions: {
    attachments({ commit }, {
      tableName,
      recordId,
      recordUuid
    }) {
      requestAttachment({
        tableName,
        recordId,
        recordUuid
      })
        .then(response => {
          const list = response.resource_references_list.map(file => {
            return {
              name: file.file_name,
              type: file.content_type,
              description: file.description,
              size: file.file_size,
              uuid: file.resource_uuid,
              text: file.text_msg
            }
          })
          commit('setListAttachment', list)
        })
    }
  },
  getters: {
    getListAttachment: (state) => {
      return state.listAttachment
    }
  }
}

export default attachment
