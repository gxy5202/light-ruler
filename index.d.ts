/*
 * @description: CanvasRuler类型文件
 * @Author: Gouxinyu
 * @Date: 2020-12-22 14:56:02
 */

// 监听的滚动对象
export interface ScrollObject {
    readonly scrollObject: HTMLElement
}

// export type RulerSize = number; // 标尺宽度: 横向标尺和纵向标尺相同 small/middle/large Todo

// 分辨率
export type Ratio = number[];

// 单位样式
export interface UnitStyle {
    backgroundColor?: string, // 单位背景颜色
    fontColor?: string, // 单位字体颜色
    fontSize?: number, // 单位字体大小
    text?: string // 单位内容
}

// 标尺默认内部所需样式
export interface RulerInnerStyle {
    size?: number, // 标尺宽度: 横向标尺和纵向标尺相同 small/middle/large Todo
    backgroundColor?: string, // 背景颜色
    fontColor?: string, // 字体颜色
    fontSize?: number, // 字体大小
    tickColor?: string, // 刻度颜色
    unit?: UnitStyle, // 单位
    gap?: number, // 间隔
    maxSize?: number, // 标尺最尺寸
    maxWidth?: number, // 标尺最大长度
    maxHeight?: number, // 标尺最大高度
    scale?: number // 缩放比例
    show?: boolean // 是否显示
}

// 标尺绘制所需外部样式
export interface RulerOuterStyle extends RulerInnerStyle {
    wrapperId?: string, // 容器id
    width?: number, // 画布宽
    height?: number, // 画布高
    rulerId?: string,
    scrollLeft?: number, // 横向滚动距离
    scrollTop?: number, // 纵向滚动距离
    isInfinite?: boolean // 是否无限生成
}

// 标尺对象
export interface Ruler {
    mode?: string | 'offscreen' | 'screen' | 'auto', // 标尺渲染模式： 1.worker离屏渲染 2.screen主线程渲染 3.自动选择最优渲染
    type?: string | 'single' | 'wrapped', // 标尺类型，单独生成还是带滚动条整体生生成
    direction?: string | 'horizontal' | 'vertical', // 标尺方向，单独生成模式使用
    contentWidth?: number, // 画布宽度
    contentHeight?: number, // 画布高度
    scrollSelector: string, // 滚动元素元素选择器
    rulerId?: string,
    style: RulerOuterStyle // 标尺样式
}

// 容器大小
export interface WrapperSize {
    width: number,
    height: number
}

export interface ResizeObject extends WrapperSize {
    size?: number
}

export enum RulerDefaultConfig {

}

export type DomElement = HTMLElement | Node;

// screenCanvasRuler参数
export interface Params {
    options: Ruler,
    isInfinite: boolean
    [key: string]: any
}
