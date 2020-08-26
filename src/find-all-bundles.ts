import { promises as fs } from 'fs'
import * as path from 'path'
import { findBundle } from './find-bundle'
import { AsyncIterableOperator } from 'iterable-operator/lib/es2018/style/chaining/async-iterable-operator'
import { getErrorResultPromise } from 'return-style'
import { Bundle } from './types'

export function findAllBundles(path: string): AsyncIterable<Bundle> {
  return new AsyncIterableOperator(getPathnamesRecursively(path))
    .mapAsync(async x => {
      const [err, bundle] = await getErrorResultPromise(findBundle(x))
      if (err) return undefined
      else return bundle
    })
    .filterAsync<Bundle>(x => !!x)
}

async function* getPathnamesRecursively(dir: string): AsyncIterable<string> {
  const dirents = await fs.readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      const pathname = path.join(dir, dirent.name)
      yield pathname
      yield* getPathnamesRecursively(pathname)
    }
  }
}
