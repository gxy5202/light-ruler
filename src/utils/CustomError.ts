/*
 * @description:
 * @Author: Gouxinyu
 * @Date: 2021-12-01 20:48:26
 */
/**
 * @description: 自定义错误信息
 * @Author: Gouxinyu
 * @Date: 2021-01-18 20:22:18
 */

class CustomError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CustomError";
        this.message = message;
    }
}

export default function (message: string): never {
    throw new CustomError(message);
}
