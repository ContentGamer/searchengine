import { CYAN, RED, RESET, YELLOW } from "./colors";

export function log(message: string){
    const date = new Date(Date.now());
    console.error(`${CYAN}[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]${RESET} ${message}`)
}
export function logError(message: string){
    const date = new Date(Date.now());
    console.error(`${RED}[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]${RESET} ${message}`)
}
export function logWarn(message: string){
    const date = new Date(Date.now());
    console.error(`${YELLOW}[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]${RESET} ${message}`)
}