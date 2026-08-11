import { cn } from "#/lib/utils";
import { PropsWithChildren } from "react";

export function AppLayout({children}: PropsWithChildren) {
  return (
    <main className="container border rounded-2xl h-[80vh] flex flex-col overflow-hidden">
      <div className="shrink-0 px-2 py-4 border-b flex items-center gap-4">
        <div className="flex items-center gap-2">
            <Dot className="bg-red-500"/>
            <Dot className="bg-yellow-500"/>
            <Dot className="bg-green-500"/>
        </div>

        <code className="text-gray-400">grampo-do-cleitin</code>
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        {children}
      </div>
    </main>
  )
}

interface DotProps {
  className?: string
}

function Dot({className}: DotProps) {
  return <div className={cn("size-3 rounded-full", className)}/>
}