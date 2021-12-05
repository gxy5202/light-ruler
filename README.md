# light-ruler

[![oBz0Qe.png](https://s4.ax1x.com/2021/12/05/oBz0Qe.png)](https://imgtu.com/i/oBz0Qe)

![](https://img.shields.io/github/stars/gxy5202/light-ruler) ![](https://img.shields.io/github/package-json/v/gxy5202/light-ruler) ![](https://img.shields.io/github/v/release/gxy5202/light-ruler?display_name=tag&include_prereleases&sort=semver)

[DEMO](https://www.gomi.site/#/LightRuler "DEMO") / [Github](https://github.com/gxy5202/light-ruler "Github")

PS: This project was accomplished by refering to daybrush's project and I would like to extend my sincere thanks to him.
[daybrush's Github](https://github.com/daybrush/ruler "Github")

### 主要特性(Features)

-   使用 canvas 绘制，支持无限滚动，不会生成多个 DOM 和引起页面重绘
-   支持自定义标尺背景色、文字色、刻度色以及单位
-   支持 translate 模式，即首次 canvas 绘制标尺后，滚动通过 css transform 实现
-   使用 Typescript 编写，不依赖任何第三方库，打包后文件仅有 26kb(包含样式)
-   支持缩放刻度值
-   目前提供 2 种标尺主题样式
-   提供多实例控制器，可管理多个标尺实例

### 安装(Installation)

---

`npm i light-ruler`

### 使用(Useage)

---

-   基本使用

```javascript
import LightRuler from "light-ruler";

const ruler = new LightRuler({
    mode: "infinite",
    wrapperElement: document.getElementById("box"),
    scrollElement: document.getElementById("wrap"),
    rulerId: "my-ruler",
    width: 30000,
    height: 30000,
    style: {
        mode: "right",
    },
    onScroll: (x, y) => {
        console.log(x, y);
    },
});
```

-   React 使用

```javascript
import React, { useRef, useEffect } from "react";
import LightRuler from "light-ruler";

export default function () {
    const rulerRef = useRef(null);

    useEffect(() => {
        const ruler = new LightRuler({
            mode: "infinite",
            mountRef: rulerRef.current,
            scrollElement: document.getElementById("wrap"),
            rulerId: "ruler",
            width: 30000,
            height: 30000,
            onScroll: (x, y) => {
                console.log(x, y);
            },
        });
    }, []);
    return (
        <div id="root">
            <div id="box">
                <div id="wrap">...</div>
                <div id="ruler" ref={rulerRef}></div>
            </div>
        </div>
    );
}
```

-   Vue3 使用

```javascript
<template>
	<div id="gomi-homePage">
		<div
			id="box"
			:style="{ position: 'relative', width: '800px', height: '600px', overflow: 'hidden', background: 'red' }"
		>
			<div id="s" :style="{ width: '100%', height: '100%', overflow: 'auto' }">
				<div id="wrap" :style="{ width: '30000px', height: '4600px' }"></div>
			</div>
			<div id="ruler" ref="ruler"></div>
		</div>
		<footer>
		</footer>
	</div>
</template>

<script lang="ts">
import LightRuler from 'light-ruler';
import { onMounted, ref, defineComponent } from "vue";

export default defineComponent({
	name: "Home",
	props: {},
	setup: () => {
		const ruler = ref(null);
		onMounted(() => {
			const myRuler = new LightRuler({
				mountRef: ruler.value,
				mode: "infinite",
				scrollElement: "#s",
				rulerId: "hh",
				width: 30000,
				height: 30000,
				style: {
					mode: 'right'
				},
				onScroll: (x, y) => {
					console.log(x, y);
				},
			})
		});

		return {  ruler };
	},
});
</script>

<style scoped lang="scss">
</style>

```

> Tips: 由于标尺使用的 position: absolute， 所以包裹标尺的容器一定要设置 position 属性。
> 同时要使标尺固定不动，监听滚动的 element 不能是包裹标尺的 element

### 配置(Config)

---

| 名称             | 含义                                                                               | 值                                 |
| :--------------- | :--------------------------------------------------------------------------------- | :--------------------------------- |
| mode？           | 绘制模式                                                                           | 'infinite'/'translate'/'auto'      |
| mountRef？       | 标尺挂载的 DOM（优先于 wrapperElement，会将 mountRef 的 parentElement 作为父容器） | HTMLElement                        |
| wrapperElement？ | 标尺的父容器 DOM (会自动生成标尺 DOM)                                              | HTMLElement / CSSSelector          |
| scrollElement?   | 监听滚动的 DOM                                                                     | HTMLElement / CSSSelector          |
| width？          | 标尺绘制宽度                                                                       | number                             |
| height？         | 标尺绘制高度                                                                       | number                             |
| rulerId?         | 标尺 id                                                                            | string                             |
| style?           | 标尺样式                                                                           | Object                             |
| onScroll?        | 滚动回调函数                                                                       | (x: number, y: number) => Function |

-   style 属性

| 名称              | 含义                                                                     | 值               |
| :---------------- | :----------------------------------------------------------------------- | :--------------- |
| size？            | 标尺尺寸(如 20, 则横向标尺 height 为 20px，纵向标尺 width 为 20px)       | number           |
| backgroundColor？ | 标尺背景颜色                                                             | string           |
| fontColor？       | 标尺字体颜色                                                             | string           |
| fontSize?         | 标尺字体大小(若不设置会自动计算合适大小，如设置了则为绝对值，不会自适应) | number           |
| fontWeight？      | 标尺字体粗细                                                             | 'bold'/ number   |
| tickColor？       | 标尺刻度颜色                                                             | string           |
| unit?             | 标尺单位样式                                                             | Object           |
| gap?              | 标尺刻度间隔                                                             | number           |
| scale?            | 标尺刻度值缩放系数                                                       | number           |
| show?             | 标尺初始化后是否显示                                                     | boolean          |
| mode?             | 标尺主题样式                                                             | 'center'/'right' |

-   unit 属性

| 名称              | 含义         | 值     |
| :---------------- | :----------- | :----- |
| backgroundColor？ | 单位背景颜色 | string |
| fontColor？       | 单位字体颜色 | string |
| fontSize?         | 单位字体大小 | number |
| text？            | 单位显示内容 | string |

### API

---

#### scale

> 设置标尺缩放系数，标尺刻度值会根据该缩放系数变化

params

| 名称        | 含义     | 值     |
| :---------- | :------- | :----- |
| scaleNumber | 缩放系数 | number |

```javascript
ruler.scale(0.5);
```

#### resize

> 重置标尺宽高或尺寸

params

| 名称    | 含义         | 值     |
| :------ | :----------- | :----- |
| width?  | 标尺绘制宽度 | number |
| height? | 标尺绘制高度 | number |
| size?   | 标尺尺寸     | number |

```javascript
ruler.resize({
    width: 1920,
    height: 1080,
    size: 18,
});
```

#### update

> 更新标尺样式

params

| 名称   | 含义     | 值     |
| :----- | :------- | :----- |
| style? | 标尺样式 | Object |

```javascript
ruler.update({
    fontColor: "#fff",
    unit: {
        text: "mm",
    },
});
```

#### changeScrollElement

> 改变标尺监听的滚动对象

params

| 名称          | 含义           | 值                      |
| :------------ | :------------- | :---------------------- |
| scrollElement | 监听的滚动对象 | HTMLElement/CSSSelector |

```javascript
ruler.changeScrollElement("#wrap");
```

#### show

> 显示标尺

```javascript
ruler.show();
```

#### hide

> 隐藏标尺

```javascript
ruler.hide();
```

#### destroy

> 清除标尺

```javascript
ruler.destroy();
```
