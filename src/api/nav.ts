import {NavDefinitions} from '@/lib/definitions'

export async function fetchNavAdd(tag: NavDefinitions) {
  // {
  //   value: string;
  //   color: string;
  //   label: string;
  //
  // }
  return 'ef508d22-e391-4399-9479-187aa697fc21';
}

export async function fetchNavDelete(navId: string) {
  return true;
}

export async function fetchNavEdit(blog: NavDefinitions) {
  return 'ef508d22-e391-4399-9479-187aa697fc21';
}

export async function fetchNavDetail(navId: string) {
  return {
    id: '999e0a01-b41a-4787-a344-670c71e0ca99',
    date: '2023/03/05',
    title: 'this is test message',
    path: '/blog/999e0a01-b41a-4787-a344/',
    tags: [{
      value: 'e5cec4e2-9c66-46bc-8165-8b7a898d69b6',
      color: 'red',
      label: 'tag'
    }],
    description: '这是个描述数据',
    content: `<p>I’ve been part of the internet startup scene for a while. There are so many different camps: the
          bootstrappers, the VC-backed tech-bros, the crypto “investors”, the people marketing their courses on
          marketing courses, the newsletter gurus, the micro-saas homeboys. The list goes on.</p>
        <p>I’ve been part of the internet startup scene for a while. There are so many different camps: the
          bootstrappers, the VC-backed tech-bros, the crypto “investors”, the people marketing their courses on
          marketing courses, the newsletter gurus, the micro-saas homeboys. The list goes on.</p>
        <p>I’ve been part of the internet startup scene for a while. There are so many different camps: the
          bootstrappers, the VC-backed tech-bros, the crypto “investors”, the people marketing their courses on
          marketing courses, the newsletter gurus, the micro-saas homeboys. The list goes on.</p>`,
  }
}

export async function fetchNavListData() {
  return [
    {
      id: '10e39ad6-9a8e-4957-9c13-62aebfe4f425',
      date: '2023/03/05',
      title: '这是个测试数据',
      path: '/blog/first',
    }
  ]
}
