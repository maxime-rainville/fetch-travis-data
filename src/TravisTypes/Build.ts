export interface Build {
 id: number,
 state: 'failed'|'passed'|'canceled'|'running'|'errored',
 private: boolean,
 started_at: string,
 finished_at: string;
}