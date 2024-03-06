import {TagItem} from "./TagItem";
import {fetchTagListData} from '@/lib/data';

export async function TagsWrapper() {
  const {tagList} = await fetchTagListData();
  return (
    <>
      {
        tagList.map((item) => (
          <TagItem key={item.id} tag={item}/>
        ))
      }
    </>
  )
}
