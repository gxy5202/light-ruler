/*
 * @description: 单例模式 事件方法
 * @Author: Gouxinyu
 * @Date: 2020-12-28 15:04:09
 */
import throwCustomError from './CustomError';

export const events = {
    /**
     * @description: 绑定事件
     * @Author: Gouxinyu
     * @param {any} target
     * @param {string} type
     * @param {Function} event
     * @Date: 2021-01-11 16:07:08
     */
    on: (target: any, type: string, event: Function): void => {
        if (!target) {
            throwCustomError(`target: ${target} can not find the dom to addEventListener`);
        } else {
            target.addEventListener(type, event, false);
        }
    },

    /**
     * @description: 解绑事件
     * @Author: Gouxinyu
     * @param {any} target
     * @param {string} type
     * @param {Function} event
     * @Date: 2021-01-11 16:07:14
     */
    off: (target: any, type: string, event: Function): void => {
        if (!target) {
            throwCustomError(`target: ${target} can not find the dom to removeEventListener`);
        }
        target.removeEventListener(type, event, false);
    },

    locked: false, // 节流事件标识

    /**
    * @description: 节流方法
    * @Author: Gouxinyu
    * @param {Function} event
    * @Date: 2021-01-11 14:06:45
    */
    throttle: (event: FrameRequestCallback): void => {
        if (!events.locked) {
            events.locked = true;
            window.requestAnimationFrame(event);
        }
    }
};
