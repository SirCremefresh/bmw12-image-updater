export interface Project {
  fileName: string,
  dirName: string,
  projectData: ProjectData
}

export interface ProjectData {
  name: string,
  dirName: string,
  images: {
    [key: string]: { name: string, tag: string }
  }
}
