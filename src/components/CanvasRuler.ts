/*
 * @description: CanvasRuler
 * @Author: Gouxinyu
 * @Date: 2020-12-23 09:21:21
 */
import {
    Ruler,
    WrapperSize,
    ResizeObject,
    Ratio,
    RulerOuterStyle,
    Params,
    UnitStyle,
} from "../index.d";

import {
    MAX_SIZE,
    MAX_ROTIO,
    OVER_SIZE,
    DEFAULT_WIDTH,
    DEFAULT_HEIGHT,
    RULER_STYLE,
} from "./consts";

import getComputedStyle from "../utils/getComputedStyle";
import { renderDom } from "../utils/renderDom";
import ScreenCanvasRuler from "./ScreenCanvasRuler";
import CanvasRulerBase from "./CanvasRulerBase";
import { events } from "../utils/events";
import throwCustomError from "../utils/CustomError";
import "./canvasRuler.css?url";

/**
 * @description: ruler类
 * @Author: Gouxinyu
 * @param {*}
 * @Date: 2020-12-23 13:47:14
 */
export default class CanvasRuler {
    private wrapperSize!: WrapperSize; // 容器大小

    private scrollObject!: HTMLElement; // 监听滚动DOM

    private canvasXbox!: HTMLElement; // 横向canvas

    private canvasYbox!: HTMLElement; // 纵向canvas

    private unitDom!: HTMLElement; // 单位元素

    public options!: Required<Ruler>; // 标尺配置项

    public canvas!: ScreenCanvasRuler; // canvas标尺实例 主线程canvas

    public canvasWrapper!: HTMLElement; // 标尺最外层DOM容器
    // 标尺最外层DOM容器

    public ratio!: Ratio; // 当前分辨率
    // 当前分辨率

    public isInfinite = false; // 是否无限算法

    constructor(options: Ruler) {
        if (!options.wrapperElement && !options.mountRef) {
            throwCustomError("wrapper element or options.mountRef is null!");
        }

        // 初始化DOM元素
        this.init(options);
        // 开始渲染
        this.render();
        // 创建canvas标尺内容
        this.createCanvasInnerRuler();
        // 绑定事件
        this.bindScrollEvent();
    }

    /**
     * @description: 初始化实例相关配置
     * @Author: Gouxinyu
     * @param {rulerObject} options
     * @Date: 2021-01-11 17:56:35
     */
    public init(options: Ruler): void {
        // 容器大小
        this.setWrapperSize(options);

        const style = options.style as Required<RulerOuterStyle>;

        // 配置项
        this.options = {
            mountRef: options.mountRef,
            wrapperElement: options.wrapperElement,
            mode: options.mode || "auto",
            type: options.type || "wrapped",
            direction: options.direction || "horizontal",
            width: options.width || DEFAULT_WIDTH,
            height: options.height || DEFAULT_HEIGHT,
            scrollElement: options.scrollElement || "",
            rulerId: options.rulerId || "easy-canvas-ruler",
            style: style
                ? ({
                      size: style.size
                          ? style.size > MAX_SIZE
                              ? MAX_SIZE
                              : style.size
                          : 20, // 标尺宽度: 横向标尺和纵向标尺相同
                      backgroundColor: style.backgroundColor || "#171819",
                      fontColor: style.fontColor || "#fff",
                      fontSize: style.fontSize,
                      fontWeight: style.fontWeight || "",
                      tickColor: style.tickColor || "#4b4d4f",
                      unit: {
                          backgroundColor: "#171819",
                          fontColor: "#fff",
                          fontSize: 12,
                          text: "px",
                          ...(style.unit ? style.unit : {}),
                      },
                      gap: style.gap || 10,
                      maxSize: style.maxSize || MAX_SIZE,
                      maxWidth: style.maxWidth || MAX_ROTIO,
                      maxHeight: style.maxHeight || MAX_ROTIO,
                      scale: style.scale || 1,
                      show: style.show || true,
                      mode: style.mode || "center",
                  } as Required<RulerOuterStyle>)
                : RULER_STYLE,
            onScroll: options.onScroll || null,
        } as Required<Ruler>;

        // 当前分辨率
        this.ratio = [this.options.width!, this.options.height!];

        if (
            ((this.ratio[0] > MAX_ROTIO || this.ratio[1] > MAX_ROTIO) &&
                this.options.mode === "auto") ||
            this.options.mode === "infinite"
        ) {
            this.isInfinite = true;
        }
    }

