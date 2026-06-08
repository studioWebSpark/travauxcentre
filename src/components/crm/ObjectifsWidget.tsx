import { getObjectifs } from "@/lib/xp"

const PERIODE_LABEL = { jour: "Aujourd'hui", semaine: "Cette semaine", mois: "Ce mois" }
const PERIODE_COLOR = { jour: "text-blue-600 bg-blue-50 border-blue-200", semaine: "text-purple-600 bg-purple-50 border-purple-200", mois: "text-orange-600 bg-orange-50 border-orange-200" }

export default async function ObjectifsWidget() {
  const objectifs = await getObjectifs()

  const groupes = {
    jour:    objectifs.filter((o) => o.periode === "jour"),
    semaine: objectifs.filter((o) => o.periode === "semaine"),
    mois:    objectifs.filter((o) => o.periode === "mois"),
  } as const

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-bold text-[#0F2C5E] mb-5">Objectifs</h2>
      <div className="space-y-6">
        {(["jour", "semaine", "mois"] as const).map((periode) => (
          <div key={periode}>
            <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${PERIODE_COLOR[periode]}`}>
              {PERIODE_LABEL[periode]}
            </span>
            <div className="mt-3 space-y-3">
              {groupes[periode].map((obj) => {
                const pct = Math.min(100, Math.round((obj.actuel / obj.cible) * 100))
                return (
                  <div key={obj.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{obj.done ? "✅" : "⬜"}</span>
                        <span className={`text-sm ${obj.done ? "text-gray-400 line-through" : "text-gray-700"}`}>
                          {obj.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{obj.actuel}/{obj.cible}</span>
                        {obj.done && (
                          <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
                            +{obj.xpBonus} XP
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full duration-500 ${obj.done ? "bg-green-500" : "bg-[#0F2C5E]"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
