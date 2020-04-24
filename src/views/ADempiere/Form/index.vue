<template>
  <el-container
    v-if="isLoaded"
    key="form-loaded"
    class="view-base"
    style="height: 84vh;"
  >
    <el-header style="height: 39px;">
      <context-menu
        :menu-parent-uuid="$route.meta.parentUuid"
        :container-uuid="formUuid"
        :panel-type="panelType"
      />
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card
            class="content-collapse"
            :style="isEmptyValue(formMetadata.fieldList) ? 'height: 75vh !important;' : ''"
          >
            <h3 class="warn-content text-center">
              <el-popover
                v-if="!isEmptyValue(formMetadata.help)"
                ref="helpTitle"
                placement="top-start"
                :title="formTitle"
                width="400"
                trigger="hover"
              >
                <div v-html="formMetadata.help" />
              </el-popover>
              <el-button
                v-popover:helpTitle
                type="text"
                class="title text-center"
              >
                {{ formTitle }}
              </el-button>
            </h3>
            <form-panel
              :metadata="{
                ...formMetadata,
                title: formTitle
              }"
            />
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <div
    v-else
    key="form-loading"
    v-loading="!isLoaded"
    :element-loading-text="$t('notifications.loading')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="view-loading"
  />
</template>

<script>
import ContextMenu from '@/components/ADempiere/ContextMenu'
import FormPanel from '@/components/ADempiere/Form'

export default {
  name: 'FormView',
  components: {
    ContextMenu,
    FormPanel
  },
  data() {
    return {
      formUuid: this.$route.meta.uuid,
      formMetadata: {},
      isLoaded: false,
      panelType: 'form'
    }
  },
  computed: {
    formTitle() {
      return this.formMetadata.name || this.$route.meta.title
    },
    getterForm() {
      return this.$store.getters.getForm(this.formUuid)
    }
  },
  created() {
    this.getForm()
  },
  methods: {
    getForm() {
      const panel = this.getterForm
      if (panel) {
        this.formMetadata = panel
        this.isLoaded = true
      } else {
        this.$store.dispatch('getFormFromServer', {
          containerUuid: this.formUuid,
          routeToDelete: this.$rote
        })
          .then(responseForm => {
            this.formMetadata = responseForm
          })
          .finally(() => {
            this.isLoaded = true
          })
      }
    }
  }
}
</script>

<style>
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
  }
</style>
<style scoped >
  .view-base {
    height: 100%;
    min-height: calc(100vh - 84px);
  }

  .view-loading {
    padding: 100px 100px;
    height: 100%;
  }

  .title, .custom-title {
    color: #000;
    text-size-adjust: 20px;
    font-size: 100%;
    font-weight: 605 !important;
    /* left: 50%; */
  }

  .w-33 {
    width: 100%;
    background-color: transparent;
  }

  .warn-content {
    margin: 0px 0px !important;
    padding-top: 0px !important;
  }
  .content-help {
    width: 100%;
    height: 200%;
    padding-left: 39px !important;
  }
  .el-card {
    width: 100% !important;
    height: 200% !important;
  }
  .content-collapse {
    padding-left: 20 px !important;
    padding-top: 50 px !important;
  }

  .center{
    text-align: center;
  }
</style>
