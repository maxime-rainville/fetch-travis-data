import { Branch } from './Branch';

export interface Repository {
 id: number,
 name: string,
 slug: string,
 active: boolean,
 private: boolean,
 default_branch: Branch,
 active_on_org: boolean
}