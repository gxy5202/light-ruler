/*
 * @description: DOM操作相关方法
 * @Author: Gouxinyu
 * @Date: 2020-12-23 19:36:54
 */
import { DomElement, RulerOuterStyle, UnitStyle } from "../index.d";

/**
 * @description: 创建文档片段所需的HTML字符串
 * @Author: Gouxinyu
 * @param {*}
 * @Date: 2020-12-25 17:19:36
 */
export const createHTMLStringDom = (
    styleObject: Required<RulerOuterStyle>,
    type: string
): string => {
    let rulerHTML: string;

    const {
        size: styleSize,
        maxSize: styleMaxSize,
        maxWidth: styleMaxWidth,
        maxHeight: styleMaxHeight,
        width: styleWidth,
        height: styleHeight,
        unit: styleUnit,
        rulerId,
        mountRef,
    } = styleObject;

    const size =
        (styleSize as number) > (styleMaxSize as number)
            ? styleMaxSize
            : styleSize;
    const width =
        styleWidth > (styleMaxWidth as number) ? styleMaxWidth : styleWidth;
    const height =
        styleHeight > (styleMaxHeight as number) ? styleMaxHeight : styleHeight;

    const CanvasRulerWrapperStart: string = `<div id="canvas-ruler-wrapper-${
        styleObject.rulerId
    }" 
                                                class="canvas-ruler-wrapper"
                                                style="display: ${
                                                    styleObject.show
                                                        ? "block"
                                                        : "none"
                                                }"
                                            >`;
    const CanvasRulerWrapperEnd: string = "</div>";
    const CanvasRulerWrapperContent: string = `
        <div id="canvas-ruler-unit-${rulerId}" class="canvas-ruler-unit"
                    style="
                        width: ${styleSize}px;
                        height: ${styleSize}px;
                        background-color: ${
                            (styleUnit as UnitStyle).backgroundColor
                        };
                        color: ${(styleUnit as UnitStyle).fontColor};
                        font-size: ${(styleUnit as UnitStyle).fontSize}px;
                        border-right: 1px solid ${styleObject.tickColor};
                        border-bottom: 1px solid ${styleObject.tickColor};
                        z-index: 99;
                    ">${(styleUnit as UnitStyle).text}</div>
                <div id="canvas-ruler-h-box-${rulerId}"
                    class="canvas-ruler-box canvas-ruler-h-box"
                    style="
                        width: ${width}px;
                        height: ${size}px;
                        left: ${size}px;
                        border-bottom: 1px solid ${styleObject.backgroundColor}
                    ">
                    <canvas id="canvas-ruler-x-${rulerId}" width=${width} height=${size} 
                     class="canvas-ruler-x">
                </div>
                <div id="canvas-ruler-v-box-${rulerId}"
                    class="canvas-ruler-box canvas-ruler-v-box" 
                    style="
                        width: ${size}px;
                        height: ${height}px;
                        top: ${size}px;
                        border-right: 1px solid ${styleObject.backgroundColor}
                    ">
                    <canvas id="canvas-ruler-y-${rulerId}" width=${size} height=${height} 
                    class="canvas-ruler-y">
                </div>
    `;
    if (type === "range") {
        rulerHTML = `${
            mountRef ? "" : CanvasRulerWrapperStart
        }${CanvasRulerWrapperContent}${CanvasRulerWrapperEnd}`;
    } else {
        rulerHTML = CanvasRulerWrapperContent;
    }
    return rulerHTML;
};

/**
 * @description: 设置DOM属性
 * @Author: Gouxinyu
 * @param {HTMLElement} target
 * @param {any} style
 * @Date: 2021-01-11 10:49:16
 */
export const setDomAttribute = (target: HTMLElement, attr: any): void => {
    if (target === null) throw new Error("dom is null");
    Object.keys(attr).forEach((item) => {
        (target as any)[item] = attr[item];
    });
};

/**
 * @description: 生成DOM元素
 * @Author: Gouxinyu
 * @param {string} id
 * @Date: 2020-12-23 19:58:43
 */
export const createHTMLDom = (
    type: string,
    attr: any,
    text?: string
): HTMLElement => {
    const dom = document.createElement(type);
    setDomAttribute(dom, attr);
    return dom;
};

/**
 * @description: 判断方法的浏览器支持性
 * @Author: Gouxinyu
 * @param {string} type
 * @Date: 2020-12-25 17:06:58
 */
