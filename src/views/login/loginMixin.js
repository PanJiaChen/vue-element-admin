import LangSelect from '@/components/LangSelect'

export default {
  name: 'MixinLogin',
  components: {
    LangSelect
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    pathRedirect(path = 'login') {
      this.$router.push({
        path
      }).catch(error => {
        console.info(`Login Mixin: ${error.name}, ${error.message}`)
      }, () => {})
    }
  }
}
