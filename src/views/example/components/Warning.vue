<template>
  <aside>
    Creating and editing pages cannot be cached by keep-alive because keep-alive include does not currently support
    caching based on routes, so it is currently cached based on component name. If you want to achieve a similar caching
    effect, you can use a browser caching scheme such as localStorage. Or do not use keep-alive include to cache all
    pages directly. See details
    <a
      href="https://panjiachen.github.io/vue-element-admin-site/guide/essentials/tags-view.html"
      target="_blank"
    >Document</a>
  </aside>
</template>

