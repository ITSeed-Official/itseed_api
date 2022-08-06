interface Options {
    skipEmailVerifyCheck?: boolean;
}
export declare function Auth(options?: Options): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export {};