    /**
     * @description: 根据模式开始渲染 'wrapped'整体渲染， ’single‘ 单个渲染
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 17:53:42
     */
    public render(): void | never {
        if (this.options.type === "wrapped") {
            this.createWrappedRuler();
        } else if (this.options.type === "single") {
            this.createSingleRuler();
        } else {
            throwCustomError("render type is illegal");
        }
    }

    /**
     * @description: 获取容器
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-18 20:43:06
     */
    public setWrapperSize(options: Ruler): void {
        const wrapperEl = options.mountRef
            ? options.mountRef.parentElement
            : options.wrapperElement;

        this.wrapperSize = {
            width: parseFloat(getComputedStyle(wrapperEl, "width")),
            height: parseFloat(getComputedStyle(wrapperEl, "height")),
        };
    }

    /**
     * @description: 创建画布容器DOM
     * @Author: Gouxinyu
     * @param {*} void
     * @Date: 2020-12-25 16:58:48
     */
    public createWrappedRuler(): void {
        const styleObject = {
            ...this.options.style,
            mountRef: this.options.mountRef,
            wrapperElement: this.options.wrapperElement,
            width: this.isInfinite
                ? this.wrapperSize.width + OVER_SIZE
                : this.options.width! + OVER_SIZE, // 画布宽
            height: this.isInfinite
                ? this.wrapperSize.height + OVER_SIZE
                : this.options.width! + OVER_SIZE, // 画布高
            rulerId: this.options.rulerId,
        } as Required<RulerOuterStyle>;

        renderDom(styleObject);
    }

    /**
     * @description: 绘制canvas
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 14:01:38
     */
    public createCanvasInnerRuler(): void | never {
        const params: Params = {
            options: this.options,
            isInfinite: this.isInfinite,
        };

        this.canvas = new ScreenCanvasRuler(params);
    }

    // TODO
    /**
     * @description: 生成单个ruler
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 11:42:27
     */
    public createSingleRuler(): void {}

    /**
     * @description: 缩放标尺显示精度
     * @Author: Gouxinyu
     * @param {number} scaleNumber
     * @Date: 2021-01-11 14:00:06
     */
    public scale(scaleNumber: number): void | never {
        if (typeof scaleNumber !== "number" || Number.isNaN(scaleNumber)) {
            throwCustomError("scale number is illegal");
        }

        if (scaleNumber !== this.options.style.scale) {
            this.options.style.scale = scaleNumber;
            this.canvas.scale(this.options.style);
        }
    }

