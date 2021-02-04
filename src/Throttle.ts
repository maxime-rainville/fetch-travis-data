/**
 * Simple throttle to avoid sending too many concurrent request
 */
export class Throttle
{

    private queue: [(response: any) => any, () => Promise<any>][] = [];

    /**
     * @param workers Number of concurrent request we tolerate.
     */
    constructor(private workers: number) {
        this.throttle = this.throttle.bind(this);
        this.runQueue = this.runQueue.bind(this);
        this.run = this.run.bind(this);
    }

    public throttle(callback: () => Promise<any>): Promise<any> {
        // If we still have workers avaliable, run the job right away
        if (this.workers > 0) {
            return new Promise((resolve) => this.run(resolve, callback));
        }

        // Otherwise queue
        return new Promise((resolve) => {
            this.queue.push([resolve, callback]);
        });
    }

    private runQueue() {
        const job = this.queue.shift();
        if (!job) {
            return;
        }
        this.run(...job);
    }   

    private run(resolve: (response: any) => any, callback: () => Promise<any>): void {
        this.workers--;
        callback().then((response: any) => {
            this.workers++;
            this.runQueue();
            resolve(response);
        });
    }
}

