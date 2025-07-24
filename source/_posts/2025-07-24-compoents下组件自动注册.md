---
title: compoents下组件自动注册
date: 2025-07-24 14:32:22
tags:
  - vite
  - vue-cli
categories: Vue # 分类
cover: /images/compoents下组件自动注册/cover.jpg # 封面图
---

**Vue 项目常用的构建工具：Vue-cli、Webpack、Vite**

### **** 构建工具是 vite ****

- 新建目录

![](/images/compoents下组件自动注册/vite_com.png)

- index.js

```javascript
// 自动注册全局组件components
import { defineAsyncComponent } from 'vue'
/**
 * @description 在src/components目录下创建文件，即 src/components/xxx.vue
 * @description 在src/components目录下创建目录及文件，即 src/components/xxx文件夹/xxx.vue
 */
const components = import.meta.glob('./**/**.vue')
export default function install(app) {
	for (const [key, value] of Object.entries(components)) {
		const name = key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'))
		app.component(name, defineAsyncComponent(value))
	}
}
```

- main.js

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import autoRegCom from '@/components/index.js'
const app = createApp(App)
app.use(router).use(autoRegCom).mount('#app')
```

- 直接使用

```html
<Header></Header>
<Footer></Footer>
```

### **** 构建工具不是 vite ****

- 新建目录

![](/images/compoents下组件自动注册/vue_com.png)

- index.js

```javascript
// 全局组件自动注册
export default {
	installCom(app) {
		// ('components文件夹下', '是否取子集', '正则匹配.vue结尾的的文件')
		const ctx = require.context('../components', true, /\.vue$/)
		// console.log('ctx:', ctx)
		if (ctx && ctx.keys()) {
			ctx.keys()?.forEach((item) => {
				const component = ctx(item).default
				let path = (item || component.__file)?.split('/')
				const componentName =
					path && path.length && path[path.length - 1].split('.')[0]
				// console.log(componentName, component)
				app.component(componentName, component)
			})
		}
	},
}
```

- main.js

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import autoRegCom from '@/components/index.js'
const app = createApp(App)
autoRegCom.installCom(app)
```

- 直接使用

```html
<Header></Header>
<Footer></Footer>
```
