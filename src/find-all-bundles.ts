import { buildBundle } from './build-bundle'
import { AsyncIterableOperator } from 'iterable-operator/lib/es2018/style/chaining/async-iterable-operator'
import { getResultPromise } from 'return-style'
import { IBundle } from './types'
import { findAllDirnames } from 'extra-filesystem'
import { isntUndefined } from '@blackglory/types'

export function findAllBundles(path: string): AsyncIterable<IBundle> {
  return new AsyncIterableOperator(findAllDirnames(path))
    .mapAsync(x => getResultPromise(buildBundle(x)))
    .filterAsync(isntUndefined)
}
