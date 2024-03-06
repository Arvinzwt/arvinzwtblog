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
  return  {id: '1cd2f4bf-4f5c-4e18-a5cc-d9c450e3c345', name: 'Blog', path: '/blog'}
}

export async function fetchNavListData() {
  return [
    {id: '0f48d86f-5731-42ec-b44b-2d502f8e565a', name: 'Home', path: '/'},
    {id: '1cd2f4bf-4f5c-4e18-a5cc-d9c450e3c345', name: 'Blog', path: '/blog'},
    {id: '8c919752-a78b-40b9-8014-c9f306177772', name: 'About', path: '/about'},
    {id: 'ebdfc9ac-6445-42f4-b274-25918b83d510', name: 'Setting', path: '/setting'}
  ]
}
