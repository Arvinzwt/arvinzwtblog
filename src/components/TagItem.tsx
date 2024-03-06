import {TagDefinitions} from '@/lib/definitions';

export function TagItem({tag,}: { tag: TagDefinitions; }) {
  return (
    <span
      className="cursor-pointer inline-flex items-center rounded-md font-semibold transition-colors border px-2.5 py-0.5 text-xs bg-slate-50">
      # {tag.label}
    </span>
  )
}
