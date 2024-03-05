export type Tag = {
  value: string;
  color: string;
  label: string;
}

export type Blog = {
  id: string,
  date: string,
  title: string,
  path: string,
  tagList: Tag[],
  description: string,
  content: string,
}

export type Nav = {
  id: string,
  name: string,
  path: string
}




