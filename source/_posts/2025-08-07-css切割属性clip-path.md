---
title: css切割属性clip-path
date: 2025-08-07 15:46:30
tags: css
categories: css
cover: /images/css切割属性clip-path/cover.jpg # 封面图
---

### clip-path 属性切割图形

```css
.clipped-element {
	width: 300px;
	height: 200px;
	background-color: rgb(232, 53, 53);
	/* 切割 clip-path */

	clip-path: none | circle | ellipse | inset | polygon | path('d');
	/* 1、默认值none, 不切割 */
	clip-path: none;

	/* 2、圆形 circle(radius at position) */
	/* 默认 (以中心为圆心，元素短边的一半为半径)*/
	clip-path: circle();
	/* 切割一个以(10px, 30px)为圆心、半径为50px的圆，超出部分不可见，position的值：left、right、top、bottom、 x% y% 、x y */
	clip-path: circle(50px at 10px 30px);

	/* 3、椭圆 ellipse(rx ry at position) */
	clip-path: ellipse(

	); /* 默认切割一个椭圆(以中心为中心，元素的两边长各一半为x和y方向的半径) */
	clip-path: ellipse(50% 50% at left 50%);

	/* 4、矩形 inset(top right bottom left round radius) */
	clip-path: inset(20px 30px 40px 50px);

	/* 5、多边形 polygon(x1 y1, x2 y2, ...)，x 和 y 分别是顶点的水平和垂直坐标，可以使用长度值或百分比 */
	clip-path: polygon(0 0, 50% 0, 100% 30%, 70% 100%, 0 50%);

	/* 6、path('d')，d 是 SVG 路径的描述字符串，使用 SVG 路径数据来创建剪切区域，灵活性更高，可以创建复杂的形状 */
	clip-path: path(
		'M140 20C73 20 20 74 20 140c0 135 136 170 228 303 88-132 229-173 229-303 0-66-54-120-120-120-48 0-90 28-109 69-19-41-60-69-108-69z'
	);
}
```

### 示例 1

- 效果
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<style>
		:root {
			--clicp-width: 50px; /* 剪切区域宽度 */
			--elem-padding: 10px; /* 元素内边距 */
			--active-bg-color: #6f3ce7;
		}
		.clippedBox {
			display: flex;
			position: relative;
			margin: 30px;
		}
		.clipped-element1,
		.clipped-element2,
		.clipped-element3 {
			width: 260px;
			height: 70px;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			background-color: #999;
			position: relative;
			color: white;
			font-weight: bold;
			justify-content: center;
		}
		/* 内边距 */
		.clipped-element1 {
			padding: 0 calc(var(--elem-padding) + var(--clicp-width)) 0 var(--elem-padding);
		}
		.clipped-element2 {
			margin: 0 calc(calc(var(--clicp-width) - 10px) * -1);
			padding: 0 calc(var(--elem-padding) + var(--clicp-width));
		}
		.clipped-element3 {
			padding: 0 var(--elem-padding) 0 calc(var(--elem-padding) + var(--clicp-width));
		}
		/* 第一个元素 */
		.clipped-element1 {
			border-radius: 10px 0 0 10px;
			clip-path: polygon(
				0 0,
				calc(100% - var(--clicp-width)) 0,
				100% 50%,
				calc(100% - var(--clicp-width)) 100%,
				0 100%
			);
		}
		/* 第二个元素 */
		.clipped-element2 {
			clip-path: polygon(
				0 0,
				calc(100% - var(--clicp-width)) 0,
				100% 50%,
				calc(100% - var(--clicp-width)) 100%,
				0 100%,
				var(--clicp-width) 50%
			);
		}
		/* 第三个元素 */
		.clipped-element3 {
			border-radius: 0 10px 10px 0;
			clip-path: polygon(
				0 0,
				100% 0,
				100% 100%,
				0 100%,
				var(--clicp-width) 50%
			);
		}
		/* 添加悬停效果 */
		.clipped-element1:hover,
		.clipped-element2:hover,
		.clipped-element3:hover {
			background-color: var(--active-bg-color);
			transform: scale(1.02);
			transition: all 0.3s ease;
		}
	</style>
</head>
<body>
	<div class="clippedBox">
		<div class="clipped-element1" onclick="clinkBtn(event)">未开始</div>
		<div class="clipped-element2" onclick="clinkBtn(event)">进行中</div>
		<div class="clipped-element3" onclick="clinkBtn(event)">已完成</div>
	</div>
</body>
<script>
	function clinkBtn(event) {
		const target = event.target
		if (target.classList.contains('clipped-element1')) {
			alert('未开始')
		} else if (target.classList.contains('clipped-element2')) {
			alert('进行中')
		} else if (target.classList.contains('clipped-element3')) {
			alert('已完成')
		}
	}
</script>
</html>

