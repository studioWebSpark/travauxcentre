import { getTotalXp, getLevelInfo } from "@/lib/xp"

export default async function XpBar() {
  const totalXp = await getTotalXp()
  const { current, next, progress } = getLevelInfo(totalXp)

  return (
    <div className="px-4 py-3 border-t border-white/10">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{current.icon}</span>
          <span className="text-xs font-bold text-white">{current.label}</span>
          <span className="text-xs text-slate-500 font-semibold">Niv.{current.level}</span>
        </div>
        <span className="text-xs text-slate-400 font-semibold">{totalXp} XP</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${progress}%`, background: current.color }}
        />
      </div>
      {next && (
        <p className="text-xs text-slate-600 mt-1">
          {next.min - totalXp} XP avant {next.label} {next.icon}
        </p>
      )}
    </div>
  )
}
