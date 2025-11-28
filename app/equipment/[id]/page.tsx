"use client"

import Link from "next/link"
import { use } from "react"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EQUIPMENT_CATALOG, GYM_EQUIPMENT, GYMS } from "@/lib/mock-data"

export default function EquipmentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const equipment = EQUIPMENT_CATALOG.find((eq) => eq.id === id)

  if (!equipment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">장비를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const gymEquipments = GYM_EQUIPMENT.filter((ge) => ge.equipmentCatalogId === equipment.id)
  const gymsWithEquipment = gymEquipments
    .map((ge) => {
      const gym = GYMS.find((g) => g.id === ge.gymId)
      return gym ? { ...gym, quantity: ge.quantity } : null
    })
    .filter(Boolean)

  const categoryLabels: Record<string, string> = {
    upper: "상체",
    lower: "하체",
    core: "코어",
    cardio: "유산소",
    freeweight: "프리웨이트",
  }

  const typeLabels: Record<string, string> = {
    machine: "머신",
    freeweight: "프리웨이트",
    rack: "랙",
    bench: "벤치",
    etc: "기타",
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card sticky top-0 z-20">
        <div className="mx-auto max-w-md px-4 py-4 flex items-center gap-3">
          <Link href="/equipment" className="flex items-center gap-2 text-primary hover:text-primary/80">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-foreground truncate">{equipment.name}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-6">
        <div className="relative h-96 rounded-lg overflow-hidden bg-secondary mb-6">
          <img
            src={equipment.imageUrl || "/placeholder.svg"}
            alt={equipment.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">{equipment.name}</h2>
          <p className="text-lg text-primary font-semibold mb-4">{equipment.brand}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="default">{categoryLabels[equipment.category]}</Badge>
            <Badge variant="outline">{typeLabels[equipment.type]}</Badge>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-3">상세 정보</h3>
          <p className="text-sm leading-relaxed text-foreground/90">{equipment.metadata || "추가 정보가 없습니다."}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            이 장비가 있는 헬스장 ({gymsWithEquipment.length}곳)
          </h3>

          {gymsWithEquipment.length > 0 ? (
            <div className="space-y-3">
              {gymsWithEquipment.map((gym) => (
                <Link key={gym?.id} href={`/gyms/${gym?.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative h-32 overflow-hidden bg-secondary">
                      <img
                        src={gym?.image || "/placeholder.svg"}
                        alt={gym?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <CardContent className="pt-4">
                      <h4 className="text-lg font-bold text-foreground mb-1">{gym?.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">📍 {gym?.address}</p>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-foreground">
                          수량: <span className="font-semibold">{gym?.quantity}개</span>
                        </p>
                        <p className="text-xs text-primary hover:underline">상세보기 →</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">이 장비를 보유한 헬스장이 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  )
}
