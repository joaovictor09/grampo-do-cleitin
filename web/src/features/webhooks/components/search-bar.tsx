import { CopyButton } from "./copy-button"

interface SearchBarProps {
  url: string
}

export function SearchBar({ url }: SearchBarProps) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-1">
      <div />
      <span className="text-sm text-gray-300">
        {url}
      </span>

      <CopyButton value={url} size="xs" variant="outline" />
    </div>
  )
}