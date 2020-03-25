import LangSelect from '@/components/LangSelect'

export const loginMixin = {
  name: 'loginMixin',
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
    pathRedirect(path) {
      this.$router.push({
        path
      })
    }
  }
}
