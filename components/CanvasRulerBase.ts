import _ from 'lodash-es';
import { RulerInnerStyle, RulerOuterStyle, WrapperSize, Params } from '../index.d';
import { SCALE_NUMBER } from './consts';
import getComputedStyle from '../utils/getComputedStyle';

/**
 * @description: canvas绘制抽象基础类
 * @Author: Gouxinyu
 * @Date: 2021-01-18 20:22:18
 */
export default abstract class CanvasRulerBase {
    protected canvasX: HTMLCanvasElement | OffscreenCanvas; // 横向canvas

    protected canvasY: HTMLCanvasElement | OffscreenCanvas; // 纵向canvas

    public ctxX: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D; // context

    public ctxY: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D; // context

    protected sizeX: WrapperSize;

    protected sizeY: WrapperSize;

    public style: RulerOuterStyle; // 标尺样式

    protected rulerId: string; // 标尺id

    protected devicePixelRatio: number; // 屏幕实际渲染像素比例

    public scrollLeft = 0; // 横向滚动距离

    public scrollTop = 0; // 纵向滚动距离

    public isInfinite = false; // 是否无限算法

    public options = null; // 配置项

    constructor(params: Params, data?: any) {
        const { options } = params;

        this.options = options;
        this.style = options.style;
        this.rulerId = options.rulerId;
        this.isInfinite = params.isInfinite;
        this.devicePixelRatio =
            typeof window !== 'undefined' ? window.devicePixelRatio || 1 : data.devicePixelRatio || 1;
    }

    /**
     * @description: 获取canvas元素
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 17:02:24
     */
    public getCanvas(): void {
        this.canvasX = document.getElementById(`canvas-ruler-x${this.rulerId}`) as HTMLCanvasElement;
        this.canvasY = document.getElementById(`canvas-ruler-y${this.rulerId}`) as HTMLCanvasElement;

        this.sizeX = {
            width: this.canvasX.width,
            height: this.canvasX.height
        };

        this.sizeY = {
            width: this.canvasY.width,
            height: this.canvasY.height
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
    // eslint-disable-next-line max-len
    public draw(
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        type: 'horizontal' | 'vertical',
        scrollNum: number = 0
    ): void {
        const isHorizontal = type === 'horizontal';
        const width = isHorizontal ? this.sizeX.width + scrollNum : this.sizeY.width;
        const height = isHorizontal ? this.sizeX.height : this.sizeY.height + scrollNum;
        const { style } = this;

        // 根据每格间距计算需要画多少个
        const num = isHorizontal ? width / style.gap : height / style.gap;

        // 负值
        const marginLeft = parseInt(
            getComputedStyle(
                document.querySelector('.canvas__paint-container') as HTMLElement,
                isHorizontal ? 'margin-left' : 'margin-top'
            ),
            10
        );

        // 取整，如70取为100
        const startPointStroke = _.round(marginLeft, -2);
        const difference = startPointStroke - marginLeft; // 差值

        // 起点和终点
        let startPoint = 0;
        const endPoint = 0;

        const scaleNum = SCALE_NUMBER * this.devicePixelRatio;

        ctx.rect(0, 0, width * scaleNum, height * scaleNum);
        ctx.fillStyle = style.backgroundColor;
        ctx.fill();

        ctx.save();

        // 根据滚动数值进行相应比例下的位移, 无限生成canvas关键方法
        if (this.isInfinite) {
            // eslint-disable-next-line no-unused-expressions
            isHorizontal ?
                ctx.translate(-(scrollNum + difference) * scaleNum + 0.5, 0) :
                ctx.translate(0, -(scrollNum + difference) * scaleNum + 0.5);
        } else {
            ctx.translate(0.5, 0.5);
        }

        // 进行缩放和偏移，改善canvas模糊问题
        ctx.scale(scaleNum, scaleNum);

        ctx.textBaseline = 'alphabetic';
        ctx.strokeStyle = style.tickColor;
        ctx.fillStyle = style.fontColor;
        const fontSize: number = isHorizontal ? Math.round(height * 0.55) : Math.round(width * 0.55);
        ctx.font = `100 ${fontSize}px sans-serif`;
        ctx.lineWidth = 1;

        // 开始绘图
        ctx.beginPath();
        for (let i = -(Math.round(startPointStroke) / style.gap); i < num; i++) {
            if (i % style.gap === 0) {
                const textNumber = Math.round((i / style.scale) * style.gap);
                if (type === 'vertical') {
                    // 纵向标尺文字竖向显示
                    let stickTextArr: string[] = [];
                    const stick: number = textNumber;
                    // 文字拆分换行
                    const stickString: string = stick.toString();
                    stickTextArr = stickString.split('');
                    // 增量步长
                    let increment = 0;
                    for (let x = 0; x < stickTextArr.length; x++) {
                        // 换算成px
                        ctx.fillText(stickTextArr[x], width * 0.1, textNumber === 0 ? startPoint + increment - width * 0.1 : startPoint + increment - width * 0.5);
                        increment += fontSize;
                    }
                } else {
                    // 换算成px
                    // eslint-disable-next-line max-len
                    ctx.fillText(
                        `${textNumber}`,
                        textNumber === 0 ? startPoint - height * 0.1 : startPoint - height * 0.5,
                        height * 0.5
                    );
                }
            }

            if (isHorizontal) {
                ctx.moveTo(startPoint, height);
                if (i % style.gap === 0 || i % (style.gap / 2) === 0) {
                    ctx.lineTo(startPoint, Math.round(endPoint + height / 1.5));
                } else {
                    ctx.lineTo(startPoint, Math.round(endPoint + height / 1.2));
                }
            } else {
                ctx.moveTo(width, startPoint);
                if (i % style.gap === 0 || i % (style.gap / 2) === 0) {
                    ctx.lineTo(Math.round(width / 1.5), startPoint);
                } else {
                    ctx.lineTo(Math.round(width / 1.2), startPoint);
                }
            }

            startPoint += style.gap;
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
     * @param {WrapperSize} size
     * @Date: 2021-01-19 15:46:29
     */
    public rescaleCanvas(canvas: HTMLCanvasElement | OffscreenCanvas, size: WrapperSize): void {
        // 进行设备真实像素比例处理
        const ratio = this.devicePixelRatio;
        canvas.width = size.width * ratio * SCALE_NUMBER;
        canvas.height = size.height * ratio * SCALE_NUMBER;
    }

    /**
     * @description: 滚动重新绘制canvas
     * @Author: Gouxinyu
     * @param {number} scrollLeft
     * @param {number} scrollTop
     * @Date: 2021-01-19 15:59:28
     */
    public translateRuler(scrollLeft?: number, scrollTop?: number): void {
        this.draw(this.ctxX, 'horizontal', scrollLeft);
        this.draw(this.ctxY, 'vertical', scrollTop);
    }
}
