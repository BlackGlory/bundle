import { toArrayAsync } from 'iterable-operator'
import * as path from 'path'
import { IBundle } from '@src/types'
import { findAllFilenames, isDirectory, pathExists } from 'extra-filesystem'
import { CustomError } from '@blackglory/errors'
import * as fs from 'fs/promises'

export class NoIndexFileError extends CustomError {}
export class NoMetaFileError extends CustomError {}
export class TooManyIndexFilesError extends CustomError {}
export class TooManyMetaFilesError extends CustomError {}
export class NotDirectoryError extends CustomError {}

/**
 * @throws {NotDirectoryError}
 * @throws {TooManyIndexFilesError}
 * @throws {NoIndexFileError}
 * @throws {TooManyMetaFilesError}
 * @throws {NoMetaFileError}
 */
export async function findBundle(rootPath: string): Promise<IBundle> {
  if (!await isDirectory(rootPath)) throw new NotDirectoryError()

  const index = await findIndexFilename(rootPath)
  const meta = await findMetaFilename(rootPath)
  const assets = await findAssetFilenames(rootPath)

  return {
    root: rootPath
  , index
  , meta
  , assets
  }
}

/**
 * @throws {TooManyIndexFilesError} 
 * @throws {NoIndexFileError}
 */
async function findIndexFilename(rootPath: string): Promise<string> {
  const filenames = await fs.readdir(rootPath)
  const indexList = filenames
    .map(x => ({
      filename: x
    , basename: getBasename(x)
    }))
    .filter(x => x.basename === 'index')

  if (indexList.length === 1) return indexList[0].filename
  if (indexList.length > 1) throw new TooManyIndexFilesError()
  throw new NoIndexFileError()
}

/**
 * @throws {TooManyMetaFilesError} 
 * @throws {NoMetaFileError}
 */
async function findMetaFilename(rootPath: string): Promise<string> {
  const filenames = await fs.readdir(rootPath)
  const metaList = filenames
    .map(x => ({
      filename: x
    , basename: getBasename(x)
    }))
    .filter(x => x.basename === 'meta')

  if (metaList.length === 1) return metaList[0].filename
  if (metaList.length > 1) throw new TooManyMetaFilesError()
  throw new NoMetaFileError()
}

async function findAssetFilenames(rootPath: string): Promise<string[]> {
  const assetsPath = path.join(rootPath, 'assets')
  if (!await pathExists(assetsPath)) return []
  if (!await isDirectory(assetsPath)) return []

  const filenames = await toArrayAsync(findAllFilenames(assetsPath))
  return filenames.map(x => path.relative(rootPath, x))
}

function getBasename(filename: string): string {
  return path.basename(filename, path.extname(filename))
}
