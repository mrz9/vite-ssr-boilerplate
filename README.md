# vite-ssr-boilerplate
vite vue nodejs ssr boilerplate
### `.env`文件说明[参考](https://cn.vitejs.dev/guide/env-and-mode.html#env-files)
为了防止意外地将一些环境变量泄漏到客户端，只有以 VITE_ 为前缀的变量才会暴露给经过 vite 处理的代码。例如下面这个文件中：
```
DB_PASSWORD=foobar
VITE_SOME_KEY=123
```
只有 VITE_SOME_KEY 会被暴露为 import.meta.env.VITE_SOME_KEY 提供给客户端源码，而 DB_PASSWORD 则不会。
>>> 由于任何暴露给 Vite 源码的变量最终都将出现在客户端包中，VITE_* 变量应该不包含任何敏感信息。

### express 路由
`server/controller`目录下的文件会自动注册为express路由，路由前缀为`/api`
```
# server/controller
- common/index.ts             // 最终生成的路由为 /api/common
- config/env/index.ts         // 最终生成的路由为 /api/config/env
```