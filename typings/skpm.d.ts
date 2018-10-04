/*
global types made available via building with SKPM
*/

interface Console {
    assert(condition?: boolean, message?: string, ...data: any[]): void;
    clear(): void;
    count(label?: string): void;
    debug(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
    group(groupTitle?: string, ...optionalParams: any[]): void;
    groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void;
    groupEnd(): void;
    info(message?: any, ...optionalParams: any[]): void;
    log(message?: any, ...optionalParams: any[]): void;
    time(label?: string): void;
    timeEnd(label?: string): void;
    warn(message?: any, ...optionalParams: any[]): void;
}
declare var console: Console;

declare function clearInterval(handle?: number): void;
declare function clearTimeout(handle?: number): void;
declare function setInterval(handler: TimerHandler, timeout?: number, ...arguments: any[]): number;
declare function setTimeout(handler: TimerHandler, timeout?: number, ...arguments: any[]): number;
// untyped out of laziness
declare function fetch(input: any, init?: any): Promise<any>;