    /**
     * @description: 重置标尺大小
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 20:22:29
     */
    public resize(resizeObj: ResizeObject): CanvasRuler | never {
        if (
            typeof resizeObj !== "object" ||
            (!resizeObj.width && !resizeObj.height)
        ) {
            throwCustomError("resize number is illegal");
        }

        let { width, height } = resizeObj;
        let size: number = resizeObj.size
            ? resizeObj.size
            : this.options.style.size!;

        let wrapperWidth: number = this.wrapperSize.width;
        let wrapperHeight: number = this.wrapperSize.height;

        // 若分辨率超过canvas绘制阈值
        if (width > MAX_ROTIO || height > MAX_ROTIO) {
            this.isInfinite = true;
            this.setWrapperSize(this.options);
            this.ratio = [width, height];

            this.canvasXbox.style.transform = "translateX(0px)";
            this.canvasYbox.style.transform = "translateY(0px)";
        } else {
            this.isInfinite = false;

            // 若分辨率大于当前分辨率或标尺尺寸改变才重新绘制
            if (
                (this.ratio[0] > width &&
                    this.ratio[1] > height &&
                    size === this.options.style.size &&
                    this.ratio[0] < MAX_ROTIO &&
                    this.ratio[1] < MAX_ROTIO) ||
                (this.ratio[0] === width && this.ratio[1] === height)
            ) {
                width = 0;
                height = 0;
                size = 0;
                return this;
            }

            this.ratio = [width, height];
        }

        const styleObject = {
            rulerId: this.options.rulerId,
            width: this.isInfinite
                ? wrapperWidth + OVER_SIZE
                : width + OVER_SIZE,
            height: this.isInfinite
                ? wrapperHeight + OVER_SIZE
                : height + OVER_SIZE,
            isInfinite: this.isInfinite,
            ...this.options.style,
        } as Required<RulerOuterStyle>;

        this.canvasXbox.style.width = `${styleObject.width}px`;
        this.canvasYbox.style.height = `${styleObject.height}px`;
        this.canvasXbox.style.height = `${size}px`;
        this.canvasYbox.style.width = `${size}px`;
        this.canvasXbox.style.left = `${size}px`;
        this.canvasYbox.style.top = `${size}px`;

        this.unitDom.style.width = `${size}px`;
        this.unitDom.style.height = `${size}px`;

        this.options.style.size = size;
        this.canvas.resize(styleObject);
        this.updateUnitStyle();
        // this.changeScrollElement(this.options.scrollElement);
        return this;
    }

    /**
     * @description: 更新样式
     * @Author: Gouxinyu
     * @param {any} style
     * @Date: 2021-01-11 17:54:17
     */
    public update(style: RulerOuterStyle): CanvasRuler {
        const newSize = style.size;
        const oldSize = this.options.style.size;
        this.options.style = Object.assign(this.options.style, style);

        if (newSize && newSize !== oldSize) {
            const options = {
                ...this.wrapperSize,
                size: newSize,
            };
            this.resize(options);
        }
        this.canvas.update(this.options.style);
        this.updateUnitStyle();
        return this;
    }

    /**
     * @description: 更新单位样式
     * @Author: Gouxinyu
     * @param {any} style
     * @Date: 2021-01-11 17:54:17
     */
    public updateUnitStyle(): void {
        const unit = this.options.style.unit as UnitStyle;
        this.unitDom.style.backgroundColor = `${unit.backgroundColor}`;
        this.unitDom.style.color = `${unit.fontColor}`;
        this.unitDom.style.fontSize = `${unit.fontSize}`;
        this.unitDom.style.width = `${this.options.style.size}`;
        this.unitDom.style.height = `${this.options.style.size}`;
        this.unitDom.innerText = unit.text as string;
    }

    /**
     * @description: 销毁实例
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 14:00:24
     */
    public destroy(): void {
        // 清空canvas
        this.canvas.destroy();
        // 解绑事件
        this.isInfinite
            ? events.off(this.scrollObject, "scroll", this.infiniteScrollEvent)
            : events.off(this.scrollObject, "scroll", this.limitedScrollEvent);

        // 清空dom
        const cavasBox: HTMLElement = document.getElementById(
            `canvas-ruler-wrapper-${this.options.rulerId}`
        ) as HTMLElement;
        cavasBox.innerHTML = "";
        cavasBox.remove();
        events.locked = false;
    }

    /**
     * @description: 绑定滚动事件
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 17:36:11
     */
    public bindScrollEvent(): void {
        this.getEventNeedsDom();

        if (this.isInfinite) {
            this.infiniteScrollEvent = this.infiniteScrollEvent.bind(this);
            events.on(this.scrollObject, "scroll", this.infiniteScrollEvent);
        } else {
            this.limitedScrollEvent = this.limitedScrollEvent.bind(this);
            events.on(this.scrollObject, "scroll", this.limitedScrollEvent);
        }
    }

