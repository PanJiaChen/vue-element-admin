<template>
    <div class="profile-container clearfix">
        <div style="position: relative;margin-left: 30px;">
            <PanThumb :image="avatar"> 你的权限:
                <span class="pan-info-roles" v-for="item in roles">{{item}}</span>
            </PanThumb>
            <el-button type="primary" icon="upload" style="position: absolute;bottom: 15px;margin-left: 40px;"
                       @click="handleImagecropper">修改头像
            </el-button>
        </div>
        <!--popover-->
        <el-popover
                ref="popoverWX"
                placement="top"
                width="160"
                trigger="click"
                v-model="popoverVisibleWX">
            <p>你确定要解绑么?</p>
            <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="popoverVisibleWX = false">取消</el-button>
                <el-button type="primary" size="mini" @click="handleUnbind('wechat')">确定</el-button>
            </div>
        </el-popover>
        <el-popover
                ref="popoverQQ"
                placement="top"
                width="160"
                trigger="click"
                v-model="popoverVisibleQQ">
            <p>你确定要解绑么?</p>
            <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="popoverVisibleQQ = false">取消</el-button>
                <el-button type="primary" size="mini" @click="handleUnbind('tencent')">确定</el-button>
            </div>
        </el-popover>
        <!--popover End-->

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="line-height: 36px;">个人资料</span>
            </div>
            <div class="box-item">
                <span class="field-label">昵称</span>
                <div class="field-content">
                    {{name}}
                    <el-button class="edit-btn" @click="handleEditName" type="primary" icon="edit"
                               size="small"></el-button>
                </div>
            </div>

            <div class="box-item">
                <span class="field-label">简介</span>
                <div class="field-content">
                    {{introduction.length==0?'未填写':introduction}}
                    <el-button class="edit-btn" @click="handleIntroductionName" type="primary" icon="edit"
                               size="small"></el-button>
                </div>
            </div>

            <div class="box-item" style="margin-bottom: 10px;">
                <span class="field-label">密码</span>
                <div class="field-content">
                    <el-button type="primary" @click="resetPSWdialogVisible=true">修改密码</el-button>
                </div>
            </div>

            <div class="box-item" style="margin-top: 5px;">
                <div class="field-content">
                    <span class="wx-svg-container"><wscn-icon-svg icon-class="weixin" class="icon"/></span>
                    <el-button class="unbind-btn" v-popover:popoverWX type="danger">解绑微信</el-button>
                </div>
            </div>

            <div class="box-item">
                <div class="field-content">
                    <span class="qq-svg-container"><wscn-icon-svg icon-class="QQ" class="icon"/></span>
                    <el-button class="unbind-btn" v-popover:popoverQQ style="padding: 10px 18px" type="danger">
                        解绑QQ
                    </el-button>
                </div>
            </div>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="line-height: 36px;">偏好设置</span>
                <el-button @click="updateSetting" style="float: right;margin-top: 5px;" size="small" type="success">
                    更新偏好
                </el-button>
            </div>
            <div>
                <div class="box-item">
                    <span class="field-label">文章平台默认项选择:</span>
                    <el-checkbox-group v-model="articlePlatform">
                        <el-checkbox label="wscn-platform">见闻</el-checkbox>
                        <el-checkbox label="gold-platform">黄金头条</el-checkbox>
                        <el-checkbox label="weex-platform">WEEX</el-checkbox>
                    </el-checkbox-group>
                    <span class="field-label">使用自定义主题:</span>
                    <el-switch
                        v-model="theme"
                        on-text=""
                        off-text="">
                    </el-switch>
                </div>
            </div>
        </el-card>


        <ImageCropper field="img"
                      :width="300"
                      :height="300"
                      url="/upload"
                      @crop-upload-success="cropSuccess"
                      :key="imagecropperKey"
                      v-show="imagecropperShow"></ImageCropper>

        <el-dialog title="昵称" v-model="nameDialogFormVisible">
            <el-form label-position="left" label-width="50px">
                <el-form-item label="昵称" style="width: 300px;">
                    <input class="input" ref="nameInput" :value="name" autocomplete="off" :maxlength=10>
                    <span>(最多填写十个字符)</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="nameDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="setName">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="简介" v-model="introductionDialogFormVisible">
            <el-form label-position="left" label-width="50px">
                <el-form-item label="简介" style="width: 500px;">
                    <textarea :row=3 class="textarea" ref="introductionInput" :value="introduction"></textarea>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="introductionDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="setIntroduction">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="提示" v-model="resetPSWdialogVisible" size="tiny">
            <span>你确定要重设密码么? <strong>&nbsp&nbsp&nbsp&nbsp&nbsp( 注:重设密码将会登出,请注意!!! )</strong></span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetPSWdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="resetPSW">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import { updateInfo, unbind, updateSetting } from 'api/adminUser';
    import ImageCropper from 'components/ImageCropper';
    import PanThumb from 'components/PanThumb';
    import { toggleClass } from 'utils'

    export default{
      components: { ImageCropper, PanThumb },
      data() {
        return {
          nameDialogFormVisible: false,
          introductionDialogFormVisible: false,
          resetPSWdialogVisible: false,
          popoverVisibleQQ: false,
          popoverVisibleWX: false,
          imagecropperShow: false,
          imagecropperKey: 0,
          articlePlatform: [],
          theme: false
        }
      },
      created() {
        if (this.setting.articlePlatform) {
          this.articlePlatform = this.setting.articlePlatform
        }
      },
      computed: {
        ...mapGetters([
          'name',
          'avatar',
          'email',
          'introduction',
          'roles',
          'uid',
          'setting'
        ])
      },
      watch: {
        theme() {
          toggleClass(document.body, 'custom-theme')
        //   this.$store.dispatch('setTheme', value);
        }
      },
      methods: {
        resetPSW() {
          this.$store.dispatch('LogOut').then(() => {
            this.$router.push({ path: '/sendpwd' })
          });
        },
        toggleResetDialog(state) {
          this.resetDialogVisible = state;
        },
        handleEditName() {
          this.nameDialogFormVisible = true;
        },
        handleIntroductionName() {
          this.introductionDialogFormVisible = true;
        },
        setName() {
          const displayName = this.$refs.nameInput.value;
          const data = {
            display_name: displayName,
            uid: this.uid
          };
          updateInfo(data).then(() => {
            this.$store.commit('SET_NAME', displayName);
            this.$notify({
              title: '成功',
              message: '昵称修改成功',
              type: 'success'
            });
          });
          this.nameDialogFormVisible = false;
        },
        setIntroduction() {
          const introduction = this.$refs.introductionInput.value;
          const data = {
            introduction,
            uid: this.uid
          };
          updateInfo(data).then(() => {
            this.$store.commit('SET_INTRODUCTION', introduction);
            this.$notify({
              title: '成功',
              message: '简介修改成功',
              type: 'success'
            });
          });
          this.introductionDialogFormVisible = false;
        },
        handleUnbind(unbindType) {
          const data = {
            unbind_type: unbindType
          };
          unbind(data).then(() => {
            this.$notify({
              title: '成功',
              message: '解绑成功,即将登出',
              type: 'success'
            });
            setTimeout(() => {
              this.$store.dispatch('LogOut').then(() => {
                this.$router.push({ path: '/login' })
              });
            }, 3000)
          });

          this.popoverVisibleQQ = false;
          this.popoverVisibleWX = false;
        },
        handleImagecropper() {
          this.imagecropperShow = true;
          this.imagecropperKey = this.imagecropperKey + 1;
        },
        cropSuccess(url) {
          this.imagecropperShow = false;
          const data = {
            image: url,
            uid: this.uid
          };
          updateInfo(data).then(() => {
            this.$store.commit('SET_AVATAR', url);
            this.$notify({
              title: '成功',
              message: '头像修改成功',
              type: 'success'
            });
          });
        },
        updateSetting() {
          const obj = Object.assign(this.setting, { articlePlatform: this.articlePlatform });
          updateSetting({ setting: JSON.stringify(obj) }).then(() => {
            this.$store.commit('SET_SETTING', this.setting);
            this.$notify({
              title: '成功',
              message: '更新偏好成功',
              type: 'success'
            });
          });
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .input {
        -moz-appearance: none;
        appearance: none;
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #bfcbd9;
        color: #1f2d3d;
        display: block;
        font-size: inherit;
        height: 36px;
        line-height: 1;
        padding: 3px 10px;
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        width: 100%;
    }

    .textarea {
        height: 90px;
        display: block;
        resize: vertical;
        padding: 5px 7px;
        line-height: 1.5;
        box-sizing: border-box;
        width: 100%;
        font-size: 14px;
        color: #1f2d3d;
        background-color: #fff;
        background-image: none;
        border: 1px solid #bfcbd9;
        border-radius: 4px;
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    }

    .icon {
        color: #fff;
        font-size: 30px;
        margin-top: 6px;
    }

    .wx-svg-container, .qq-svg-container {
        display: inline-block;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        padding-top: 1px;
        border-radius: 4px;
        margin-bottom: 10px;
        margin-right: 55px;
    }

    .wx-svg-container {
        background-color: #8dc349;
    }

    .qq-svg-container {
        background-color: #6BA2D6;
    }

    .unbind-btn {
        position: absolute;
        right: -60px;
        top: 2px;
    }

    .profile-container {
        padding: 20px;
        .box-card {
            width: 400px;
            margin: 30px;
            float: left;
            .field-label {
                font-size: 16px;
                font-weight: 700;
                line-height: 36px;
                color: #333;
                padding-right: 30px;
            }
            .box-item {
                .field-content {
                    display: inline-block;
                    position: relative;
                    cursor: pointer;
                    .edit-btn {
                        display: none;
                        position: absolute;
                        right: -50px;
                        top: -5px;
                    }
                }
                &:hover {
                    .edit-btn {
                        display: block;
                    }
                }
            }
        }
    }

    .pan-info-roles {
        font-size: 12px;
        font-weight: 700;
        color: #333;
        display: block;
    }
</style>
