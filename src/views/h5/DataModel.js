/*
设计页面的数据结构
单个组件元素
单个页面
单个项目
*/

import createUUID from '@/utils/index.js'

const elementConfig = {
  elName: '',
  animations: [],
  // 对于一个元素会关注哪些定位属性
  commonStyle: {
    position: 'absolute',
    width: 30,
    height: 30,
    top: 200,
    left: 0,
    rotate: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    borderWidth: 0,
    borderColor: '',
    borderStyle: 'solid',
    borderRadius: 0,
    boxShadow: '',
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#000000',
    backgroundColor: '',
    backgroundImage: '',
    backgroundSize: 'cover',
    opacity: 1,
    zIndex: 1
  },
  events: [],
  propsValue: {} // 组件绑定属性
}

const pageConfig = {
  name: '',
  elements: [],
  commonStyle: {
    backgroundColor: '',
    backgroundImage: '',
    backgroundSize: 'cover'
  },
  config: {}
}

const projectConfig = {
  name: '',
  title: 'ccccc',
  description: '',
  coverImage: '',
  author: '',
  pages: [],
  script: '',
  width: 200,
  height: 200
}

// 获取组件的数据对象
const getElementConfig = function(element, extendStyle = {}) {
  const elementData = JSON.parse(JSON.stringify(element))
  // const type = elementData.valueType || 'String'
  // 字典类型
  // const dict = {
  //   'String': '',
  //   'Array': [],
  //   'Object': {},
  //   'Boolean': false,
  //   'Number': 0
  // }
  // 复制数据模版
  const elementConfigData = JSON.parse(JSON.stringify(elementConfig))
  // 在通用配置上根据组件名具体添加
  const config = {
    uuid: createUUID(),
    ...elementConfigData,
    elName: elementData.elName,
    propsvalue: JSON.parse(JSON.stringify(elementData.needProps))
  }
  // 处理样式
  // 样式来源有三种，可以实现松耦合，模版样式 | 组件自定义样式 | 拓展样式
  config.commonStyle = Object.assign({}, config.commonStyle, elementData.defaultStyle, extendStyle)
  // value,valueType暂时不知用处
  config.isForm = !!element.isForm
  return config
}

export default {
  elementConfig,
  pageConfig,
  projectConfig,
  getElementConfig
}
