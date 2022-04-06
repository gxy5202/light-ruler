/*
 * @description:
 * @Author: Gouxinyu
 * @Date: 2021-12-21 23:20:35
 */
import { createHTMLDom, appendDom } from "../utils/renderDom";

export default class Line {
    private horizontalLineBox!: HTMLElement;

    private verticalLineBox!: HTMLElement;

    static addEvent(options) {
        const box = document.getElementById("box") as HTMLElement;

        const verticalRuler = document.getElementById(
            "canvas-ruler-v-box-hh"
        ) as HTMLElement;

        const horizontalRuler = document.getElementById(
            "canvas-ruler-h-box-hh"
        ) as HTMLElement;

        const vWrapper = createHTMLDom("div", {
            id: "light-ruler-line-v-box",
            class: "light-ruler-line",
            style: `position: absolute;height: 100%`,
        });

        const xWrapper = createHTMLDom("div", {
            id: "light-ruler-line-h-box",
            class: "light-ruler-line",
            style: `position: absolute; width: 100%`,
        });

        appendDom(verticalRuler, vWrapper);
        appendDom(horizontalRuler, xWrapper);

        const vLineBox = document.getElementById("light-ruler-line-v-box");
        const hLineBox = document.getElementById("light-ruler-line-h-box");

        vLineBox.style.transform = `translateX(${0}px)`;
        hLineBox.style.transform = `translateY(${0}px)`;

        verticalRuler.addEventListener(
            "mousedown",
            (e) => {
                const { layerX } = e;
                const time = performance.now();
                const id = `line-text-${time}`;
                const dom = createHTMLDom("div", {
                    id,
                    className: "light-ruler-line-v",
                    style: `position: absolute; background-color:red; width: 1px; height: 100%; transform: translateX(${layerX}px)`,
                });

                appendDom(vLineBox, dom);

                const lineText = document.getElementById(id);

                const allVLines = Array.from(
                    document.querySelectorAll(
                        `.light-ruler-line-v:not([id='${id}'])`
                    )
                );

                const allHLines = Array.from(
                    document.querySelectorAll(`.light-ruler-line-h`)
                );

                const moveEvent = (ev) => {
                    const { path, composedPath, layerX, target } = ev;

                    console.log(ev, "---");
                    allVLines.forEach((v) => {
                        v.classList.add("ligth-ruler-line-disable");
                    });

                    allHLines.forEach((v) => {
                        v.classList.add("ligth-ruler-line-disable");
                    });

                    // 若是标尺内
                    if (
                        path.some((v) =>
                            v.id?.includes("canvas-ruler-v-box-hh")
                        )
                    ) {
                        console.log("in", layerX);
                        lineText.style.transform = `translateX(${layerX}px)`;
                    } else {
                        console.log("out", layerX);
                        lineText.style.transform = `translateX(${
                            20 + layerX
                        }px)`;
                    }
                };

                const upEvent = (ev) => {
                    document.body.style.cursor = "default";

                    allVLines.forEach((v) => {
                        v.classList.remove("ligth-ruler-line-disable");
                    });

                    allHLines.forEach((v) => {
                        v.classList.remove("ligth-ruler-line-disable");
                    });

                    box.removeEventListener("mousemove", moveEvent);
                    box.removeEventListener("mouseup", upEvent);
                };

                lineText.addEventListener(
                    "mousedown",
                    (event) => {
                        event.stopPropagation();

                        document.body.style.cursor = "w-resize";
                        box.addEventListener("mousemove", moveEvent);
                        box.addEventListener("mouseup", upEvent);
                    },
                    false
                );

                lineText.addEventListener("mouseenter", () => {
                    lineText.style.cursor = "w-resize";
                });

                const downEvent = new Event("mousedown", {
                    bubbles: false,
                    cancelable: true,
                });
                lineText.dispatchEvent(downEvent);
                // lineText.style.transform = `translateX(${layerX}px)`;
            },
            false
        );

        horizontalRuler.addEventListener(
            "mousedown",
            (e) => {
                const { layerY } = e;
                const time = performance.now();
                const id = `line-text-${time}`;
                const dom = createHTMLDom("div", {
                    id,
                    className: "light-ruler-line-h",
                    style: `position: absolute; background-color:red; width: 100%; height: 1px; transform: translateY(${layerY}px)`,
                });

                appendDom(hLineBox, dom);

                const lineText = document.getElementById(id);

                const allVLines = Array.from(
                    document.querySelectorAll(`.light-ruler-line-v`)
                );

                const allHLines = Array.from(
                    document.querySelectorAll(
                        `.light-ruler-line-h:not([id='${id}']`
                    )
                );

                const moveEvent = (ev) => {
                    const { pageY } = ev;

                    allVLines.forEach((v) => {
                        v.classList.add("ligth-ruler-line-disable");
                    });

                    allHLines.forEach((v) => {
                        v.classList.add("ligth-ruler-line-disable");
                    });

                    lineText.style.transform = `translateY(${pageY}px)`;
                };

                const upEvent = (ev) => {
                    document.body.style.cursor = "default";

                    allVLines.forEach((v) => {
                        v.classList.remove("ligth-ruler-line-disable");
                    });

                    allHLines.forEach((v) => {
                        v.classList.remove("ligth-ruler-line-disable");
                    });

                    box.removeEventListener("mousemove", moveEvent);
                    box.removeEventListener("mouseup", upEvent);
                };

                lineText.addEventListener(
                    "mousedown",
                    (event) => {
                        event.stopPropagation();

                        document.body.style.cursor = "s-resize";
                        box.addEventListener("mousemove", moveEvent);
                        box.addEventListener("mouseup", upEvent);
                    },
                    false
                );

                lineText.addEventListener("mouseenter", () => {
                    lineText.style.cursor = "s-resize";
                });

                const downEvent = new Event("mousedown", {
                    bubbles: false,
                    cancelable: true,
                });
                lineText.dispatchEvent(downEvent);
                // lineText.style.transform = `translateX(${layerX}px)`;
            },
            false
        );
        // horizontalRuler.addEventListener("mousemove", (e) => {
        //     const { layerX, layerY } = e;

        //     lineText.style.transform = `translateX(${layerX}px)`;
        // });
    }

    static moveVLine(x) {
        const lineBox = document.getElementById("light-ruler-line-v-box");
        lineBox.style.transform = `translateX(${
            -x * (1 / window.devicePixelRatio)
        }px)`;
    }

    static moveHLine(y) {
        const lineBox = document.getElementById("light-ruler-line-h-box");
        lineBox.style.transform = `translateY(${
            -y * (1 / window.devicePixelRatio)
        }px)`;
    }
}
