"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { EQUIPMENT_CATALOG, GYM_EQUIPMENT } from "@/lib/mock-data"
import type { EquipmentCategory } from "@/lib/types"

export default function EquipmentPage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory | "all">("all")

  const categories: Array<{ id: EquipmentCategory | "all"; label: string }> = [
    { id: "all", label: "전체" },
    { id: "upper", label: "상체" },
    { id: "lower", label: "하체" },
    { id: "core", label: "코어" },
    { id: "cardio", label: "유산소" },
    { id: "freeweight", label: "프리웨이트" },
  ]

  const filtered = EQUIPMENT_CATALOG.filter((eq) => {
    const matchesSearch = eq.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "all" || eq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getGymsCount = (equipmentId: string) => {
    const gymIds = new Set(GYM_EQUIPMENT.filter((ge) => ge.equipmentCatalogId === equipmentId).map((ge) => ge.gymId))
    return gymIds.size
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-20">
        <div className="mx-auto max-w-md px-4 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 flex-shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">장비 카탈로그</h1>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="장비 이름으로 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as EquipmentCategory | "all")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((eq) => {
            const gymsCount = getGymsCount(eq.id)
            return (
              <Link key={eq.id} href={`/equipment/${eq.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative h-40 overflow-hidden bg-secondary">
                    <img src={eq.imageUrl || "/placeholder.svg"} alt={eq.name} className="w-full h-full object-cover" />
                  </div>

                  <CardContent className="pt-4">
                    <h3 className="text-lg font-bold text-foreground mb-1">{eq.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{eq.brand}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">{eq.category}</Badge>
                      <Badge variant="outline">{eq.type}</Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      이 장비가 있는 헬스장: <span className="font-semibold text-foreground">{gymsCount}곳</span>
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">검색 결과가 없습니다.</p>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">GymSpec © 2025</p>
        </div>
      </main>
    </div>
  )
}
