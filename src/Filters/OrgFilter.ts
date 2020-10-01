import { Branch } from '../TravisTypes/Branch';
import { Repository } from '../TravisTypes/Repository';

/**
 * Provides the information necessary to know which repo and branch on an org should be included
 */
export interface OrgFilter {
  name(): string;
  includeRepo(repo: Repository): boolean;
  includeBranch(branch: Branch): boolean;
}