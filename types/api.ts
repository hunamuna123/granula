// =============================================================================
// Granula API Types
// =============================================================================

// -----------------------------------------------------------------------------
// Common Types
// -----------------------------------------------------------------------------
export interface ApiError {
  code: string
  message: string
  details?: Record<string, string>
  request_id?: string
}

export interface Pagination {
  total: number
  page: number
  page_size: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

// -----------------------------------------------------------------------------
// Auth Types
// -----------------------------------------------------------------------------
export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface LoginRequest {
  email: string
  password: string
  device_id?: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface RefreshTokenRequest {
  refresh_token: string
}

// -----------------------------------------------------------------------------
// User Types
// -----------------------------------------------------------------------------
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  is_active: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface UpdateUserRequest {
  name?: string
  phone?: string
}

// -----------------------------------------------------------------------------
// Workspace Types
// -----------------------------------------------------------------------------
export interface Workspace {
  id: string
  name: string
  description?: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface CreateWorkspaceRequest {
  name: string
  description?: string
}

export interface UpdateWorkspaceRequest {
  name?: string
  description?: string
}

// -----------------------------------------------------------------------------
// Floor Plan Types
// -----------------------------------------------------------------------------
export type FloorPlanStatus = 
  | 'uploaded' 
  | 'processing' 
  | 'processed' 
  | 'error'
  | 'draft'
  | 'in_progress'
  | 'completed'

export interface FloorPlan {
  id: string
  workspace_id: string
  name: string
  description?: string
  address?: string
  file_url: string
  preview_url?: string
  status: FloorPlanStatus
  area?: number
  rooms_count?: number
  recognition_result?: RecognitionResult
  created_at: string
  updated_at: string
}

export interface RecognitionResult {
  walls: Wall[]
  rooms: Room[]
  doors: Door[]
  windows: Window[]
  confidence: number
}

export interface Wall {
  id: string
  start: Point
  end: Point
  thickness: number
  is_load_bearing: boolean
}

export interface Room {
  id: string
  name: string
  type: RoomType
  area: number
  points: Point[]
}

export type RoomType = 
  | 'living_room' 
  | 'bedroom' 
  | 'kitchen' 
  | 'bathroom' 
  | 'toilet' 
  | 'hallway' 
  | 'balcony' 
  | 'storage' 
  | 'other'

export interface Door {
  id: string
  position: Point
  width: number
  direction: 'in' | 'out'
}

export interface Window {
  id: string
  position: Point
  width: number
}

export interface Point {
  x: number
  y: number
}

export interface CreateFloorPlanRequest {
  workspace_id: string
  name: string
  description?: string
  address?: string
}

export interface UpdateFloorPlanRequest {
  name?: string
  description?: string
  address?: string
}

export interface ProcessFloorPlanRequest {
  create_scene?: boolean
  run_compliance?: boolean
}

export interface ProcessFloorPlanResponse {
  task_id: string
  status: string
}

// -----------------------------------------------------------------------------
// Scene Types
// -----------------------------------------------------------------------------
export interface Scene {
  id: string
  floor_plan_id: string
  branch_id?: string
  data: SceneData
  created_at: string
  updated_at: string
}

export interface SceneData {
  walls: SceneWall[]
  rooms: SceneRoom[]
  furniture: SceneFurniture[]
  camera: CameraSettings
}

export interface SceneWall {
  id: string
  start: Point3D
  end: Point3D
  height: number
  thickness: number
  material: string
}

export interface SceneRoom {
  id: string
  name: string
  floor_material: string
  wall_material: string
  ceiling_material: string
}

export interface SceneFurniture {
  id: string
  model_id: string
  position: Point3D
  rotation: Point3D
  scale: Point3D
}

export interface Point3D {
  x: number
  y: number
  z: number
}

export interface CameraSettings {
  position: Point3D
  target: Point3D
  fov: number
}

export interface CreateSceneRequest {
  floor_plan_id: string
  branch_id?: string
}

export interface UpdateSceneRequest {
  data: SceneData
}

// -----------------------------------------------------------------------------
// Branch Types
// -----------------------------------------------------------------------------
export interface Branch {
  id: string
  floor_plan_id: string
  name: string
  description?: string
  parent_branch_id?: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface CreateBranchRequest {
  floor_plan_id: string
  name: string
  description?: string
  parent_branch_id?: string
}

// -----------------------------------------------------------------------------
// AI Types
// -----------------------------------------------------------------------------
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
}

export interface ChatMessageRequest {
  message: string
  context?: {
    floor_plan_id?: string
    scene_id?: string
  }
  history?: ChatMessage[]
}

export interface ChatMessageResponse {
  response: string
  suggestions?: string[]
  actions?: AIAction[]
}

export interface AIAction {
  type: 'add_wall' | 'remove_wall' | 'move_furniture' | 'change_room'
  parameters: Record<string, unknown>
}

export interface GenerateVariantsRequest {
  floor_plan_id: string
  preferences?: {
    style?: string
    priorities?: string[]
    constraints?: string[]
  }
  count?: number
}

export interface GenerateVariantsResponse {
  task_id: string
  status: string
  estimated_time?: number
}

export interface GeneratedVariant {
  id: string
  scene_data: SceneData
  score: number
  description: string
  highlights: string[]
}

// -----------------------------------------------------------------------------
// Compliance Types
// -----------------------------------------------------------------------------
export type ComplianceSeverity = 'error' | 'warning' | 'info'
export type ComplianceCategory = 'snip' | 'housing_code' | 'fire_safety' | 'sanitary'
export type OperationType = 'construction' | 'renovation' | 'redevelopment'

export interface ComplianceCheckRequest {
  scene_id?: string
  floor_plan_id?: string
  operation_type?: OperationType
  check_categories?: ComplianceCategory[]
}

export interface ComplianceCheckResponse {
  is_compliant: boolean
  overall_score: number
  violations: ComplianceViolation[]
  warnings: ComplianceViolation[]
  passed_rules: number
  total_rules: number
}

export interface ComplianceViolation {
  rule_id: string
  rule_name: string
  category: ComplianceCategory
  severity: ComplianceSeverity
  description: string
  recommendation: string
  affected_elements?: string[]
  legal_reference?: string
}

export interface ComplianceRule {
  id: string
  name: string
  description: string
  category: ComplianceCategory
  severity: ComplianceSeverity
  legal_reference?: string
  applies_to: OperationType[]
}

// -----------------------------------------------------------------------------
// Expert Request Types
// -----------------------------------------------------------------------------
export type RequestStatus = 
  | 'draft' 
  | 'pending' 
  | 'in_review' 
  | 'approved' 
  | 'rejected'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export type RequestCategory = 
  | 'consultation' 
  | 'documentation' 
  | 'expert_visit' 
  | 'full_package'

export interface ExpertRequest {
  id: string
  workspace_id: string
  floor_plan_id?: string
  category: RequestCategory
  status: RequestStatus
  contact_name: string
  contact_phone: string
  contact_email?: string
  comment?: string
  price?: number
  assigned_expert?: Expert
  created_at: string
  updated_at: string
}

export interface Expert {
  id: string
  name: string
  phone?: string
  email?: string
  specialization: string
}

export interface CreateExpertRequestRequest {
  workspace_id: string
  floor_plan_id?: string
  category: RequestCategory
  contact_name: string
  contact_phone: string
  contact_email?: string
  comment?: string
}

export interface RequestPricing {
  categories: PricingCategory[]
}

export interface PricingCategory {
  code: RequestCategory
  name: string
  description: string
  base_price: number
  estimated_days: string
  includes: string[]
}

// -----------------------------------------------------------------------------
// Notification Types
// -----------------------------------------------------------------------------
export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error'
  | 'request_update'
  | 'processing_complete'
  | 'compliance_alert'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  is_read: boolean
  data?: Record<string, unknown>
  created_at: string
}

// -----------------------------------------------------------------------------
// API Response Wrapper
// -----------------------------------------------------------------------------
export interface ApiResponse<T> {
  data: T
  message?: string
}

