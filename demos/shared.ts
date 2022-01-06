const ENV = import.meta.env.MODE
export const isProduction = ENV === "production"
export const isDevelopment = ENV === "development"

export function wrapStaticUrl(url: string) {
  return import.meta.env.BASE_URL + url
}
