<template>
  <div class="home">
    <div class="hero">
      <img v-if="data.heroImage" :src="$withBase(data.heroImage)" alt="hero">

      <h1>{{ data.heroText || $title || 'Hello' }}</h1>

      <p class="description">{{ data.tagline || $description || 'Welcome to your VuePress site' }}</p>

      <p class="action" v-if="data.actionText && data.actionLink">
        <NavLink class="action-button" :item="actionLink"/>
      </p>
    </div>

    <div class="features" :class="{isCN:isCN}" v-if="data.features && data.features.length">
      <div class="feature" v-for="(feature, index) in data.features" :key="index">
        <h2>{{ feature.title }}</h2>
        <p>{{ feature.details }}</p>
      </div>
    </div>

    <Content custom/>
    <div class="footer" v-if="data.footer">
      <p>ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution</p>
      <p>Copyright (C) 2017-Present ADempiere</p>
    </div>
  </div>
</template>

<script>
import NavLink from '@default-theme/NavLink.vue'
export default {
  components: { NavLink },
  computed: {
    isCN() {
      return this.$lang === 'zh-CN'
    },
    data() {
      return this.$page.frontmatter
    },
    actionLink() {
      return {
        link: this.data.actionLink,
        text: this.data.actionText
      }
    }
  },
  methods: {
    clickCoding(tag) {
      ga('send', 'click', 'e.coding', 'Action', tag)
    }
  }
}
</script>

<style lang="stylus">
@import '~@default-theme/styles/config.styl';

.home {
  padding: $navbarHeight 2rem 0;
  max-width: 960px;
  margin: 0px auto;

  .hero {
    text-align: center;

    >img {
      max-height: 280px;
      display: block;
      margin: 3rem auto 1.5rem;
    }

    h1 {
      font-size: 3rem;
    }

    h1, .description, .action {
      margin: 1.8rem auto;
    }

    .description {
      max-width: 35rem;
      font-size: 1.6rem;
      line-height: 1.3;
      color: lighten($textColor, 40%);
    }

    .action-button {
      display: inline-block;
      font-size: 1.2rem;
      color: #fff;
      background-color: $accentColor;
      padding: 0.8rem 1.6rem;
      border-radius: 4px;
      transition: background-color 0.1s ease;
      box-sizing: border-box;
      border-bottom: 1px solid darken($accentColor, 10%);

      &:hover {
        background-color: lighten($accentColor, 10%);
      }
    }
  }

  .features {
    border-top: 1px solid $borderColor;
    padding: 1.2rem 0;
    margin-top: 2.5rem;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: stretch;
    justify-content: space-between;
  }

  .feature {
    flex-grow: 1;
    flex-basis: 30%;
    max-width: 30%;

    h2 {
      font-size: 1.4rem;
      font-weight: 500;
      border-bottom: none;
      padding-bottom: 0;
      color: lighten($textColor, 10%);
    }

    p {
      color: lighten($textColor, 25%);
    }
  }

  .footer {
    padding: 1.5rem;
    border-top: 1px solid $borderColor;
    text-align: center;
    color: lighten($textColor, 25%);
  }
}

@media (max-width: $MQMobile) {
  .home {
    .features {
      flex-direction: column;
    }

    .feature {
      max-width: 100%;
      padding: 0 2.5rem;
    }
  }
}

@media (max-width: $MQMobileNarrow) {
  .home {
    padding-left: 1.5rem;
    padding-right: 1.5rem;

    .hero {
      img {
        max-height: 210px;
        margin: 2rem auto 1.2rem;
      }

      h1 {
        font-size: 2rem;
      }

      h1, .description, .action {
        margin: 1.2rem auto;
      }

      .description {
        font-size: 1.2rem;
      }

      .action-button {
        font-size: 1rem;
        padding: 0.6rem 1.2rem;
      }
    }

    .feature {
      h2 {
        font-size: 1.25rem;
      }
    }
  }
}
</style>
