import {TagDefinitions} from '@/lib/definitions'

export async function fetchTagAdd(tag: TagDefinitions) {
  // {
  //   id: string;
  //   color: string;
  //   label: string;
  //
  // }
  return 'ef508d22-e391-4399-9479-187aa697fc21';
}


export async function fetchTagDelete(tagId: string) {
  return true;
}


export async function fetchTagEdit(tag: TagDefinitions) {
  return 'ef508d22-e391-4399-9479-187aa697fc21';
}


export async function fetchTagDetail(tagId: string) {
  return {
    id: 'e5cec4e2-9c66-46bc-8165-8b7a898d69b6',
    color: 'red',
    label: 'tag'
  }
}

export async function fetchTagListData() {
  return [
    {
      id: 'e5cec4e2-9c66-46bc-8165-8b7a898d69b6',
      color: 'red',
      label: 'tag'
    }
  ]
}
