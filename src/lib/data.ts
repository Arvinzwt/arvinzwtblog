export const TITLE = 'Record casually';
export const DESCRIPTION = 'Just to record life';

export async function fetchTagListData() {
  return {
    tagList: [
      {
        id: 'e5cec4e2-9c66-46bc-8165-8b7a898d69b6',
        color: 'red',
        label: 'tag'
      }
    ]
  }
}

export async function fetchBlogListData() {
  return {
    blogList: [
      {
        id: '10e39ad6-9a8e-4957-9c13-62aebfe4f425',
        date: '2023/03/05',
        title: '这是个测试数据',
        path: '/blog/detail',
      }
    ]
  }
}

export async function fetchBlogDetailData() {
  return {
    id: '999e0a01-b41a-4787-a344-670c71e0ca99',
    date: '2023/03/05',
    title: '这是个测试数据',
    path: '/blog/detail',
    tag: {
      value: 'e5cec4e2-9c66-46bc-8165-8b7a898d69b6',
      color: 'red',
      label: 'tag'
    },
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
    {id: '0f48d86f-5731-42ec-b44b-2d502f8e565a', name: 'Home', path: '/'},
    {id: '1cd2f4bf-4f5c-4e18-a5cc-d9c450e3c345', name: 'Blog', path: '/blog'},
    {id: '8c919752-a78b-40b9-8014-c9f306177772', name: 'About', path: '/blog/about'},
    {id: 'ebdfc9ac-6445-42f4-b274-25918b83d510', name: 'Setting', path: '/blog/setting'}
  ]
}

