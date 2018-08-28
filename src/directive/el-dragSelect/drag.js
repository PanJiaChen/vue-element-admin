// import Sortable from 'sortablejs'

// function setSort(el, binding) {
//   // import('sortablejs').then(excel => {

//   // })
//   // import
//   const d = el.querySelectorAll('.el-select__tags > span')[0]
//   const sortable = Sortable.create(d, {
//     ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
//     setData: function(dataTransfer) {
//       dataTransfer.setData('Text', '')
//       // to avoid Firefox bug
//       // Detail see : https://github.com/RubaXa/Sortable/issues/1012
//     },
//     onEnd: evt => {
//       console.log(binding)
//       // console.log(evt)
//       // const targetRow = this.value.splice(evt.oldIndex, 1)[0]
//       // this.value.splice(evt.newIndex, 0, targetRow)
//     }
//   })
// }

// export default{
//   bind(el, binding, vnode) {
//     console.log(binding)
//     setSort(el, binding)
//   }
// }
