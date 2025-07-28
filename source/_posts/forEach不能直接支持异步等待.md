---
title: forEach不能直接支持异步等待?
date: 2025-07-14 11:59:44
tags:
  - forEach
  - async/await
---

#### forEach 的设计是同步执行回调函数：

- 不会等待 Promise 解决
- 会立即执行所有回调（即使回调中包含异步操作）
- 没有内置机制来处理异步操作的完成

```javascript
// delay是返回Promise的延迟函数
const delay = (times) => {
	return new Promise((resolve, rejected) => {
		setTimeout(() => {
			resolve()
		}, times)
	})
}
```

##### 示例对比：

1. 原始异步 forEach（不按顺序）

```javascript
[1, 2, 3].forEach(async (item) => {
	await delay(1000)
	console.log(item)
})
process() // 会几乎同时输出1, 2, 3
```

2. 修改后的同步执行版本

```javascript
async function process() {
	for (const item of [1, 2, 3]) {
		await delay(1000)
		console.log(item)
	}
}
process() // 会每隔1秒依次输出1, 2, 3
```

#### 注意事项

- 顺序执行异步操作会显著增加总执行时间
- 如果不需要顺序执行，Promise.all 可能是更好的选择
- 在 Node.js 10+ 中，可以使用 for await...of 语法
- 选择哪种方法取决于你的具体需求，但通常 for...of 循环是最清晰易读的解决方案
