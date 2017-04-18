<template>
    <div class="errorpage-container"> 404
        <splitPane v-on:resize="resize" split="vertical">
            <template slot="paneL">
                <div class="left-container"></div>
            </template>
            <template slot="paneR">
                <splitPane split="horizontal">
                    <template slot="paneL">
                        <div class="top-container"></div>
                    </template>
                    <template slot="paneR">
                        <div class="bottom-container">
                        </div>
                    </template>
                </splitPane>
            </template>
        </splitPane>
    </div>
</template>


<script>
    import splitPane from 'components/SplitPane/SplitPane'
    export default {
      components: { splitPane },
      methods: {
        resize() {
          console.log('resize')
        }
      }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .errorpage-container{
        position: relative;
        height: 100vh;
    }
    .left-container {
        background-color: #F38181;
        height:100%;
    }

    .right-container {
        background-color: #FCE38A;
        height: 200px;
    }

    .top-container {
        background-color: #FCE38A;
        width: 100%;
        height: 100%;
    }

    .bottom-container {
        width: 100%;
        background-color: #95E1D3;
        height: 100%;

    }
</style>
