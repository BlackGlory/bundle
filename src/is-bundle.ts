import {
  buildBundle
, NotDirectoryError
, NoMetaFileError
, NoTextFileError
, TooManyMetaFilesError
, TooManyTextFilesError
} from './build-bundle.js'

export async function isBundle(pathname: string): Promise<boolean> {
  try {
    await buildBundle(pathname)

    return true
  } catch (e) {
    if (e instanceof NotDirectoryError) return false
    if (e instanceof NoMetaFileError) return false
    if (e instanceof NoTextFileError) return false
    if (e instanceof TooManyMetaFilesError) return false
    if (e instanceof TooManyTextFilesError) return false
    throw e
  }
}
