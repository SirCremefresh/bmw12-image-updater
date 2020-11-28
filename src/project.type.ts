export interface Project {
  fileName: string,
  projectData: ProjectData
}

export interface ProjectData {
  name: string,
  images: {
    [key: string]: { name: string, tag: string }
  }
}
