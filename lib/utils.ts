import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convers a prisma object to normal js object
export function convertToPlainObject<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

//Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

//format errors

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error: any) {
  if (error.name === "ZodError") {
    //handle zod validation error
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );
    return fieldErrors.join(', ')
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    //handle prsima validation error
    const field = error.meta?.target ? error.meta.target[0] : 'Field'
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exist`;
  } else {
    //handle other errors
    return typeof error.message === "string" ? error.message : JSON.stringify(error);
  }
}

// round number to 2 decimal places 
export function round2(value: number | string ) {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if(typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error ('value is not a number nor string')
  }
}

export const CURRENCY_FORMATTER =  new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: "currency",
  minimumFractionDigits:2
})

// format cuurency using the above formatter
export function formatCurrency(amount: number | string | null) {
  if (typeof amount ==='number') {
    return CURRENCY_FORMATTER.format(amount)
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount))
  } else {
    return 'NaN';
  }
}