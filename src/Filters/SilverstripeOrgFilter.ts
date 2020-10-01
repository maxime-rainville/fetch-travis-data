import { Repository } from '../TravisTypes/Repository';
import { noTags } from './noTags';
import { OrgFilter } from './OrgFilter';

const excludedRepos: string[] = [];

export const SilverstripeOrgFilter: OrgFilter = {
  name: () => 'silverstripe',
  includeRepo: ({name}) => excludedRepos.indexOf(name) === -1,
  includeBranch: ({name}) => noTags(name)
}