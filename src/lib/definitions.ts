export type TagDefinitions = {
  id: string;
  color: string;
  label: string;
}

export type BlogDefinitions = {
  id: string,
  date: string,
  title: string,
  path: string,
  tagList: TagDefinitions[],
  description: string,
  content: string,
}

export type NavDefinitions = {
  id: string,
  name: string,
  path: string
}




