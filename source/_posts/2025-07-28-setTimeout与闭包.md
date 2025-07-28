---
title: setTimeout与闭包
date: 2025-07-28 11:10:21
tags: setTimeout
categories: Javascript
cover: /images/setTimeout与闭包/cover.jpg # 封面图
---

```javascript
for (var i = 0; i < 5; i++) {
	setTimeout(function () {
		console.log(i)
	}, i * 1000)
}
```

- 问题：上述代码的输出结果是什么？如何修改代码使其按预期输出 0 到 4？

---

- 答案：输出结果是连续输出 5 个 5

- 原因：var 声明的变量没有块级作用域，setTimeout 中的回调函数会在循环结束(同步代码执行完成，异步队列开始轮训 setTimeout)后才执行，此时 i 的值已经变为 5

- 修改方案 1：可以使用 let 声明变量来解决这个问题，因为 let 有块级作用域，每个回调函数都会捕获到不同的 i 值

```javascript
// 修改后的代码
for (let i = 0; i < 5; i++) {
	setTimeout(function () {
		console.log(i)
	}, i * 1000)
}
```

- 修改方案 2：使用 setTimeout 的第三个参数，作为回调函数的参数传递进去，可以将当前 i 值传递给回调函数

```javascript
// 修改后的代码
for (var i = 0; i < 5; i++) {
	setTimeout(function (index) {
		console.log(index)
	}, i * 1000, i)
}
```

