import {
    RulerInnerStyle,
    RulerOuterStyle,
    WrapperSize,
    Params,
    Ruler,
} from "../index.d";

/**
 * @description: canvas绘制抽象基础类
 * @Author: Gouxinyu
 * @Date: 2021-01-18 20:22:18
 */
export default abstract class CanvasRulerBase {
    protected canvasX!: HTMLCanvasElement; // 横向canvas

    protected canvasY!: HTMLCanvasElement; // 纵向canvas

    protected rulerId: string; // 标尺id

    protected sizeX!: WrapperSize;

    protected sizeY!: WrapperSize;

    protected devicePixelRatio: number = 1; // 屏幕实际渲染像素比例

    public ctxX!: CanvasRenderingContext2D; // context

    public ctxY!: CanvasRenderingContext2D; // context

    public style: RulerOuterStyle; // 标尺样式

    public scrollLeft = 0; // 横向滚动距离

    public scrollTop = 0; // 纵向滚动距离

    public isInfinite = false; // 是否无限算法

    public options: Ruler; // 配置项

    constructor(params: Params) {
        const { options } = params;

        this.options = options;
        this.style = options.style;
        this.rulerId = options.rulerId as string;
        this.isInfinite = params.isInfinite;
        this.devicePixelRatio = window.devicePixelRatio;
    }

    /**
     * @description: 获取canvas元素
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 17:02:24
     */
    public getCanvas(): void {
        this.canvasX = document.getElementById(
            `canvas-ruler-x${this.rulerId}`
        ) as HTMLCanvasElement;
        this.canvasY = document.getElementById(
            `canvas-ruler-y${this.rulerId}`
        ) as HTMLCanvasElement;

        this.sizeX = {
            width: this.canvasX.width,
            height: this.canvasX.height,
        };

        this.sizeY = {
            width: this.canvasY.width,
            height: this.canvasY.height,
        };
    }

    /**
     * @description: 绘制canvas
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 17:02:35
     */
    abstract drawCanvas(): void;

    /**
     * @description: 修改样式
     * @Author: Gouxinyu
     * @param {any} style
     * @Date: 2021-01-11 16:56:22
     */
    abstract update(style: RulerOuterStyle): void;

    /**
     * @description: 重置canvas大小
     * @Author: Gouxinyu
     * @param {any} styleObject
     * @Date: 2021-01-11 20:52:53
     */
    abstract resize(styleObject: RulerOuterStyle): void;

    /**
     * @description: 根据画布缩放刷新标尺
     * @Author: Gouxinyu
     * @param {number} size
     * @Date: 2021-01-08 16:54:15
     */
    abstract scale(style: RulerInnerStyle): void;

    /**
     * @description: 清除实例
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 16:18:23
     */
    abstract destroy(): void;

