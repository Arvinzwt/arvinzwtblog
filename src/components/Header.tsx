import {TITLE, DESCRIPTION} from '@/api/common'

export async function Header() {
  return (
    <header className="flex items-end	gap-3">
      <h3 className="leading-7">{TITLE}</h3>
      <span className="leading-7">{DESCRIPTION}</span>
    </header>
  )
}