    /**
     * @description: 滚动div事件
     * @Author: Gouxinyu
     * @param {any} e
     * @Date: 2021-01-11 17:54:36
     */
    private limitedScrollEvent(e: any): void {
        events.throttle(() => {
            const { scrollLeft, scrollTop } = e.target;
            if (typeof this.options.onScroll === "function") {
                this.options.onScroll(scrollLeft, scrollTop);
            }
            (this.canvas as CanvasRulerBase).scrollLeft = scrollLeft;
            (this.canvas as CanvasRulerBase).scrollTop = scrollTop;
            this.canvasXbox.style.transform = `translateX(${-scrollLeft}px)`;
            this.canvasYbox.style.transform = `translateY(${-scrollTop}px)`;
            events.locked = false;
        });
    }

    /**
     * @description: 滚动canvas事件
     * @Author: Gouxinyu
     * @param {any} e
     * @Date: 2021-01-11 17:54:36
     */
    private infiniteScrollEvent(e: any): void {
        events.throttle(() => {
            const { scrollLeft, scrollTop } = e.target;
            if (typeof this.options.onScroll === "function") {
                this.options.onScroll(scrollLeft, scrollTop);
            }
            (this.canvas as CanvasRulerBase).scrollLeft = scrollLeft;
            (this.canvas as CanvasRulerBase).scrollTop = scrollTop;
            this.canvas.translateRuler(scrollLeft, scrollTop);
            events.locked = false;
        });
    }

    /**
     * @description: 获取事件所需DOM
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 17:55:31
     */
    public getEventNeedsDom(): void {
        this.canvasWrapper = document.getElementById(
            `canvas-ruler-wrapper-${this.options.rulerId}`
        ) as HTMLElement;
        this.scrollObject =
            typeof this.options.scrollElement === "string"
                ? (document.querySelector(
                      this.options.scrollElement
                  ) as HTMLElement)
                : this.options.scrollElement;
        this.canvasXbox = document.getElementById(
            `canvas-ruler-h-box-${this.options.rulerId}`
        ) as HTMLElement;
        this.canvasYbox = document.getElementById(
            `canvas-ruler-v-box-${this.options.rulerId}`
        ) as HTMLElement;
        this.unitDom = document.getElementById(
            `canvas-ruler-unit-${this.options.rulerId}`
        ) as HTMLElement;
    }

    /**
     * @description: 修改滚动监听对象
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 17:55:31
     */
    public changeScrollElement(
        scrollElement: string | HTMLElement
    ): CanvasRuler | never {
        const dom =
            typeof scrollElement === "string"
                ? (document.querySelector(scrollElement) as HTMLElement)
                : scrollElement;
        if (dom) {
            // 解绑事件
            this.isInfinite
                ? events.off(
                      this.scrollObject,
                      "scroll",
                      this.limitedScrollEvent
                  )
                : events.off(
                      this.scrollObject,
                      "scroll",
                      this.infiniteScrollEvent
                  );

            this.options.scrollElement = scrollElement;
            this.scrollObject = dom;
            // 重新绑定事件
            this.bindScrollEvent();
        } else {
            throwCustomError(
                `can not find the scroll element ${scrollElement}`
            );
        }
        return this;
    }

    /**
     * @description: 显示
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 17:55:31
     */
    public show(): CanvasRuler {
        this.options.style.show = true;
        this.canvasWrapper.style.display = "block";
        return this;
    }

    /**
     * @description: 隐藏
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 17:55:31
     */
    public hide(): CanvasRuler {
        this.options.style.show = false;
        this.canvasWrapper.style.display = "none";
        return this;
    }
}
