import { Resolver } from 'dns';
// @ts-ignore
import { Client } from "node-rest-client";
import { Repository } from './TravisTypes/Repository';

class TravisClient
{

    private client: Client;

    constructor(private token: string) {
        this.client = new Client();
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getBranches = this.getBranches.bind(this);
    }

    private args() {
        return {
            headers: {
                "Content-Type": "application/json",
                'Travis-API-Version': 3,
                'User-Agent': 'API Explorer',
                Authorization: `token ${this.token}`
            }
        };
    }

    public get(endpoint: string, parameters: any = {}): Promise<any> {
        return new Promise( (resolve) => {
            this.client.get(
                `https://api.travis-ci.org/${endpoint}`,
                {...this.args(), parameters}, 
                (data: any) => resolve(data)
            )
        });
    }

    public getAll(endpoint: string, key:string, parameters: any = {}): Promise<any> {
        return this.get(endpoint, parameters).then(data => {
            const {is_last, next}  = data['@pagination'];
            if (is_last) {
                return data;
            } else {
                const pageData = data[key];
                const {limit, offset} = next;
                return this.getAll(endpoint, key, {...parameters, limit, offset})
                .then(followupData => ({
                    ...data,
                    [key]: [...pageData, ...followupData[key]]
                })) 
            }
        })
    }

    
    public getRepos(org: string): Promise<Repository[]> {
        return this.getAll(
            `owner/github/${org}/repos`, 
            'repositories', 
            {private: false, active: true}
            )
            .then(data => data['repositories'])
            .catch((error: any) => {
                console.error(error); 
                return []
            });
    }

    public getBranches(repo: string) {
        return this.getAll(`repo/${encodeURIComponent(repo)}/branches`, 'branches', {exists_on_github: true})
            .then(data => data.branches)
            .catch((error) => {
                console.error(error);
                return false;
            });
    }


}

export {TravisClient};