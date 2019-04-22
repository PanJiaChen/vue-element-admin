<template>
  <div class="app-container">
    <el-form v-if="user" :model="user">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card>
            <div class="user-profile">
              <div class="user-avatar box-center">
                <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false" />
              </div>
              <div class="box-center">
                <div class="user-name text-center">{{ user.name }}</div>
                <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>
              </div>
              <div class="box-social">
                <el-table :data="social" :show-header="false">
                  <el-table-column
                    prop="name"
                    label="Name"
                  />
                  <el-table-column label="Count" align="left" width="100">
                    <template slot-scope="scope">
                      {{ scope.row.count | toThousandFilter }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="user-follow">
                <el-button type="primary" style="width: 100%;">Follow</el-button>
              </div>
            </div>
          </el-card>
          <el-card class="box-card user-bio">
            <div slot="header" class="clearfix">
              <span>About me</span>
            </div>
            <div class="user-education user-bio-section">
              <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>Education</span></div>
              <div class="user-bio-section-body">
                <div class="text-muted">
                  B.S. in Computer Science from the University of Technology
                </div>
              </div>
            </div>
            <div class="user-skills user-bio-section">
              <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>Skills</span></div>
              <div class="user-bio-section-body">
                <div class="progress-item">
                  <span>Vue</span>
                  <el-progress :percentage="70" />
                </div>
                <div class="progress-item">
                  <span>JavaScript</span>
                  <el-progress :percentage="18" />
                </div>
                <div class="progress-item">
                  <span>Css</span>
                  <el-progress :percentage="12" />
                </div>
                <div class="progress-item">
                  <span>ESLint</span>
                  <el-progress :percentage="100" status="success" />
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="18">
          <el-card>
            <el-tabs v-model="activeActivity" @tab-click="handleClick">
              <el-tab-pane label="Activity" name="first">
                <div class="user-activity">
                  <div class="post">
                    <div class="user-block">
                      <img class="img-circle" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDkaQO69Fro8SZLTVZQ75JH2R0T-sn5yIA_lKGwvvgQ0R0BoQtUQ" alt="user image">
                      <span class="username text-muted">
                        <a href="#">Iron Man</a>
                        <a href="#" class="pull-right btn-box-tool"><i class="fa fa-times" /></a>
                      </span>
                      <span class="description">Shared publicly - 7:30 PM today</span>
                    </div>
                    <p>
                      Lorem ipsum represents a long-held tradition for designers,
                      typographers and the like. Some people hate it and argue for
                      its demise, but others ignore the hate as they create awesome
                      tools to help create filler text for everyone from bacon lovers
                      to Charlie Sheen fans.
                    </p>
                    <ul class="list-inline">
                      <li><a href="#" class="link-black text-sm"><i class="el-icon-share" /> Share</a></li>
                      <li><a href="#" class="link-black text-sm"><svg-icon icon-class="like" /> Like</a></li>
                      <li class="pull-right">
                        <a href="#" class="link-black text-sm"><svg-icon icon-class="comment" /> Comments
                          (5)</a></li>
                    </ul>
                    <el-input v-model="input.comment1" placeholder="Type a comment" />
                  </div>
                  <div class="post">
                    <div class="user-block">
                      <img class="img-circle" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMMN-8f9CQQ3MKJpboBJIqaiJ2Wus2Tf4w_vx9STtalxrY3qGJ" alt="user image">
                      <span class="username text-muted">
                        <a href="#">Captain American</a>
                        <a href="#" class="pull-right btn-box-tool"><i class="fa fa-times" /></a>
                      </span>
                      <span class="description">Sent you a message - yesterday</span>
                    </div>
                    <p>
                      Lorem ipsum represents a long-held tradition for designers,
                      typographers and the like. Some people hate it and argue for
                      its demise, but others ignore the hate as they create awesome
                      tools to help create filler text for everyone from bacon lovers
                      to Charlie Sheen fans.
                    </p>
                    <el-input v-model="input.reply" placeholder="Response">
                      <el-button slot="append">Send</el-button>
                    </el-input>
                  </div>
                  <div class="post">
                    <div class="user-block">
                      <img class="img-circle img-bordered-sm" src="https://cdn3.iconfinder.com/data/icons/movies-3/32/daredevil-superhero-marvel-comics-mutant-avatar-512.png" alt="User Image">
                      <span class="username">
                        <a href="#">Daredevil</a>
                        <a href="#" class="pull-right btn-box-tool"><i class="fa fa-times" /></a>
                      </span>
                      <span class="description">Posted 4 photos - 2 days ago</span>
                    </div>
                    <div class="user-images">
                      <el-carousel :interval="6000" type="card" height="200px">
                        <el-carousel-item v-for="item in carouselImages" :key="item">
                          <img :src="item" class="image">
                        </el-carousel-item>
                      </el-carousel>
                    </div>
                    <ul class="list-inline">
                      <li><a href="#" class="link-black text-sm"><i class="el-icon-share" /> Share</a></li>
                      <li><a href="#" class="link-black text-sm"><svg-icon icon-class="like" /> Like</a></li>
                      <li class="pull-right">
                        <a href="#" class="link-black text-sm"><svg-icon icon-class="comment" /> Comments
                          (5)</a></li>
                    </ul>
                    <el-input v-model="input.comment2" placeholder="Type a comment" />
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="second">
                <div class="block">
                  <el-timeline>
                    <el-timeline-item timestamp="2019/4/20" placement="top">
                      <el-card>
                        <h4>Update Github template</h4>
                        <p>PanJiaChen committed 2019/4/20 20:46</p>
                      </el-card>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2019/4/21" placement="top">
                      <el-card>
                        <h4>Update Github template</h4>
                        <p>PanJiaChen committed 2019/4/21 20:46</p>
                      </el-card>
                      <el-card>
                        <h4>Update Github template</h4>
                        <p>PanJiaChen committed 2019/4/21 21:16</p>
                      </el-card>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2019/4/22" placement="top">
                      <el-card>
                        <h4>Deploy <a href="https://Panjiachen.github.io/vue-element-admin/" target="_blank">vue-template-admin</a></h4>
                        <p>PanJiaChen deployed 2019/4/22 10:23</p>
                      </el-card>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </el-tab-pane>
              <el-tab-pane v-loading="updating" label="Account" name="third">
                <el-form-item label="Name">
                  <el-input v-model="user.name" />
                </el-form-item>
                <el-form-item label="Email">
                  <el-input v-model="user.email" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">Update</el-button>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'EditUser',
  components: { PanThumb },
  data() {
    return {
      user: null,
      social: [
        {
          'name': 'Followers',
          'count': 1235
        },
        {
          'name': 'Following',
          'count': 23512
        },
        {
          'name': 'Friends',
          'count': 7242
        }
      ],
      activeActivity: 'first',
      carouselImages: [
        'https://cdn.laravue.dev/photo1.jpg',
        'https://cdn.laravue.dev/photo2.jpg',
        'https://cdn.laravue.dev/photo3.jpg',
        'https://cdn.laravue.dev/photo4.jpg'
      ],
      updating: false,
      input: {
        comment1: '',
        comment2: '',
        reply: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    },
    handleClick(tab, event) {
      console.log('Switching tab ', tab, event)
    },
    onSubmit() {
      this.updating = true
      setTimeout(() => {
        this.$message({
          message: 'User information has been updated successfully',
          type: 'success',
          duration: 5 * 1000
        })
        this.updating = false
      }, 1000)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.user-profile {
  .user-name {
    font-weight: bold;
  }
  .box-center {
    padding-top: 10px;
  }
  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }
  .box-social {
    padding-top: 30px;
    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }
  .user-follow {
    padding-top: 20px;
  }
}
.user-bio {
  margin-top: 20px;
  color: #606266;
  span {
    padding-left: 4px;
  }
  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;
    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
.user-activity {
  .user-block {
    .username, .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }
    img {
      width: 40px;
      height: 40px;
      float: left;
    }
    :after {
      clear: both;
    }
    .img-circle {
      border-radius: 50%;
      border: 2px solid #d2d6de;
      padding: 2px;
    }
    span {
      font-weight: 500;
      font-size: 12px;
    }
  }
  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;
    .image {
      width: 100%;
    }
    .user-images {
      padding-top: 20px;
    }
  }
  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;
    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }
    .link-black {
      &:hover, &:focus {
        color: #999;
      }
    }
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
}

 .box-center {
  margin: 0 auto;
  display: table;
}
.text-muted {
  color: #777;
}
.pull-right {
  float: right !important;
}
</style>
