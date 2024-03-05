import {
  Tag,
} from '@/lib/definitions';
import {fetchTagListData} from '@/lib/data';


export function Tag({tag}: {
  tag: Tag;
}) {
  return (
    <span
      className="cursor-pointer inline-flex items-center rounded-md font-semibold transition-colors border px-2.5 py-0.5 text-xs bg-slate-50">
      # {tag.label}
    </span>
  )
}

export async function TagWrapper() {
  const {tagList} = await fetchTagListData();
  return (
    <>
      {
        tagList.map((item) => (
          <Tag tag={item}/>
        ))
      }
    </>
  )
}
