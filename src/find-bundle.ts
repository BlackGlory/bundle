import { promises as fs } from 'fs'
import { constants } from 'fs'
import { toArrayAsync } from 'iterable-operator'
import * as path from 'path'
import { isFailurePromise } from 'return-style'
import { Bundle } from '@src/types'

export class NoIndexFileError extends Error {
  name = this.constructor.name
}

export class NoMetaFileError extends Error {
  name = this.constructor.name
}

export class TooManyIndexFilesError extends Error {
  name = this.constructor.name
}

export class TooManyMetaFilesError extends Error {
  name = this.constructor.name
}

export class NotDirectoryError extends Error {
  name = this.constructor.name
}

export async function findBundle(rootPath: string): Promise<Bundle> {
  if (!await isDirectory(rootPath)) throw new NotDirectoryError()

  const index = await findIndexFilename(rootPath)
  const meta = await findMetaFilename(rootPath)
  const assets = await findAssetFilenames(rootPath)

  return {
    root: rootPath
  , text: index
  , meta
  , assets
  }
}

async function findIndexFilename(rootPath: string): Promise<string> {
  const filenames = await fs.readdir(rootPath)
  const indexList = filenames
    .map(x => ({
      filename: x
    , basename: getBasename(x)
    }))
    .filter(x => x.basename === 'index')
  if (indexList.length === 1) return indexList[0].filename
  else if (indexList.length > 1) throw new TooManyIndexFilesError()
  else throw new NoIndexFileError()
}

async function findMetaFilename(rootPath: string): Promise<string> {
  const filenames = await fs.readdir(rootPath)
  const metaList = filenames
    .map(x => ({
      filename: x
    , basename: getBasename(x)
    }))
    .filter(x => x.basename === 'meta')

  if (metaList.length === 1) return metaList[0].filename
  else if (metaList.length > 1) throw new TooManyMetaFilesError()
  else throw new NoMetaFileError()
}

async function findAssetFilenames(rootPath: string): Promise<string[]> {
  const assetsPath = path.join(rootPath, 'assets')
  if (!await isDirectory(assetsPath)) return []
  const filenames = await toArrayAsync(getFilenamesRecursively(assetsPath))
  return filenames.map(x => path.relative(rootPath, x))
}

async function isDirectory(path: string): Promise<boolean> {
  if (await isFailurePromise(fs.access(path, constants.R_OK))) return false
  const stat = await fs.stat(path)
  return stat.isDirectory()
}

function getBasename(filename: string): string {
  return path.basename(filename, path.extname(filename))
}

async function* getFilenamesRecursively(dir: string): AsyncIterable<string> {
  const dirents = await fs.readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      const pathname = path.join(dir, dirent.name)
      yield* getFilenamesRecursively(pathname)
    } else {
      const filename = path.join(dir, dirent.name)
      yield filename
    }
  }
}
