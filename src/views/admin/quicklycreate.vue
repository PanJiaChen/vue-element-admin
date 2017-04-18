<template>
    <div class="app-container quicklyCreateUser-container">
        <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="60px">
            <el-card style=" margin-top: 50px;width: 600px;">
                <div slot="header" class="clearfix">
                    <el-row :gutter="20">
                        <el-col :span="20">
                            <el-form-item label="昵称" prop="display_name">
                                <el-input v-model="form.display_name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="success" @click="onSubmit">立即创建</el-button>
                        </el-col>
                    </el-row>
                </div>
                <el-row>
                    <el-col :span="12">
                        <el-button style="height: 150px;width: 150px;" @click="handleImagecropper" type="primary">上传头像
                        </el-button>
                    </el-col>
                    <el-col :span="12">
                        <img style=" float:right;width: 150px;height: 150px;border-radius: 50%;margin-left: 50px;"
                             :src="form.image">
                    </el-col>
                </el-row>
            </el-card>
        </el-form>


        <el-tooltip style="position: absolute;margin-left: 750px;top: 380px" placement="top">
            <el-button>Tooltip</el-button>
            <div slot="content">昵称为必填项<br/><br/>一键创建只能创建后台虚拟账号<br/><br/>没有任何实际操作能力</div>
        </el-tooltip>

        <ImageCropper field="img"
                      :width="300"
                      :height="300"
                      url="/upload"
                      @crop-upload-success="cropSuccess"
                      :key="imagecropperKey"
                      v-show="imagecropperShow">

        </ImageCropper>
    </div>
</template>
<script>
    import { createNewUser } from 'api/adminUser';
    import ImageCropper from 'components/ImageCropper';

    export default{
      name: 'quicklyCreateUser',
      components: { ImageCropper },
      data() {
        return {
          form: {
            display_name: '',
            image: '',
            role: ['virtual_editor']
          },
          imagecropperShow: false,
          imagecropperKey: 0,
          rules: {
            display_name: [{ required: true, message: '昵称必填', trigger: 'blur' }]
          }
        }
      },
      methods: {
        onSubmit() {
          this.$refs.form.validate(valid => {
            if (valid) {
              createNewUser(this.form).then(() => {
                this.$message.success('创建成功')
              });
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        handleImagecropper() {
          this.imagecropperShow = true;
          this.imagecropperKey = this.imagecropperKey + 1;
        },
        cropSuccess(url) {
          this.imagecropperShow = false;
          this.form.image = url
        }
      }
    }
</script>

