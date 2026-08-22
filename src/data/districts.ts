import { allUniqueCities, statesAndUTs } from './indiaStates';

export const districts = Array.from(new Set([
  ...statesAndUTs,
  ...allUniqueCities
])).sort();
