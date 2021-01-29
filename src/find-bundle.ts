import { toArrayAsync } from 'iterable-operator'
import * as path from 'path'
import { Bundle } from '@src/types'
import { findAllFilenames, isDirectory } from 'extra-filesystem'
import { CustomError } from '@blackglory/errors'
import * as fs from 'fs-extra'

export class NoIndexFileError extends CustomError {}
export class NoMetaFileError extends CustomError {}
export class TooManyIndexFilesError extends CustomError {}
export class TooManyMetaFilesError extends CustomError {}
export class NotDirectoryError extends CustomError {}

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
  if (!await fs.pathExists(assetsPath) || !await isDirectory(assetsPath)) return []

  const filenames = await toArrayAsync(findAllFilenames(assetsPath))
  return filenames.map(x => path.relative(rootPath, x))
}

function getBasename(filename: string): string {
  return path.basename(filename, path.extname(filename))
}
