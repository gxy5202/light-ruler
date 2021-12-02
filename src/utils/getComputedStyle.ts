/*
 * @description: 获取元素样式
 * @Author: Gouxinyu
 * @Date: 2020-12-23 16:24:45
 */
export default function (target: HTMLElement | string, type: string): string {
    if (typeof target === "string" && window.getComputedStyle) {
        const dom: HTMLElement = document.getElementById(target) as HTMLElement;
        const style: CSSStyleDeclaration = window.getComputedStyle(dom, null);
        return style[type];
    }

    if ((target as HTMLElement) && window.getComputedStyle) {
        const style: CSSStyleDeclaration = window.getComputedStyle(
            target as HTMLElement,
            null
        );
        return style[type];
    }

    throw new Error("Can not get target style");
}
