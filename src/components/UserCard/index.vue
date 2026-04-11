<template>
  <div class="user-card">
    <div class="card-content">
      <img :src="avatar" :alt="name" class="avatar">
      <div class="user-info">
        <div class="name-row">
          <span class="name">{{ name }}</span>
          <el-tag v-if="role" size="small" type="success" class="role-tag">{{ role }}</el-tag>
        </div>
        <el-button
          :type="isFollowed ? 'success' : 'primary'"
          size="small"
          class="follow-btn"
          @click="handleFollow"
        >
          {{ isFollowed ? '已关注' : '关注' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: ''
    },
    onFollow: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      isFollowed: false
    }
  },
  methods: {
    handleFollow() {
      this.isFollowed = !this.isFollowed
      if (this.onFollow && typeof this.onFollow === 'function') {
        this.onFollow(this.name)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.user-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .card-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e4e7ed;
    flex-shrink: 0;
  }

  .user-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  .name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .name {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }

  .role-tag {
    flex-shrink: 0;
  }

  .follow-btn {
    align-self: flex-start;
  }
}

@media screen and (max-width: 768px) {
  .user-card {
    padding: 16px;

    .card-content {
      flex-direction: column;
      text-align: center;
    }

    .avatar {
      width: 80px;
      height: 80px;
    }

    .user-info {
      width: 100%;
      align-items: center;
    }

    .name-row {
      justify-content: center;
    }

    .follow-btn {
      align-self: center;
      width: 100%;
    }
  }
}
</style>
