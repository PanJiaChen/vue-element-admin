##vue-element-admin
vue+element+axios 的管理后台 [线上地址](http://panjiachen.github.io/vue-element-admin)

这半年来一直在用vue写管理后台，目前后台已经有七十多个页面，十几种权限，但维护成本依然很低，效率依然很高。这半年来积累了不少的后台开发经验，所以准备开源分享一下。

### 功能
- [x] 登录/注销
- [x] 权限验证
- [x] 侧边栏
- [x] 面包屑
- [x] 富文本编辑器
- [x] Markdown编辑器
- [x] JSON编辑器
- [x] 列表拖拽
- [x] SplitPane
- [x] Dropzone
- [x] Sticky
- [x] CountTo
- [x] echarts图表
- [x] 401，401错误页面
- [x] 错误日志
- [x] 导出excel
- [x] table example
- [x] form example
- [x] 多环境发布
- [x] dashboard
- [x] 二次登录
- [x] 动态侧边栏
- [x] mock


### 开发
```bash
    # 克隆项目
    git clone https://github.com/PanJiaChen/vue-element-admin.git   
    
    # 安装依赖
    npm install
    
    # 本地开发 开启服务，浏览器访问 http://localhost:9527
    npm run build
```
### 发布
```bash
    # 发布测试环境 带webpack ananalyzer
    npm run build:sit-preview
    
    # 构建生成环境
    npm run build:prod
```

## 效果图

#### 两步验证登录 支持微信和qq

![两步验证 here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/2login.gif)

#### 真正的动态换肤

![真正的动态换肤](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/theme.gif)

#### 可收起侧边栏

![enter image description here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/leftmenu.gif)

#### 拖拽排序

![enter image description here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/order.gif)

#### 上传裁剪头像

![enter image description here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/uploadAvatar.gif)

#### 错误统计

![enter image description here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/errorlog.png)

#### 富文本(整合七牛 打水印等个性化功能)

![enter image description here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/editor.gif)

#### 封装table组件

![enter image description here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/table.gif)

#### 图表

![enter image description here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/echarts.gif)

#### 导出excel

![enter image description here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/excel.png)

等等很多，尽请期待！
