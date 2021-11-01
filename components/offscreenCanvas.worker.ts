/*
 * @Description: canvas离屏渲染
 * @Author: Gouxinyu
 */
import CanvasRulerBase from './CanvasRulerBase';

// eslint-disable-next-line no-restricted-globals
const worker: Worker = self as any;
let canvas: WorkerCanvasRuler;
class WorkerCanvasRuler extends CanvasRulerBase {
    private imageBitmapX: ImageBitmap; // offscreencanvas 映射到主线程对象

    private imageBitmapY: ImageBitmap; // offscreencanvas 映射到主线程对象

    private messageData: any; // worker事件自定义数据

    constructor(e: MessageEvent) {
        const { data } = e;
        super(data.rulerId, data.style, data.isInfinite, data);
        this.messageData = data;
        this.getCanvas();
        this.drawCanvas();
    }

    /**
     * @description: 重写获取canvas方法
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-19 12:24:54
     */
    public getCanvas(): void {
        [this.sizeX, this.sizeY] = this.messageData.size;
        this.canvasX = new OffscreenCanvas(this.sizeX.width, this.sizeX.height);
        this.canvasY = new OffscreenCanvas(this.sizeY.width, this.sizeY.height);
        this.style = this.messageData.style;
    }

    /**
     * @description: 绘制canvas
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-19 12:24:39
     */
    public drawCanvas(): void {
        this.ctxX = this.canvasX.getContext('2d');
        this.ctxY = this.canvasY.getContext('2d');

        this.rescaleCanvas(this.canvasX, this.sizeX);
        this.rescaleCanvas(this.canvasY, this.sizeY);

        // 绘制横向标尺
        this.draw(this.ctxX, 'horizontal');
        // 绘制纵向标尺
        this.draw(this.ctxY, 'vertical');

        this.postMessage();
    }

    /**
     * @description: 向主线程发送消息，将canvas绘制到屏幕
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-18 00:44:25
     */
    public postMessage(): void {
        this.imageBitmapX = (this.canvasX as OffscreenCanvas).transferToImageBitmap();
        this.imageBitmapY = (this.canvasY as OffscreenCanvas).transferToImageBitmap();

        worker.postMessage({
            imageBitmapX: this.imageBitmapX,
            imageBitmapY: this.imageBitmapY
        }, [this.imageBitmapX, this.imageBitmapY]);
    }

    /**
    * @description: 根据画布缩放刷新标尺
    * @Author: Gouxinyu
    * @param {rulerStyle} style
    * @Date: 2021-01-08 16:54:15
    */
    public scale(): void {
        // 绘制横向标尺
        this.draw(this.ctxX, 'horizontal', this.style.scrollLeft);
        // 绘制纵向标尺
        this.draw(this.ctxY, 'vertical', this.style.scrollTop);

        this.postMessage();
    }

    /**
     * @description: 重置canvas大小
     * @Author: Gouxinyu
     * @param {any} styleObject
     * @Date: 2021-01-11 20:52:53
     */
    public resize(): void {
        const { size, width, height } = this.style;
        this.canvasX.width = width;
        this.canvasX.height = size;

        this.canvasY.height = height;
        this.canvasY.width = size;

        this.sizeX.width = width;
        this.sizeX.height = size;

        this.sizeY.width = size;
        this.sizeY.height = height;

        this.rescaleCanvas(this.canvasX, this.sizeX);
        this.rescaleCanvas(this.canvasY, this.sizeY);

        this.isInfinite = this.style.isInfinite;
        // 绘制横向标尺
        this.draw(this.ctxX, 'horizontal', this.style.scrollLeft);
        // 绘制纵向标尺
        this.draw(this.ctxY, 'vertical', this.style.scrollTop);

        this.postMessage();
    }

    /**
     * @description: 修改canvas样式
     * @Author: Gouxinyu
     * @param {any} style
     * @Date: 2021-01-11 16:31:37
     */
    public update(): void {
        // 绘制横向标尺
        this.draw(this.ctxX, 'horizontal', this.style.scrollLeft);
        // 绘制纵向标尺
        this.draw(this.ctxY, 'vertical', this.style.scrollTop);

        this.postMessage();
    }

    /**
     * @description: qingkong
     * @Author: Gouxinyu
     * @param {*}
     * @Date: 2021-01-11 17:12:33
     */
    public destroy(): void {
        // 清空画布
        this.clearCanvas();
        this.canvasX = null;
        this.canvasY = null;
        this.sizeX = null;
        this.sizeY = null;
        this.style = null;
        this.messageData = null;
        this.ctxX = null;
        this.ctxY = null;
        this.scrollLeft = null;
        this.scrollTop = null;
        this.isInfinite = null;
        this.devicePixelRatio = null;
        this.rulerId = null;
        this.imageBitmapX.close();
        this.imageBitmapY.close();
        // 释放内存
        canvas = null;
        worker.postMessage('success');
    }
}

worker.addEventListener('message', (e: MessageEvent) => {
    const { data } = e;
    switch (data.type) {
        case 'draw': { // 绘制canvas
            canvas = new WorkerCanvasRuler(e);
            break;
        }
        case 'scroll': { // 滚动重绘
            canvas.translateRuler(data.style.scrollLeft, data.style.scrollTop);
            canvas.postMessage();
            break;
        }
        case 'scale': { // 缩放canvas
            if (canvas) {
                canvas.style = data.style;
                canvas.scale();
            }
            break;
        }
        case 'resize': { // 重置画布大小
            if (canvas) {
                canvas.style = data.style;
                canvas.resize();
            }
            break;
        }
        case 'option': { // 修改样式配置项
            if (canvas) {
                canvas.style = data.style;
                canvas.update();
            }
            break;
        }
        case 'destroy': { // 销毁实例
            canvas.destroy();
            break;
        }
        default: {
            break;
        }
    }
}, false);

export default null as any;