- 代码

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<style>
			:root {
				--clicp-width: 50px; /* 剪切区域宽度 */
				--elem-padding: 10px; /* 元素内边距 */
				--active-bg-color: #6f3ce7;
			}
			.clippedBox {
				display: flex;
				position: relative;
				margin: 30px;
			}
			.clipped-element1,
			.clipped-element2,
			.clipped-element3 {
				width: 260px;
				height: 70px;
				display: flex;
				align-items: center;
				box-sizing: border-box;
				background-color: #999;
				position: relative;
				color: white;
				font-weight: bold;
				justify-content: center;
			}
			/* 内边距 */
			.clipped-element1 {
				padding: 0 calc(var(--elem-padding) + var(--clicp-width)) 0 var(
						--elem-padding
					);
			}
			.clipped-element2 {
				margin: 0 calc(calc(var(--clicp-width) - 10px) * -1);
				padding: 0 calc(var(--elem-padding) + var(--clicp-width));
			}
			.clipped-element3 {
				padding: 0 var(--elem-padding) 0 calc(
						var(--elem-padding) + var(--clicp-width)
					);
			}
			/* 第一个元素 */
			.clipped-element1 {
				border-radius: 10px 0 0 10px;
				clip-path: polygon(
					0 0,
					calc(100% - var(--clicp-width)) 0,
					100% 50%,
					calc(100% - var(--clicp-width)) 100%,
					0 100%
				);
			}
			/* 第二个元素 */
			.clipped-element2 {
				clip-path: polygon(
					0 0,
					calc(100% - var(--clicp-width)) 0,
					100% 50%,
					calc(100% - var(--clicp-width)) 100%,
					0 100%,
					var(--clicp-width) 50%
				);
			}
			/* 第三个元素 */
			.clipped-element3 {
				border-radius: 0 10px 10px 0;
				clip-path: polygon(
					0 0,
					100% 0,
					100% 100%,
					0 100%,
					var(--clicp-width) 50%
				);
			}
			/* 添加悬停效果 */
			.clipped-element1:hover,
			.clipped-element2:hover,
			.clipped-element3:hover {
				background-color: var(--active-bg-color);
				transform: scale(1.02);
				transition: all 0.3s ease;
			}
		</style>
	</head>
	<body>
		<div class="clippedBox">
			<div class="clipped-element1" onclick="clinkBtn(event)">未开始</div>
			<div class="clipped-element2" onclick="clinkBtn(event)">进行中</div>
			<div class="clipped-element3" onclick="clinkBtn(event)">已完成</div>
		</div>
	</body>
	<script>
		function clinkBtn(event) {
			const target = event.target
			if (target.classList.contains('clipped-element1')) {
				alert('未开始')
			} else if (target.classList.contains('clipped-element2')) {
				alert('进行中')
			} else if (target.classList.contains('clipped-element3')) {
				alert('已完成')
			}
		}
	</script>
</html>
```

### 示例 2

- 效果
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<style>
		.imgError {
				background-color: #ededed;
			border-radius: 10px;
				position: relative;
			width: 600px;
			height: 360px;
			margin: 30px;
			overflow: hidden;
		}
			.clipped1, .clipped2 {
				position: absolute;
				top: 0;
				left: 0;
			width: 100%;
			height: 100%;
				background-color: rgba(95, 74, 254, 0.283);
				mask: linear-gradient(to left, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.2));
			}
		.clipped1 {
			clip-path: ellipse(33% 40% at 31.5% 110%);
		}
		.clipped2 {
			clip-path: ellipse(55% 60% at 96% 110%);
		}
		.clipped3 {
				position: absolute;
				top: 0;
				left: 0;
			width: 100%;
			height: 100%;
			background-color: rgb(249, 88, 70);
			clip-path: circle(45px at 30% 20%);
				/* mask: linear-gradient(to left, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.8)); */
		}
	</style>
</head>
<body>
	<div class="imgError">
		<div class="clipped1"></div>
		<div class="clipped2"></div>
		<div class="clipped3"></div>
	</div>
</body>
</html>

- 代码

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<style>
			.imgError {
				background-color: #ededed;
				border-radius: 10px;
				position: relative;
				width: 600px;
				height: 360px;
				margin: 30px;
				overflow: hidden;
			}
			.clipped1,
			.clipped2 {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(95, 74, 254, 0.283);
				mask: linear-gradient(to left, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.2));
			}
			.clipped1 {
				clip-path: ellipse(33% 40% at 31.5% 110%);
			}
			.clipped2 {
				clip-path: ellipse(55% 60% at 96% 110%);
			}
			.clipped3 {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: rgb(249, 88, 70);
				clip-path: circle(45px at 30% 20%);
				/* mask: linear-gradient(to left, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.8)); */
			}
		</style>
	</head>
	<body>
		<div class="imgError">
			<div class="clipped1"></div>
			<div class="clipped2"></div>
			<div class="clipped3"></div>
		</div>
	</body>
</html>
```
