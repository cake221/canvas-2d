export type PartialOmit<T, K extends keyof T> = Partial<Omit<T, K>>
// TODO: 递归将子对象的type都去掉
export type OmitType<T> = Omit<T, "type">
