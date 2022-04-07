/*
 * @description: 常量
 * @Author: Gouxinyu
 * @Date: 2021-01-18 18:54:03
 */
export const MAX_SIZE = 50; // 标尺最大尺寸
export const SCALE_NUMBER = 2; // 画布放大比例
export const MAX_ROTIO = 20000; // 非无线绘制模式的最大分辨率
export const OVER_SIZE = 800; // 标尺默认加上的延长距离
export const DEFAULT_WIDTH = 1920; // 默认分辨率宽度
export const DEFAULT_HEIGHT = 1080; // 默认分辨率高度

export const RULER_STYLE = {
    size: 20, // 标尺宽度: 横向标尺和纵向标尺相同
    backgroundColor: "#171819",
    fontColor: "#fff",
    fontSize: 12,
    fontWeight: "",
    tickColor: "#4b4d4f",
    unit: {
        backgroundColor: "#171819",
        fontColor: "#fff",
        fontSize: 12,
        text: "px",
    },
    gap: 10,
    maxSize: MAX_SIZE,
    maxWidth: MAX_ROTIO,
    maxHeight: MAX_ROTIO,
    scale: 1,
    show: true,
    mode: "center",
};

export const OPTIONS = {
    mode: "auto",
    type: "wrapped",
    direction: "horizontal",
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    scrollElement: "",
    rulerId: "",
    style: RULER_STYLE,
    onScroll: () => {},
};
