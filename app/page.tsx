"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { GYMS, EQUIPMENT_CATALOG, GYM_EQUIPMENT } from "@/lib/mock-data"
import type { EquipmentCategory } from "@/lib/types"

export default function Home() {
  const [gymSearch, setGymSearch] = useState("")
  const [equipmentSearch, setEquipmentSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory | "all">("all")

  const categories: Array<{ id: EquipmentCategory | "all"; label: string }> = [
    { id: "all", label: "전체" },
    { id: "upper", label: "상체" },
    { id: "lower", label: "하체" },
    { id: "core", label: "코어" },
    { id: "cardio", label: "유산소" },
    { id: "freeweight", label: "프리웨이트" },
  ]

  // 헬스장 검색 필터
  const filteredGyms = GYMS.filter((gym) => {
    const searchLower = gymSearch.toLowerCase()
    return gym.name.toLowerCase().includes(searchLower) || gym.address.toLowerCase().includes(searchLower)
  })

  // 장비 검색 및 카테고리 필터
  const filteredEquipment = EQUIPMENT_CATALOG.filter((eq) => {
    const matchesSearch = eq.name.toLowerCase().includes(equipmentSearch.toLowerCase())
    const matchesCategory = selectedCategory === "all" || eq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // 헬스장의 카테고리별 기구 비율 계산
  const getGymCategoryStats = (gymId: string) => {
    const gymEquip = GYM_EQUIPMENT.filter((ge) => ge.gymId === gymId)
    const stats = {
      upper: 0,
      lower: 0,
      core: 0,
      cardio: 0,
      freeweight: 0,
    }

    gymEquip.forEach((ge) => {
      const catalog = EQUIPMENT_CATALOG.find((eq) => eq.id === ge.equipmentCatalogId)
      if (catalog) {
        stats[catalog.category] += ge.quantity
      }
    })

    const total = Object.values(stats).reduce((a, b) => a + b, 0)
    const percentages = {
      upper: Math.round((stats.upper / total) * 100),
      lower: Math.round((stats.lower / total) * 100),
      core: Math.round((stats.core / total) * 100),
      cardio: Math.round((stats.cardio / total) * 100),
      freeweight: Math.round((stats.freeweight / total) * 100),
    }
    return percentages
  }

  // 헬스장 특성 태그 생성
  const getGymTags = (gymId: string) => {
    const stats = getGymCategoryStats(gymId)
    const tags = []
    if (stats.freeweight > 30) tags.push("프리웨이트 강점")
    if (stats.upper > 35) tags.push("상체 중심")
    if (stats.lower > 35) tags.push("하체 전문")
    if (stats.cardio > 35) tags.push("유산소 강점")
    if (stats.core > 15) tags.push("코어 프로그램")
    return tags.slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-20">
        <div className="mx-auto max-w-md px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground">GymSpec</h1>
          <p className="mt-1 text-sm text-muted-foreground">동네 헬스장 · 장비 스펙 한눈에</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="mx-auto max-w-md border-b border-border bg-card sticky top-16 z-10">
        <Tabs defaultValue="gyms" className="w-full">
          <TabsList className="w-full rounded-none border-0 bg-transparent p-0">
            <TabsTrigger
              value="gyms"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              헬스장
            </TabsTrigger>
            <TabsTrigger
              value="equipment"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              장비
            </TabsTrigger>
          </TabsList>

          {/* 헬스장 탭 */}
          <TabsContent value="gyms" className="m-0">
            <div className="mx-auto max-w-md px-4 py-6">
              {/* 검색 */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="지역명이나 헬스장 이름으로 검색"
                    value={gymSearch}
                    onChange={(e) => setGymSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* 헬스장 리스트 */}
              <div className="space-y-4">
                {filteredGyms.map((gym) => {
                  const stats = getGymCategoryStats(gym.id)
                  const tags = getGymTags(gym.id)

                  return (
                    <Link key={gym.id} href={`/gyms/${gym.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="relative h-40 overflow-hidden bg-secondary">
                          <img
                            src={gym.image || "/placeholder.svg"}
                            alt={gym.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-foreground">{gym.name}</h3>
                              <p className="text-sm text-muted-foreground">📍 {gym.address}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          </div>

                          <p className="text-xs text-muted-foreground mb-3">
                            상체 {stats.upper}% · 하체 {stats.lower}% · 코어 {stats.core}% · 프리웨이트{" "}
                            {stats.freeweight}% · 유산소 {stats.cardio}%
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">커뮤니티와 리뷰 기능이 곧 추가됩니다</p>
                <p className="mt-2 text-xs text-muted-foreground">GymSpec © 2025</p>
              </div>
            </div>
          </TabsContent>

          {/* 장비 탭 */}
          <TabsContent value="equipment" className="m-0">
            <div className="mx-auto max-w-md px-4 py-6">
              {/* 검색 */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="장비 이름으로 검색"
                    value={equipmentSearch}
                    onChange={(e) => setEquipmentSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* 카테고리 필터 */}
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

              {/* 장비 리스트 */}
              <div className="space-y-4">
                {filteredEquipment.map((eq) => {
                  const gymsWithEquip = GYM_EQUIPMENT.filter((ge) => ge.equipmentCatalogId === eq.id)
                  return (
                    <Link key={eq.id} href={`/equipment/${eq.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="relative h-40 overflow-hidden bg-secondary">
                          <img
                            src={eq.imageUrl || "/placeholder.svg"}
                            alt={eq.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <CardContent className="pt-4">
                          <h3 className="text-lg font-bold text-foreground mb-1">{eq.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{eq.brand}</p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline">{eq.category}</Badge>
                            <Badge variant="outline">{eq.type}</Badge>
                          </div>

                          <p className="text-xs text-muted-foreground">
                            이 장비가 있는 헬스장: {gymsWithEquip.length}곳
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>

              <div className="mt-12 pt-8 border-t border-border text-center">
                <p className="mt-2 text-xs text-muted-foreground">GymSpec © 2025</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
