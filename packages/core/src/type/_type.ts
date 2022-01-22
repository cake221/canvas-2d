export type PartialOmit<T, K extends keyof T> = Partial<Omit<T, K>>
// TODO: 所有的数据都是 可选的
export type OmitType<T> = Partial<Omit<T, "type">>

export interface DATA {
  title: string
  description?: string
  type: any
}
