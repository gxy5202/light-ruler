/**
 * @description: 离屏canvas类
 * @Author: Gouxinyu
 * @Date: 2021-01-08 22:54:00
 */
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!./offscreenCanvas.worker';
import { Params, RulerOuterStyle } from '../index.d';
import CanvasRulerBase from './CanvasRulerBase';

export default class OffscreenCanvasRuler extends CanvasRulerBase {
    private worker: Worker; // worker对象

    constructor(params: Params) {
        super(params);
        this.getCanvas();
        this.drawCanvas();
    }

    /**
     * @description: 绘制canvas
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 17:02:35
     */
    public drawCanvas(): void {
        this.ctxX = this.canvasX.getContext('2d');
        this.ctxY = this.canvasY.getContext('2d');

        const worker = new Worker();

        worker.postMessage({
            type: 'draw',
            rulerId: this.rulerId,
            size: [this.sizeX, this.sizeY],
            style: this.style,
            isInfinite: this.isInfinite,
            devicePixelRatio: window.devicePixelRatio
        });

        worker.onmessage = (e: MessageEvent) => {

            const { imageBitmapX, imageBitmapY } = e.data;

            this.rescaleCanvas(this.canvasX, this.sizeX);
            this.rescaleCanvas(this.canvasY, this.sizeY);

            this.ctxX.drawImage(imageBitmapX, 0, 0, this.canvasX.width, this.canvasX.height);
            this.ctxY.drawImage(imageBitmapY, 0, 0, this.canvasY.width, this.canvasY.height);
        };

        this.worker = worker;
    }

    /**
    * @description: 根据画布缩放刷新标尺
    * @Author: Gouxinyu
    * @param {number} size
    * @Date: 2021-01-08 16:54:15
    */
    public scale(style: RulerOuterStyle): void {
        this.postMessage('scale', style);
    }

    /**
     * @description: 重置canvas大小
     * @Author: Gouxinyu
     * @param {any} styleObject
     * @Date: 2021-01-11 20:52:53
     */
    public resize(styleObject: RulerOuterStyle): void {
        const { size, width, height } = styleObject;
        this.canvasX.width = width;
        this.canvasX.height = size;

        this.canvasY.height = height;
        this.canvasY.width = size;

        this.sizeX.width = width;
        this.sizeX.height = size;

        this.sizeY.width = size;
        this.sizeY.height = height;

        this.isInfinite = styleObject.isInfinite;
        this.postMessage('resize', styleObject);
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
        // 释放内存
        this.canvasX = null;
        this.canvasY = null;
        this.sizeX = null;
        this.sizeY = null;
        this.style = null;
        this.ctxX = null;
        this.ctxY = null;
        this.scrollLeft = null;
        this.scrollTop = null;
        this.isInfinite = null;
        this.devicePixelRatio = null;
        this.rulerId = null;
        this.postMessage('destroy');

        this.worker.onmessage = (e) => {
            if (e.data.message === 'success') {
                this.worker.terminate();
            }
        };
    }

    /**
     * @description: 修改样式
     * @Author: Gouxinyu
     * @param {any} style
     * @Date: 2021-01-11 16:56:22
     */
    public update(style: RulerOuterStyle): void {
        this.postMessage('option', style);
    }

    /**
     * @description: 移动并重新绘制canvas
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-19 11:30:12
     */
    public translateRuler(): void {
        this.postMessage('scroll');
    }

    public postMessage(type: string, style?: RulerOuterStyle): void {
        if (this.worker) {
            this.worker.postMessage({
                type,
                style: {
                    scrollLeft: this.scrollLeft,
                    scrollTop: this.scrollTop,
                    ...style
                }
            });
        }
    }
}
