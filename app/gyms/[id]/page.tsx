"use client"

import { use, useState } from "react"
import Link from "next/link"
import { ChevronLeft, MapPin, Phone, Share2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { GYMS, GYM_EQUIPMENT, EQUIPMENT_CATALOG, GYM_FACILITIES } from "@/lib/mock-data"
import type { GymEquipmentWithDetails, EquipmentCategory } from "@/lib/types"

export default function GymDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const gym = GYMS.find((g) => g.id === id)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showEquipment, setShowEquipment] = useState(false)

  if (!gym) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">헬스장을 찾을 수 없습니다.</p>
      </div>
    )
  }

  const gymEquipments = GYM_EQUIPMENT.filter((ge) => ge.gymId === gym.id)
  const equipmentMap = EQUIPMENT_CATALOG.reduce(
    (acc, eq) => {
      acc[eq.id] = eq
      return acc
    },
    {} as Record<string, (typeof EQUIPMENT_CATALOG)[0]>,
  )

  const categoryStats = {
    upper: 0,
    lower: 0,
    core: 0,
    cardio: 0,
    freeweight: 0,
  } as Record<EquipmentCategory, number>

  gymEquipments.forEach((ge) => {
    const equipment = equipmentMap[ge.equipmentCatalogId]
    if (equipment) {
      categoryStats[equipment.category] += ge.quantity
    }
  })

  const total = Object.values(categoryStats).reduce((a, b) => a + b, 0)
  const percentages = {
    upper: Math.round((categoryStats.upper / total) * 100),
    lower: Math.round((categoryStats.lower / total) * 100),
    core: Math.round((categoryStats.core / total) * 100),
    cardio: Math.round((categoryStats.cardio / total) * 100),
    freeweight: Math.round((categoryStats.freeweight / total) * 100),
  }

  const chartData = [
    { name: "상체", value: percentages.upper },
    { name: "하체", value: percentages.lower },
    { name: "코어", value: percentages.core },
    { name: "프리웨이트", value: percentages.freeweight },
    { name: "유산소", value: percentages.cardio },
  ]

  const equipmentByCategory = {
    upper: [] as GymEquipmentWithDetails[],
    lower: [] as GymEquipmentWithDetails[],
    core: [] as GymEquipmentWithDetails[],
    cardio: [] as GymEquipmentWithDetails[],
    freeweight: [] as GymEquipmentWithDetails[],
  }

  gymEquipments.forEach((ge) => {
    const equipment = equipmentMap[ge.equipmentCatalogId]
    if (equipment) {
      equipmentByCategory[equipment.category].push({
        ...ge,
        equipment,
      })
    }
  })

  const facilities = GYM_FACILITIES.filter((f) => f.gymId === gym.id)

  const categoryLabels: Record<EquipmentCategory, string> = {
    upper: "상체",
    lower: "하체",
    core: "코어",
    cardio: "유산소",
    freeweight: "프리웨이트",
  }

  const categoryIcons: Record<EquipmentCategory, string> = {
    upper: "💪",
    lower: "🦵",
    core: "🏋️",
    cardio: "🏃",
    freeweight: "⚙️",
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">목록</span>
          </Link>
          <h2 className="text-sm font-semibold text-foreground truncate">{gym.name}</h2>
          <button className="text-primary hover:text-primary/80">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pt-16">
        {/* Hero image */}
        <div className="relative h-48 rounded-lg overflow-hidden bg-secondary mb-6 mt-4">
          <img src={gym.image || "/placeholder.svg"} alt={gym.name} className="w-full h-full object-cover" />
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-4">{gym.name}</h1>
          <div className="space-y-2 text-sm">
            <a href={`tel:${gym.phone}`} className="flex items-center gap-2 text-primary hover:underline">
              <Phone className="w-4 h-4" />
              <span>{gym.phone}</span>
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(gym.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <MapPin className="w-4 h-4" />
              <span>{gym.address}</span>
            </a>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">운영시간:</span> {gym.hours}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative h-48 rounded-lg overflow-hidden bg-secondary mb-3">
            <img
              src={gym.images[currentImageIndex] || "/placeholder.svg"}
              alt={`${gym.name} 이미지 ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-1 justify-center">
            {gym.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentImageIndex ? "bg-primary" : "bg-border"
                }`}
                aria-label={`이미지 ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">운동기구 비율</h3>
          <div className="flex justify-center mb-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                  orientation="outer"
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 50]}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <Radar
                  name="비율(%)"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {Object.entries(percentages).map(([category, value]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{categoryIcons[category as EquipmentCategory]}</span>
                  <span className="text-muted-foreground">{categoryLabels[category as EquipmentCategory]}</span>
                </div>
                <p className="font-semibold text-foreground">{value}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">운동기구 오버뷰</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {Object.entries(equipmentByCategory).map(([category, items]) => (
              <Card key={category} className="bg-secondary/50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{categoryIcons[category as EquipmentCategory]}</span>
                    <p className="text-xs text-muted-foreground">{categoryLabels[category as EquipmentCategory]}</p>
                  </div>
                  <p className="text-lg font-bold text-primary">{items.length}종</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}개
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            onClick={() => setShowEquipment(!showEquipment)}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {showEquipment ? "장비 목록 닫기" : "전체 장비 목록 보기"}
          </Button>

          {showEquipment && (
            <div className="mt-4 border border-border rounded-lg p-4 space-y-4">
              {Object.entries(equipmentByCategory).map(
                ([category, items]) =>
                  items.length > 0 && (
                    <div key={category}>
                      <h4 className="font-semibold text-foreground mb-2 text-sm flex items-center gap-2">
                        <span>{categoryIcons[category as EquipmentCategory]}</span>[
                        {categoryLabels[category as EquipmentCategory]}]
                      </h4>
                      <ul className="space-y-1">
                        {items.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={`/equipment/${item.equipment.id}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {item.equipment.name} ({item.equipment.brand}) x {item.quantity}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ),
              )}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">시설 안내</h3>
          <div className="space-y-3">
            {facilities.map((facility) => (
              <Card key={facility.id} className="bg-secondary/50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{facility.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{facility.facilityType}</p>
                      {facility.detail && <p className="text-xs text-muted-foreground">{facility.detail}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-lg font-semibold text-foreground mb-3">헬스장 소개</h3>
          <p className="text-sm leading-relaxed text-foreground/90">{gym.description}</p>
        </div>
      </main>
    </div>
  )
}
