<template>
  <div class="user-card-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户卡片展示</span>
      </div>
      <div class="page-description">
        <p>这是一个可复用的用户信息卡片组件演示页面，展示了两个不同用户的数据。</p>
        <p>点击"关注"按钮可以切换状态，并在控制台打印触发信息。</p>
      </div>
      <div class="card-grid">
        <UserCard
          v-for="user in userList"
          :key="user.id"
          :name="user.name"
          :avatar="user.avatar"
          :role="user.role"
          :on-follow="handleFollow"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import UserCard from '@/components/UserCard'

export default {
  name: 'UserCardDemo',
  components: { UserCard },
  data() {
    return {
      userList: [
        {
          id: 1,
          name: '张三',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          role: '管理员'
        },
        {
          id: 2,
          name: '李四',
          avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          role: '编辑'
        },
        {
          id: 3,
          name: '王五',
          avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          role: ''
        }
      ]
    }
  },
  methods: {
    handleFollow(name) {
      console.log(`关注了用户: ${name}`)
      this.$message({
        message: `您已${this.isUserFollowed(name) ? '关注' : '取消关注'}: ${name}`,
        type: 'success'
      })
    },
    isUserFollowed(name) {
      return true
    }
  }
}
</script>

<style scoped lang="scss">
.user-card-page {
  padding: 20px;

  .page-description {
    margin-bottom: 24px;
    color: #606266;
    line-height: 1.6;

    p {
      margin: 8px 0;
    }
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media screen and (max-width: 768px) {
  .user-card-page {
    padding: 12px;

    .card-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
}
</style>
