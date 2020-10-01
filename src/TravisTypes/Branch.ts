import { Build } from './Build'
import { Repository } from './Repository';

export interface Branch {
  name: string,
  last_build?: Build,
  repository: Repository
}