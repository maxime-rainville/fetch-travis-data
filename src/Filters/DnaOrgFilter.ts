import { Repository } from '../TravisTypes/Repository';
import { noTags } from './noTags';
import { OrgFilter } from './OrgFilter';

const includedRepos: string[] = [
  'silverstripe-elemental',
  'silverstripe-elemental-userforms',
  'silverstripe-elemental-subsites'
];

export const DnaOrgFilter: OrgFilter = {
  name: () => 'dnadesign',
  includeRepo: ({name}) => includedRepos.indexOf(name) !== -1,
  includeBranch: ({name}) => noTags(name)
}