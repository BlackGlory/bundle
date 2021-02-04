import { findBundle } from './find-bundle'
import { AsyncIterableOperator } from 'iterable-operator/lib/es2018/style/chaining/async-iterable-operator'
import { getErrorResultPromise } from 'return-style'
import { Bundle } from './types'
import { findAllDirnames } from 'extra-filesystem'

export function findAllBundles(path: string): AsyncIterable<Bundle> {
  return new AsyncIterableOperator(findAllDirnames(path))
    .mapAsync(async x => {
      const [err, bundle] = await getErrorResultPromise(findBundle(x))
      if (err) return undefined
      else return bundle
    })
    .filterAsync<Bundle>(x => !!x)
}
