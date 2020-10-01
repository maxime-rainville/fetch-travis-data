import {Command, flags} from '@oclif/command'
import * as Config from '@oclif/config';
import { promises } from 'dns'
import { DnaOrgFilter } from './Filters/DnaOrgFilter';
import { OrgFilter } from './Filters/OrgFilter'
import { SilverstripeOrgFilter } from './Filters/SilverstripeOrgFilter'
import { TravisClient } from './TravisClient'
import { Branch } from './TravisTypes/Branch'
import { Repository } from './TravisTypes/Repository'

class FetchTravisData extends Command {

  private client: TravisClient|undefined;

  static description = 'Fetch build status for silverstripe module'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    token: flags.string({char: 't', description: 'Travis token'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'command'}]

  constructor(argv: string[], config: Config.IConfig) {
    super(argv, config);
    this.buildURL = this.buildURL.bind(this);
    this.print = this.print.bind(this);
    this.getBuildsForOrgs = this.getBuildsForOrgs.bind(this);
    this.getBuildsForOrg = this.getBuildsForOrg.bind(this);
  }

  async run() {
    const {args: {command}, flags: {token}} = this.parse(FetchTravisData)

    const travisToken = token ?? process.env.TRAVIS_TOKEN;

    if (!travisToken) {
      this.error('You must provide a travis token with `--token` or with TRAVIS_TOKEN environement variable.');
      return;
    }

    this.client = new TravisClient(travisToken);

    switch (command) {
      case 'printFailed':
        this.printFailed();
        break;
      case 'toJson':
        this.toJson();
        break;
    }    
  }

  async printFailed() {
    this.getBuildsForOrgs([SilverstripeOrgFilter, DnaOrgFilter])
      .then(branches => branches.filter(branch => branch.last_build && ['failed','errored'].indexOf(branch.last_build?.state) !== -1))
      .then((failedBranches) => {
        failedBranches.forEach(this.print);
      })
  }

  async toJson() {
    this.getBuildsForOrgs([SilverstripeOrgFilter, DnaOrgFilter])
      .then((branches) => {
        let results: any = {}

        branches.forEach(({last_build, repository: {slug}, name}) => {
          if (!last_build) {
            return;
          }

          if (!results[slug]) {
            results[slug] = {};
          }

          const {state, started_at, id} = last_build

          results[slug][name] = {state, started_at, id};
        });

        return results;
      })
      .then(JSON.stringify)
      .then(this.log);
  }

  print(branch: Branch) {
    let stateColour;
    switch (branch.last_build?.state) {
      case "failed":
        stateColour = `\x1b[41m`;
        break;
      case "passed":
        stateColour = `\x1b[42m`;
        break;
      case "running":
        stateColour = `\x1b[43m`;
        break;
      case "errored":
        stateColour = `\x1b[45m`;
        break;
      default:
        stateColour = `\x1b[46m`;
    }

    const url = branch.last_build ? this.buildURL(branch.repository.slug, branch.last_build.id) : '';

    this.log(`\x1b[36m${branch.repository.slug}\x1b[0m:\x1b[35m${branch.name}\x1b[0m \t${stateColour} ${branch.last_build?.state} \x1b[0m \t${url}`)
  }

  private getBuildsForOrgs(orgs: OrgFilter[]): Promise<Branch[]> {
    return Promise.all(
      orgs.map(this.getBuildsForOrg)
    ).then((branches: any[]) => [].concat(...branches));
  }

  private getBuildsForOrg(org: OrgFilter): Promise<Branch[]> {
    if (!this.client) {
      this.error('Client has not been initialsed');
    }

    const client = this.client;

    return client.getRepos(org.name())
      .then((repos: Repository[]) => repos.filter(org.includeRepo))
      .then((repos: Repository[]) => Promise.all(repos.map(({slug}) => client.getBranches(slug))))
      .then((branches: any[]) => [].concat(...branches))
      .then((branches: Branch[]) => branches.filter(org.includeBranch))
  }

  private buildURL(slug: string, id: number) {
    return `https://travis-ci.org/github/${slug}/builds/${id}`;
  }

}

export = FetchTravisData