export const checkBrowserSupport = (type: any): boolean => {
    if (type && typeof type === "function") {
        return true;
    }
    return false;
};

/**
 * @description: 向父元素中添加子元素DOM
 * @Author: Gouxinyu
 * @param {DomElement} fatherDom
 * @param {DomElement} ChildDom
 * @Date: 2021-01-11 11:31:45
 */
// eslint-disable-next-line max-len
export const appendDom = (
    fatherDom: DomElement,
    ChildDom: DomElement
): Promise<DomElement> =>
    new Promise((resolve, reject) => {
        if (fatherDom && ChildDom) {
            fatherDom.appendChild(ChildDom);
            resolve(fatherDom);
        }
        reject(new Error("dom is null"));
    });

/**
 * @description: 文档碎片创建DOM
 * @Author: Gouxinyu
 * @param {any} styleObject
 * @Date: 2021-01-11 11:40:29
 */
export const createFragmentDom = (
    styleObject: Required<RulerOuterStyle>
): void => {
    const { wrapperElement, mountRef } = styleObject;
    // 若浏览器不支持，则使用文档片段在内存中创建dom，不会引起页面回流createDocumentFragment
    const fragment = document.createDocumentFragment();

    let canvasRulerWrapper;

    if (mountRef) {
        setDomAttribute(mountRef, {
            id: `canvas-ruler-wrapper-${styleObject.rulerId}`,
            className: "canvas-ruler-wrapper",
            style: `display: ${styleObject.show ? "block" : "none"}`,
        });
        canvasRulerWrapper = mountRef;
    } else {
        canvasRulerWrapper = createHTMLDom("div", {
            id: `canvas-ruler-wrapper-${styleObject.rulerId}`,
            className: "canvas-ruler-wrapper",
            style: `display: ${styleObject.show ? "block" : "none"}`,
        });
    }

    const rulerHTML: string = createHTMLStringDom(styleObject, "html");
    canvasRulerWrapper.innerHTML = rulerHTML;
    fragment.appendChild(canvasRulerWrapper);
    const wrapperEl: HTMLElement = mountRef
        ? mountRef.parentElement
        : typeof wrapperElement === "string"
        ? (document.getElementById(wrapperElement) as HTMLElement)
        : wrapperElement;
    appendDom(wrapperEl, fragment).then((dom) => {});
};

/**
 * @description: range方法一次性插入DOM
 * @Author: Gouxinyu
 * @param {any} styleObject
 * @Date: 2021-01-11 11:39:45
 */
export const createRangeDom = (
    styleObject: Required<RulerOuterStyle>
): void => {
    // 选择文档片段
    let range: Range = document.createRange();
    const { wrapperElement, mountRef } = styleObject;
    // IE11不兼容createContextualFragment方法，但兼容createRange方法
    if (checkBrowserSupport(range.createContextualFragment)) {
        // 若浏览器支持，则进行字符串一次性插入DOM元素
        const rulerHTML: string = createHTMLStringDom(styleObject, "range");
        if (mountRef) {
            setDomAttribute(mountRef, {
                id: `canvas-ruler-wrapper-${styleObject.rulerId}`,
                className: "canvas-ruler-wrapper",
                style: `display: ${styleObject.show ? "block" : "none"}`,
            });
        }
        const wrapperEl: HTMLElement = mountRef
            ? mountRef.parentElement
            : typeof wrapperElement === "string"
            ? (document.querySelector(wrapperElement) as HTMLElement)
            : wrapperElement;
        range.selectNode(wrapperEl);
        const documentFragment = range.createContextualFragment(rulerHTML);
        // 保证DOM添加完成之后再获取页面上的元素
        if (mountRef) {
            appendDom(mountRef, documentFragment).then((dom) => {
                appendDom(wrapperEl, dom);
            });
        } else {
            appendDom(wrapperEl, documentFragment);
        }
    } else {
        // 释放片段
        range.detach();
        // 文档碎片创建DOM
        createFragmentDom(styleObject);
    }
};

/**
 * @description: DOM渲染
 * @Author: Gouxinyu
 * @param {any} styleObject
 * @Date: 2021-01-11 11:39:45
 */
export const renderDom = (styleObject: Required<RulerOuterStyle>): void => {
    // 判断浏览器支持方法情况，选择效率最优的插入DOM方案，进行兼容处理
    if (checkBrowserSupport(document.createRange)) {
        createRangeDom(styleObject);
    } else {
        createFragmentDom(styleObject);
    }
};
