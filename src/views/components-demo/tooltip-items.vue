<template>
  <div class="components-container">
    <el-card class="box-card">
      <el-row :gutter="10">
        <el-col :span="6">
          <tooltip-item label="申请人：" content="张三，李四，王二，张伟，大鹏，小雕" />
        </el-col>
        <el-col :span="6">
          <tooltip-item label="发明人：" content="张三，李四，王二" />
        </el-col>
        <el-col :span="6">
          <tooltip-item label="申请日期：" content="2020-07-08" />
        </el-col>
        <el-col :span="6">
          <tooltip-item label="IPC分类号：" :label-width="92" content="DC12312312412312312412314124" />
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <tooltip-item label="地址：" content="上海市徐汇区上海市徐汇区上海市徐汇区上海市徐汇区上海市徐汇区" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import TooltipItem from '@/components/TooltipItem'
export default {
  name: 'TooltipItems',
  components: { TooltipItem }
}
</script>

<style scoped />
