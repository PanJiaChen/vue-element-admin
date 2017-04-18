<template>
    <div :class="classes">
        <slot></slot>
    </div>
</template>

<script>
    export default {
      name: 'Pane',
      props: {
//            split: {
//                validator: function (value) {
//                    return ['vertical', 'horizontal'].indexOf(value) >= 0
//                },
//                required: true
//            }
      },
//        computed:{
//            classes () {
//                return this.$parent.split
//            },
//        },
      data() {
        const classes = ['Pane', this.$parent.split, 'className'];
        return {
          classes: classes.join(' '),
          percent: 50
        }
      },
      created() {
//          console.log(this.$parent.split)
      },

      methods: {

      }
    }
</script>

<style>
    .splitter-pane.vertical.splitter-paneL{
        position: absolute;
        left: 0px;
        height: 100%;
    }
    .splitter-pane.vertical.splitter-paneR{
        position: absolute;
        right: 0px;
        height: 100%;
    }
    .splitter-pane.horizontal.splitter-paneL{
        position: absolute;
        top: 0px;
        width: 100%;
    }
    .splitter-pane.horizontal.splitter-paneR{
        position: absolute;
        bottom: 0px;
        width: 100%;
    }
</style>
