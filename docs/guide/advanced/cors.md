# Cors

The most question be asked is still about `cross-domain` issues. In fact, the `cross-domain` issue is really not a very difficult question to solve. Here I will briefly summarize several `cross-domain` solutions I recommend.

The most recommended way is `cors`, full name is `Cross Origin Resource Sharing`. This solution does not make any difference to the front-end write request as usual. The workload is basically on the back-end. For each request, the browser must first send a pre-request as `OPTIONS`, to know the server-side HTTP method supported for cross-source requests. After confirming that the server allows the cross-source request, then send the real request with the actual HTTP request method. Details [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

The recommended reason is: as long as the first time is configured, no matter how many API interfaces and projects, they can be directly reused, and the cross-domain problem can be solved once and for all, and it can be conveniently used in both the development environment and the formal environment.

But there are always some back-end developers who think `cors` is too much `trouble`, they don't want to help the front end to solve cross-domain issues. That pure front-end is also has solutions.

In `dev` environment, you can use webpack `proxy`, it is also very easy to use。 It's recommended that you look at the [document](https://www.webpackjs.com/configuration/dev-server/#devserver-proxy) and we're not going to discuss it here. Some of the author's personal projects use this method

But this method can not used in the `production` environment. In `production` environment, you need to use `nginx` reverse proxy. Whether `proxy` or `nginx`, the principle is the same. Solve the cross-domain issues by building a transit server to forward requests.

| development | production |
| :---------: | ---------- |
|    cors     | cors       |
|    proxy    | nginx      |

Here I only recommend these two ways to cross-domain, there are many other cross-domain methods but not recommended.
