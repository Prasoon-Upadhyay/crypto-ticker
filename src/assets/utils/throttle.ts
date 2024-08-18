

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function throttle<F extends (...args: any[]) => void> (fn: F, wait: number) : (...args: Parameters<F>) => void {

    let lastTime = 0;
    
    return function (this: ThisParameterType<F>,...args: Parameters<F>): void {

        const now = new Date().getTime();

        if (now - lastTime > wait) {

            lastTime = now;
            fn.apply( this , args)
        }
    }

}