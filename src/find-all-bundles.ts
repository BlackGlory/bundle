import { findAllDirnames } from 'extra-filesystem'
import { mapAsync, filterAsync } from 'iterable-operator'
import { pipe, isntUndefined } from 'extra-utils'
import { buildBundle } from './build-bundle.js'
import { getResultPromise } from 'return-style'
import { IBundle } from './types.js'

export function findAllBundles(pathname: string): AsyncIterable<IBundle> {
  return pipe(
    findAllDirnames(pathname)
  , dirnames => mapAsync(dirnames, x => getResultPromise(buildBundle(x)))
  , dirnames => filterAsync(dirnames, isntUndefined)
  )
}
