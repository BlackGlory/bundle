import { toArrayAsync } from 'iterable-operator'
import * as path from 'path'
import { IBundle } from '@src/types.js'
import { findAllFilenames, isDirectory, pathExists } from 'extra-filesystem'
import { CustomError } from '@blackglory/errors'
import * as fs from 'fs/promises'

export class NoTextFileError extends CustomError {}
export class NoMetaFileError extends CustomError {}
export class TooManyTextFilesError extends CustomError {}
export class TooManyMetaFilesError extends CustomError {}
export class NotDirectoryError extends CustomError {}

/**
 * @throws {NotDirectoryError}
 * @throws {TooManyTextFilesError}
 * @throws {NoTextFileError}
 * @throws {TooManyMetaFilesError}
 * @throws {NoMetaFileError}
 */
export async function buildBundle(path: string): Promise<IBundle> {
  if (!await isDirectory(path)) throw new NotDirectoryError()

  const text = await findTextFilename(path)
  const meta = await findMetaFilename(path)
  const assets = await findAssetFilenames(path)

  return {
    root: path
  , text
  , meta
  , assets
  }
}

/**
 * @throws {TooManyTextFilesError} 
 * @throws {NoTextFileError}
 */
async function findTextFilename(rootPath: string): Promise<string> {
  const filenames = await fs.readdir(rootPath)
  const indexList = filenames
    .map(x => ({
      filename: x
    , basename: getBasename(x)
    }))
    .filter(x => x.basename === 'text')

  if (indexList.length === 1) return indexList[0].filename
  if (indexList.length > 1) throw new TooManyTextFilesError()
  throw new NoTextFileError()
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
