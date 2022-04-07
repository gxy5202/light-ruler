/*
 * @Description: 标尺实例状态存储
 * @Author: Gouxinyu
 */
import CanvasRuler from "./components/CanvasRuler";
import { Ruler } from "./index.d";

interface RulerMap {
    rulerId?: CanvasRuler;
}

export interface CanvasRulerController {
    currentRulerId: string;
    rulerMap: RulerMap;
    getRuler: () => CanvasRuler;
    initCanvasRuler: (
        wrapperId: string,
        rulerOptions: Required<Ruler>
    ) => CanvasRulerController;
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
    currentRulerId: "", // 当前显示标尺id

    rulerMap: {}, // 标尺集合

    checkRulerIsExist(rulerId: string): boolean {
        if (this.rulerMap[rulerId]) {
            return true;
        }
        return false;
    },

    // 返回当前标尺对象
    getRuler(): CanvasRuler {
        return this.rulerMap[CanvasRulerController.currentRulerId];
    },

    /**
     * @description: 初始化实例相关配置
     * @Author: Gouxinyu
     * @param {string} wrapperId
     * @param {Ruler} rulerOptions
     * @Date: 2021-01-11 17:56:35
     */
    initCanvasRuler(
        wrapperId: string,
        rulerOptions: Required<Ruler>
    ): CanvasRulerController {
        const id = rulerOptions.rulerId.toString();
        // 如果不存在则生成新的实例
        if (!this.checkRulerIsExist(id)) {
            const ruler = new CanvasRuler(rulerOptions);
            this.rulerMap[id] = ruler;
            this.currentRulerId = id;
            this.selectRuler(id);
        } else {
            this.selectRuler(id);
        }

        return this;
    },

    /**
     * @description: 切换标尺显示
     * @Author: Gouxinyu
     * @param {string} rulerId
     * @Date: 2021-01-11 17:56:35
     */
    selectRuler(rulerId: string): CanvasRulerController {
        const ruler = this.rulerMap[rulerId];
        if (ruler) {
            this.currentRulerId = rulerId.toString();
            ruler.show();
            Object.keys(this.rulerMap).forEach((id) => {
                if (id !== rulerId) {
                    this.rulerMap[id].hide();
                }
            });
        }
        return this;
        // throw new Error(`can not find ruler by id ${rulerId}`);
    },

    /**
     * @description: 从map中删除ruler
     * @Author: Gouxinyu
     * @param {string} rulerId
     * @Date: 2021-01-11 17:56:35
     */
    deleteRuler(rulerId: string): CanvasRulerController | never {
        if (this.rulerMap[rulerId]) {
            this.rulerMap[rulerId].destroy();
            delete this.rulerMap[rulerId];
            if (Object.keys(this.rulerMap).length === 0) {
                this.currentRulerId = "";
            }
            return this;
        }

        throw new Error(`can not find ruler by id ${rulerId}`);
    },

    /**
     * @description: 销毁所有标尺实例
     * @Author: Gouxinyu
     * @Date: 2021-01-11 17:56:35
     */
    destroyAllRulers(): void {
        Object.keys(this.rulerMap).forEach((id) => {
            this.rulerMap[id].destroy();
        });
    },
};
