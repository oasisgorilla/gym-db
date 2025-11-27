export type EquipmentCategory = "upper" | "lower" | "core" | "cardio" | "freeweight"
export type EquipmentType = "machine" | "freeweight" | "rack" | "bench" | "etc"

export interface Gym {
  id: string
  name: string
  address: string
  phone: string
  description: string
  image: string
  images: string[]
  hours: string
}

export interface EquipmentCatalog {
  id: string
  name: string
  brand: string
  category: EquipmentCategory
  type: EquipmentType
  imageUrl: string
  metadata?: string
}

export interface GymEquipment {
  id: string
  gymId: string
  equipmentCatalogId: string
  quantity: number
  condition?: string
  note?: string
}

export interface GymFacility {
  id: string
  gymId: string
  facilityType: string
  detail?: string
  icon?: string
}

export interface EquipmentWithDetails extends EquipmentCatalog {
  gymsCount?: number
}

export interface GymEquipmentWithDetails extends GymEquipment {
  equipment: EquipmentCatalog
}
