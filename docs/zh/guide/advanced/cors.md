# 跨域问题

平时被问到最多的问题还是关于跨域的，其实跨域问题真的不是一个很难解决的问题。这里我来简单总结一下我推荐的几种跨域解决方案。

我最推荐的也是我工作中在使用的方式就是： `cors` 全称为 Cross Origin Resource Sharing（跨域资源共享）。这种方案对于前端来说没有什么工作量，和正常发送请求写法上没有任何区别，工作量基本都在后端这里。每一次请求，浏览器必须先以 `OPTIONS` 请求方式发送一个预请求（也不是所有请求都会发送 options，展开介绍 [点我](https://adempiere.github.io/awesome-bookmarks/blog/cs.html#cors)），通过预检请求从而获知服务器端对跨源请求支持的 `HTTP` 方法。在确认服务器允许该跨源请求的情况下，再以实际的 `HTTP` 请求方法发送那个真正的请求。推荐的原因是：只要第一次配好了，之后不管有多少接口和项目复用就可以了，一劳永逸的解决了跨域问题，而且不管是开发环境还是正式环境都能方便的使用。详细 [MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)

但总有后端觉得麻烦不想这么搞，那纯前端也是有解决方案的。

在 `dev` 开发模式下可以下使用 webpack 的 `proxy` 使用也是很方便，参照 [文档](https://www.webpackjs.com/configuration/dev-server/#devserver-proxy) 就会使用了，楼主一些个人项目使用的该方法。但这种方法在生产环境是不能使用的。在生产环境中需要使用 `nginx` 进行反向代理。不管是 `proxy` 和 `nginx` 的原理都是一样的，通过搭建一个中转服务器来转发请求规避跨域的问题。

| 开发环境 | 生产环境 |
| :------: | -------- |
|   cors   | cors     |
|  proxy   | nginx    |

这里我只推荐这两种方式跨域，其它的跨域方式都还有很多但都不推荐，真心主流的也就这两种方式。
