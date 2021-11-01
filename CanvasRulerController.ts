/*
 * @Description: 标尺实例状态存储
 * @Author: Gouxinyu
 */
import CanvasRuler from './components/CanvasRuler';
import { Ruler } from './index.d';

interface RulerMap {
    rulerId?: CanvasRuler;
}

export interface CanvasRulerController {
    currentRulerId: string;
    rulerMap: RulerMap;
    getRuler: () => CanvasRuler;
    initCanvasRuler: (wrapperId: string, rulerOptions: Ruler) => CanvasRulerController;
    selectRuler: (rulerId: string) => CanvasRulerController;
    deleteRuler: (rulerId: string) => CanvasRulerController;
    checkRulerIsExist: (rulerId: string) => boolean;
    destroyAllRulers: () => void;
}

/**
 * @description: 单例模式，统一rulerMap状态管理
 * @Author: Gouxinyu
 * @param {*} void
 * @Date: 2020-12-25 16:58:48
 */

export const CanvasRulerController: CanvasRulerController = {
    currentRulerId: '', // 当前显示标尺id

    rulerMap: {}, // 标尺集合

    checkRulerIsExist: (rulerId: string): boolean => {
        if (CanvasRulerController.rulerMap[rulerId]) {
            return true;
        }
        return false;
    },

    // 返回当前标尺对象
    getRuler: (): CanvasRuler => CanvasRulerController.rulerMap[CanvasRulerController.currentRulerId],

    /**
     * @description: 初始化实例相关配置
     * @Author: Gouxinyu
     * @param {string} wrapperId
     * @param {Ruler} rulerOptions
     * @Date: 2021-01-11 17:56:35
     */
    initCanvasRuler: (wrapperId: string, rulerOptions: Ruler): CanvasRulerController => {
        const id = rulerOptions.rulerId.toString();
        // 如果不存在则生成新的实例
        if (!CanvasRulerController.checkRulerIsExist(id)) {
            const ruler = new CanvasRuler(wrapperId, rulerOptions);
            CanvasRulerController.rulerMap[id] = ruler;
            CanvasRulerController.currentRulerId = id;
            CanvasRulerController.selectRuler(id);
        } else {
            CanvasRulerController.selectRuler(id);
        }

        return CanvasRulerController;
    },

    /**
     * @description: 切换标尺显示
     * @Author: Gouxinyu
     * @param {string} rulerId
     * @Date: 2021-01-11 17:56:35
     */
    selectRuler: (rulerId: string): CanvasRulerController => {
        const ruler = CanvasRulerController.rulerMap[rulerId];
        if (ruler) {
            CanvasRulerController.currentRulerId = rulerId.toString();
            ruler.show();
            Object.keys(CanvasRulerController.rulerMap).forEach((id) => {
                if (id !== rulerId) {
                    CanvasRulerController.rulerMap[id].hide();
                }
            });
            return CanvasRulerController;
        }

        // throw new Error(`can not find ruler by id ${rulerId}`);
    },

    /**
     * @description: 从map中删除ruler
     * @Author: Gouxinyu
     * @param {string} rulerId
     * @Date: 2021-01-11 17:56:35
     */
    deleteRuler: (rulerId: string): CanvasRulerController | never => {
        if (CanvasRulerController.rulerMap[rulerId]) {
            CanvasRulerController.rulerMap[rulerId].destroy();
            delete CanvasRulerController.rulerMap[rulerId];
            if (Object.keys(CanvasRulerController.rulerMap).length === 0) {
                CanvasRulerController.currentRulerId = '';
            }
            return CanvasRulerController;
        }

        throw new Error(`can not find ruler by id ${rulerId}`);
    },

    /**
     * @description: 销毁所有标尺实例
     * @Author: Gouxinyu
     * @Date: 2021-01-11 17:56:35
     */
    destroyAllRulers: (): void => {
        Object.keys(CanvasRulerController.rulerMap).forEach((id) => {
            CanvasRulerController.rulerMap[id].destroy();
        });
    }
};
