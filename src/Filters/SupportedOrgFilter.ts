import { Branch } from '../TravisTypes/Branch';
import { Repository } from '../TravisTypes/Repository';
import { noTags } from './noTags';
import { OrgFilter } from './OrgFilter';
import { data as ssMetaData} from 'silverstripe-cms-meta'

export class SupportedOrgFilter implements OrgFilter {
  
  constructor(private _name: string) {
    this.name = this.name.bind(this);
    this.includeRepo = this.includeRepo.bind(this);
    this.includeBranch = this.includeBranch.bind(this);
  }

  public name() {
    return this._name;
  }

  public includeRepo({name}: Repository) {
    return !!ssMetaData.find(module => module.repo === `${this._name}/${name}`);
  }
  
  public includeBranch({name}: Branch) {
    return noTags(name)
  }
}