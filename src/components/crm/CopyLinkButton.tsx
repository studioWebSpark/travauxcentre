"use client"

import { useState } from "react"
import { Copy, CheckCircle } from "lucide-react"

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <button onClick={copy}
      className="w-full flex items-center justify-center gap-2 bg-[#F8F7F4] text-[#0F2C5E] font-semibold py-2 rounded-xl hover:bg-gray-100 transition-colors text-xs">
      {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Lien copié !" : "Copier le lien portail"}
    </button>
  )
}
