<!--<template>-->
<!--<div :style="{ cursor, userSelect }" class="vue-splitter-container clearfix" @mouseup="onMouseUp"-->
<!--@mousemove="onMouseMove">-->

<!--<Pane split="vertical" :style="{ width: percent+'%' }" class="left-container splitter-pane">-->
<!--orange-->
<!--</Pane>-->

<!--<Resizer split="vertical" :onMouseDown="onMouseDown" @click="onClick"></Resizer>-->
<!--<div class="todel" :style="{ width: 100-percent+'%'}">-->
<!--<Pane split="horizontal" class="top-container">-->
<!--<div slot>apple banana</div>-->
<!--</Pane>-->
<!--<Resizer split="horizontal" :onMouseDown="onMouseDown" @click="onClick"></Resizer>-->
<!--<Pane split="horizontal" class="bottom-container">-->
<!--<div slot>apple banana</div>-->
<!--</Pane>-->
<!--</div>-->

<!--</div>-->

<!--</template>-->
<style scoped>
    .clearfix:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }
    .vue-splitter-container {
        height: inherit;
        display: flex;
    }
</style>

<script>
     /* eslint-disable */
    import Resizer from './Resizer';
    import vue from 'vue'
    export default {
        name: 'splitPane',
        components: {Resizer},
        props: {
            margin: {
                type: Number,
                default: 10
            }
        },
        data () {
            return {
                active: false,
                percent: 50,
                hasMoved: false,
                panes: []
            }
        },
        props: {
            split: {
                validator: function (value) {
                    return ['vertical', 'horizontal'].indexOf(value) >= 0
                },
                required: true
            }
        },
        computed: {
            userSelect () {
                return this.active ? 'none' : ''
            },
            cursor () {
                return this.active ? 'col-resize' : ''
            },
//            $paneItems () {
//                return this.$children.filter(child => {
//                    console.log(child)
//                })
//            }
        },
        render(h){
            const temp = [];
            this.$slots.default.map((item, i) => {
                if (item.tag && item.tag.toUpperCase().indexOf('PANE') >= 0) {
                    temp.push(item)
                }
            });
            const newSlots = [];
            const length = temp.length;
            temp.map((item, index)=> {
                newSlots.push(item)
                if (index != length - 1) {
                    newSlots.push(
                            h('Resizer', {
                                props: {
                                    split: this.split,
                                    onMouseDown: this.onMouseDown
                                }
                            })
                    )
                }
            })
            return h('div', {
                on: {
                    mousemove: this.onMouseMove
                }
            }, [
                h('div', {
                    'class': {
                        'vue-splitter-container': true
                    },
                }, newSlots)
            ])
        },
//        beforeMount(){
//            this.$slots.default=this.$slots.default.map((item, i) => {
//                if (item.tag&&item.tag.toUpperCase().indexOf('PANE') >= 0) {
//                    return item
//                }else{
//                    return null
//                }
//            })
//
//        },
        created(){

        },
        mounted(){

        },
        methods: {
            onClick () {
                if (!this.hasMoved) {
                    this.percent = 50;
                    this.$emit('resize');
                }
            },
            onMouseDown () {
                this.active = true;
                this.hasMoved = false;
            },
            onMouseUp () {
                this.active = false;
            },
            onMouseMove (e) {
                if (e.buttons === 0 || e.which === 0) {
                    this.active = false;
                }
                if (this.active) {

                    let offset = 0;
                    let target = e.currentTarget;
                    while (target) {
                        offset += target.offsetLeft;
                        target = target.offsetParent;
                    }
                    const percent = Math.floor(((e.pageX - offset) / e.currentTarget.offsetWidth) * 10000) / 100;
                    if (percent > this.margin && percent < 100 - this.margin) {
                        this.percent = percent;
                    }
                    console.log(percent)
                    this.$children.map((v, i)=> {
                        if (i == 0) {
                            v.percent = percent
                        } else {
                            v.percent = 100 - percent
                        }

                    })
                    this.$emit('resize');
                    this.hasMoved = true;
                }
            }
        }
    }
</script>
