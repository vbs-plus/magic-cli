export interface ProjectInfo {
  name: string
  projectName: string
  type: 'project' | 'component'
  npmName: string
  projectVersion: string
  projectDescription: string
  dir: string
}
