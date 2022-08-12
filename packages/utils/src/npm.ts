import request from 'axios'
import semver from 'semver'
import semverSort from 'semver-sort'

export interface NpmData {
  _id: string
  _rev: string
  name: string
  versions: string[]
  author: {
    name: string
    email: string
  }
  description: string
}

export const NPM_API_BASE_URL = 'https://registry.npmjs.org'

export const getNpmPackageData = async (packageName: string) => {
  if (!packageName)
    return null
  return (await request.get<NpmData>(`${NPM_API_BASE_URL}/${packageName}`))
    .data
}

export const getNpmVersions = async (packageName: string) => {
  const data = await getNpmPackageData(packageName)
  if (data)
    return Object.keys(data.versions)
  else return []
}

export const getNpmSemverVersions = async (packageName: string, baseVersion: string) => {
  const versions = await getNpmVersions(packageName)
  return semverSort.desc(versions.filter(version => semver.gt(version, baseVersion)))
}

export const getNpmLatestVersion = async (packageName: string) => {
  const versions = await getNpmVersions(packageName)
  if (versions)
    return semverSort.desc(versions)[0]
  return ''
}

