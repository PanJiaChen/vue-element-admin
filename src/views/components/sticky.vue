<template>
  <div>
    <sticky className="sub-navbar">
      <el-dropdown trigger="click">
        <el-button>
          平台<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu class="no-border" slot="dropdown">
          <el-checkbox-group v-model="platforms" style="padding: 5px 15px;">
            <el-checkbox v-for="item in platformsOptions" :label="item.key" :key="item.key">
              {{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown trigger="click">
        <el-button>
          外链<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu class="no-padding no-border" style="width:300px" slot="dropdown">
          <el-input placeholder="请输入内容" v-model="url">
            <template slot="prepend">填写url</template>
          </el-input>
        </el-dropdown-menu>
      </el-dropdown>

      <div class="time-container">
        <el-date-picker v-model="time" type="datetime" :picker-options="pickerOptions" format="yyyy-MM-dd HH:mm:ss" placeholder="发布时间">
        </el-date-picker>
      </div>

      <el-button style="margin-left: 10px;" type="success">发布
      </el-button>
    </sticky>

    <div class="components-container">
      <code>Sticky header 当页面滚动到预设的位置会吸附在顶部</code>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
      <div>我是占位</div>
    </div>
  </div>
</template>


<script>
  import Sticky from 'components/Sticky';

  export default {
    components: { Sticky },
    data() {
      return {
        time: '',
        url: '',
        platforms: ['a-platform'],
        platformsOptions: [
            { key: 'a-platform', name: '平台A' },
            { key: 'b-platform', name: '平台B' },
            { key: 'c-platform', name: '平台C' }
        ],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        }
      }
    }
  };
</script>

<style scoped>
  .time-container {
    display: inline-block;
  }
</style>

