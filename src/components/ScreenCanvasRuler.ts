/*
 * @description: 主线程canvas绘制
 * @Author: Gouxinyu
 * @Date: 2020-12-28 09:29:01
 */
import CanvasRulerBase from "./CanvasRulerBase";
import { RulerInnerStyle, RulerOuterStyle, Params } from "../index.d";

export default class ScreenCanvasRuler extends CanvasRulerBase {
    constructor(params: Params) {
        super(params);
        this.getCanvas();
        this.drawCanvas();
    }

    /**
     * @description: 绘制主线程canvas
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-08 22:54:00
     */
    public drawCanvas(): void {
        this.ctxX = this.canvasX.getContext("2d") as CanvasRenderingContext2D;
        this.ctxY = this.canvasY.getContext("2d") as CanvasRenderingContext2D;

        this.rescaleCanvas(this.canvasX);
        this.rescaleCanvas(this.canvasY);

        // 绘制横向标尺
        this.draw(this.ctxX, "horizontal");
        // 绘制纵向标尺
        this.draw(this.ctxY, "vertical");
    }

    /**
     * @description: 根据画布缩放刷新标尺
     * @Author: Gouxinyu
     * @param {number} size
     * @Date: 2021-01-08 16:54:15
     */
    public scale(style: RulerInnerStyle): void {
        this.style = style;
        // 绘制横向标尺
        this.draw(this.ctxX, "horizontal", this.scrollLeft);
        // 绘制纵向标尺
        this.draw(this.ctxY, "vertical", this.scrollTop);
    }

    /**
     * @description: 重置canvas大小
     * @Author: Gouxinyu
     * @param {any} styleObject
     * @Date: 2021-01-11 20:52:53
     */
    public resize(styleObject: RulerOuterStyle): void {
        this.style = styleObject;
        const {
            size,
            width,
            height,
        }: { size: number; width: number; height: number } = styleObject;
        this.canvasX.width = width;
        this.canvasX.height = size;

        this.canvasY.height = height;
        this.canvasY.width = size;

        this.sizeX.width = width;
        this.sizeX.height = size;

        this.sizeY.width = size;
        this.sizeY.height = height;

        this.rescaleCanvas(this.canvasX);
        this.rescaleCanvas(this.canvasY);

        this.isInfinite = styleObject.isInfinite as boolean;

        // 绘制横向标尺
        this.draw(this.ctxX, "horizontal", this.scrollLeft);
        // 绘制纵向标尺
        this.draw(this.ctxY, "vertical", this.scrollTop);
    }

    /**
     * @description: 修改样式
     * @Author: Gouxinyu
     * @param {any} style
     * @Date: 2021-01-11 16:56:22
     */
    public update(style: RulerOuterStyle): void {
        this.style = style;

        // 绘制横向标尺
        this.draw(this.ctxX, "horizontal", this.scrollLeft);
        // 绘制纵向标尺
        this.draw(this.ctxY, "vertical", this.scrollTop);
    }

    /**
     * @description: 清除实例
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 16:18:23
     */
    public destroy(): void {
        // 清空画布
        this.clearCanvas();
    }
}