    /**
     * @description: 绘制canvas
     * @Author: Gouxinyu
     * @param {any} ctx
     * @param {'horizontal' | 'vertical'} type
     * @Date: 2021-01-08 16:54:15
     */
    public draw(
        ctx: CanvasRenderingContext2D,
        type: "horizontal" | "vertical",
        scrollNum: number = 0
    ): void {
        const isHorizontal = type === "horizontal";
        const width = isHorizontal
            ? this.sizeX.width + scrollNum
            : this.sizeY.width;

        const height = isHorizontal
            ? this.sizeX.height
            : this.sizeY.height + scrollNum;

        const {
            gap,
            backgroundColor,
            tickColor,
            fontColor,
            fontWeight,
            fontSize,
            scale,
            mode,
        }: {
            gap: number;
            backgroundColor: string;
            fontSize: number;
            tickColor: string;
            fontColor: string;
            fontWeight: string | number;
            scale: number;
            mode: string;
        } = this.style as any;

        // 根据每格间距计算需要画多少个
        const num = isHorizontal ? width / gap : height / gap;

        // 起点和终点
        let startPoint = 0;
        const endPoint = 0;

        ctx.rect(
            0,
            0,
            width * this.devicePixelRatio,
            height * this.devicePixelRatio
        );
        ctx.fillStyle = backgroundColor as string;
        ctx.fill();

        ctx.save();

        // 根据滚动数值进行相应比例下的位移, 无限生成canvas关键方法
        if (this.isInfinite) {
            isHorizontal
                ? ctx.translate(-scrollNum + 0.5, 0)
                : ctx.translate(0, -scrollNum + 0.5);
        } else {
            ctx.translate(0.5, 0.5);
        }

        // 进行缩放和偏移，改善canvas模糊问题
        ctx.scale(this.devicePixelRatio, this.devicePixelRatio);

        ctx.textBaseline = "alphabetic";
        ctx.strokeStyle = tickColor as string;
        ctx.fillStyle = fontColor as string;
        const textSize: number = fontSize
            ? fontSize
            : isHorizontal
            ? Math.round(height * 0.55)
            : Math.round(width * 0.55);
        ctx.font = `${fontWeight} ${textSize}px sans-serif`;
        ctx.lineWidth = 1;

        const isCenterMode = mode === "center";
        // 开始绘图
        ctx.beginPath();
        for (let i = -(Math.round(startPoint) / gap); i < num; i++) {
            if (i % gap === 0) {
                const textNumber = Math.round((i / scale) * gap);
                if (type === "vertical") {
                    // 纵向标尺文字竖向显示
                    let stickTextArr: string[] = [];
                    const stick: number = textNumber;
                    // 文字拆分换行
                    const stickString: string = stick.toString();
                    stickTextArr = stickString.split("");
                    // 增量步长
                    let increment = 0;
                    for (let x = 0; x < stickTextArr.length; x++) {
                        // 换算成px
                        const tx =
                            textNumber === 0 && isCenterMode
                                ? ""
                                : stickTextArr[x];
                        ctx.fillText(
                            tx,
                            width * 0.1,
                            isCenterMode
                                ? startPoint + increment - width * 0.5
                                : startPoint + increment + width * 0.7
                        );

                        increment += textSize;
                    }
                } else {
                    // 换算成px
                    const tx =
                        textNumber === 0 && isCenterMode ? "" : `${textNumber}`;
                    const tw = ctx.measureText(String(textNumber)).width;
                    ctx.fillText(
                        tx,
                        isCenterMode
                            ? startPoint - tw * 0.5
                            : startPoint + height * 0.2,
                        height * 0.5
                    );
                }
            }

            if (isHorizontal) {
                ctx.moveTo(startPoint, height);
                if (i % gap === 0) {
                    ctx.lineTo(
                        startPoint,
                        isCenterMode
                            ? Math.round(endPoint + height / 1.5)
                            : Math.round(endPoint)
                    );
                } else if (i % (gap / 2) === 0) {
                    ctx.lineTo(
                        startPoint,
                        isCenterMode
                            ? Math.round(endPoint + height / 1.5)
                            : Math.round(endPoint + height / 2)
                    );
                } else {
                    ctx.lineTo(
                        startPoint,
                        isCenterMode
                            ? Math.round(endPoint + height / 1.2)
                            : Math.round(endPoint + height / 1.5)
                    );
                }
            } else {
                ctx.moveTo(width, startPoint);
                if (i % gap === 0) {
                    ctx.lineTo(
                        isCenterMode
                            ? Math.round(width / 1.5)
                            : Math.round(-width),
                        startPoint
                    );
                } else if (i % (gap / 2) === 0) {
                    ctx.lineTo(
                        isCenterMode
                            ? Math.round(width / 1.5)
                            : Math.round(width / 2),
                        startPoint
                    );
                } else {
                    ctx.lineTo(
                        isCenterMode
                            ? Math.round(width / 1.2)
                            : Math.round(width / 1.5),
                        startPoint
                    );
                }
            }

            startPoint += gap;
        }

        ctx.stroke();
        ctx.restore();
    }

    /**
     * @description: 清空画布
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 16:18:23
     */
    public clearCanvas(): void {
        // 清空画布
        this.ctxX.clearRect(0, 0, this.canvasX.width, this.canvasX.height);
        this.ctxY.clearRect(0, 0, this.canvasY.width, this.canvasY.height);
    }

    /**
     * @description: 根据屏幕真实像素比例改变canvas大小
     * @Author: Gouxinyu
     * @param {HTMLCanvasElement} canvas
     * @Date: 2021-01-19 15:46:29
     */
    public rescaleCanvas(canvas: HTMLCanvasElement): void {
        canvas.width = canvas.clientWidth * this.devicePixelRatio;
        canvas.height = canvas.clientHeight * this.devicePixelRatio;
    }

    /**
     * @description: 滚动重新绘制canvas
     * @Author: Gouxinyu
     * @param {number} scrollLeft
     * @param {number} scrollTop
     * @Date: 2021-01-19 15:59:28
     */
    public translateRuler(scrollLeft?: number, scrollTop?: number): void {
        this.draw(this.ctxX, "horizontal", scrollLeft);
        this.draw(this.ctxY, "vertical", scrollTop);
    }
}
