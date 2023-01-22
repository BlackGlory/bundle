import { findAllDirnames } from 'extra-filesystem'
import { isntUndefined } from '@blackglory/types'
import { mapAsync, filterAsync } from 'iterable-operator'
import { pipe } from 'extra-utils'
import { buildBundle } from './build-bundle.js'
import { getResultPromise } from 'return-style'
import { IBundle } from './types.js'

export function findAllBundles(path: string): AsyncIterable<IBundle> {
  return pipe(
    findAllDirnames(path)
  , iter => mapAsync(iter, x => getResultPromise(buildBundle(x)))
  , iter => filterAsync(iter, isntUndefined)
  )
}
