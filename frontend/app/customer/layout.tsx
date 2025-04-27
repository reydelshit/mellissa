import type React from "react"
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col flex-1">{children}</div>
    </div>
  )
}

