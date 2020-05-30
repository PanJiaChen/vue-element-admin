<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" class="main-article" element-loading-text="Efforts to generate PDF">
    <div class="article-heading">
      <div class="article-heading-title">
        {{ article.title }}
      </div>
    </div>
    <div style="color: #ccc;">
      This article is from Evan You on <a target="_blank" href="https://medium.com/the-vue-point/plans-for-the-next-iteration-of-vue-js-777ffea6fabf">medium</a>
    </div>
    <div ref="content" class="node-article-content" v-html="article.content" />
  </div>
</template>

<script>

export default {
  data() {
    return {
      article: '',
      fullscreenLoading: true
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      import('./content.js').then(data => {
        const { title } = data.default
        document.title = title
        this.article = data.default
        setTimeout(() => {
          this.fullscreenLoading = false
          this.$nextTick(() => {
            window.print()
          })
        }, 3000)
      })
    }
  }
}
</script>

<style lang="scss">
@mixin clearfix {
  &::before {
    clear: both;
    content: '';
    display: table;
  }

  &::after {
    clear: both;
    content: '';
    display: table;
  }
}

.main-article {
  background: #fff;
  display: block;
  margin: 0 auto;
  padding: 20px;
  width: 740px;
}

.article-heading {
  overflow: hidden;
  padding: 0 0 20px;
  position: relative;
}

.article-heading-title {
  -webkit-box-orient: vertical;
  color: #333;
  display: block;
  display: -webkit-box;
  font-size: 32px;
  font-weight: 600;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  line-height: 48px;
  overflow: hidden;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.node-article-content {
  @include clearfix;
  color: #333;
  font-family: medium-content-serif-font, Georgia, Cambria, 'Times New Roman', Times, serif;
  font-size: 16px;
  letter-spacing: 0.5px;
  line-height: 28px;
  margin: 20px 0 0;
  margin-bottom: 30px;

  &> :last-child {
    margin-bottom: 0;
  }

  b,
  strong {
    font-weight: inherit;
    font-weight: bolder;
  }

  img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
  }

  p {
    font-size: 21px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: -0.003em;
    line-height: 1.58;

  }

  ul {
    margin-bottom: 30px;
  }

  li {
    --x-height-multiplier: 0.375;
    --baseline-multiplier: 0.17;
    font-size: 21px;
    font-style: normal;
    font-weight: 400;

    letter-spacing: 0.01rem;
    letter-spacing: -0.003em;
    line-height: 1.58;
    margin-bottom: 14px;
    margin-left: 30px;
  }

  a {
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.84) 100%, rgba(0, 0, 0, 0) 0);
    background-position: 0 calc(1em + 1px);
    background-repeat: repeat-x;
    background-size: 1px 1px;
    padding: 0 6px;
    text-decoration: none;
  }

  code {
    background: rgba(0, 0, 0, 0.05);
    display: inline-block;
    font-size: 16px;
    margin: 0 2px;
    padding: 3px 4px;
  }

  img {
    border: 0;
  }

  /* 解决 IE6-7 图片缩放锯齿问题 */
  img {
    -ms-interpolation-mode: bicubic;
  }

  blockquote {
    --x-height-multiplier: 0.375;
    --baseline-multiplier: 0.17;
    border-left: 3px solid rgba(0, 0, 0, 0.84);
    font-family: medium-content-serif-font, Georgia, Cambria, 'Times New Roman', Times, serif;
    font-size: 21px;
    font-style: italic;
    font-weight: 400;
    letter-spacing: 0.01rem;
    letter-spacing: -0.003em;
    line-height: 1.58;
    margin-left: -23px;
    padding-bottom: 2px;
    padding-left: 20px;
  }

  a {
    text-decoration: none;
  }

  h2,
  h3,
  h4 {
    font-size: 34px;
    letter-spacing: -0.015em;
    line-height: 1.15;
    margin: 53px 0 0;
  }

  h4 {
    font-size: 26px;
  }
}
</style>
