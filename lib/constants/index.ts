export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Blaze Store";
export const APP_DESCRIPTION =
  process.env.APP_DESCRIPTION || "Your one-stop shop for everything cool!";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "https://blaze-store.com";
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaulValues = {
  email: "",
  password: "",
}
export const signUpDefaulValues = {
  name:'',
  email: "",
  password: "",
  confirmPassword:''
}