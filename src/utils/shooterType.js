const SHOOTER_TYPE_VALUES = new Set(['Turret', 'Static'])

const normalizeShooterTypeValue = (value) => {
  const normalized = String(value || '').trim()
  return SHOOTER_TYPE_VALUES.has(normalized) ? normalized : ''
}

const getShooterTypeValue = (shooterType, turretFallback) => {
  const normalized = normalizeShooterTypeValue(shooterType)
  if (normalized) return normalized
  if (turretFallback === true) return 'Turret'
  if (turretFallback === false) return 'Static'
  return ''
}

const getShooterTypeFromAttributes = (attrs) => {
  if (!attrs || typeof attrs !== 'object') return ''
  return getShooterTypeValue(attrs.ShooterType, attrs.Turret)
}

const getShooterTypeFromRow = (row) => {
  if (!row || typeof row !== 'object') return ''

  const explicit = normalizeShooterTypeValue(
    row.ShooterType || row.shooterType || row?.TeamAttributes?.ShooterType
  )

  if (explicit) return explicit

  if (row.Turret === true || row.turret === true || row?.TeamAttributes?.Turret === true) {
    return 'Turret'
  }

  if (row.Turret === false || row.turret === false || row?.TeamAttributes?.Turret === false) {
    return 'Static'
  }

  return ''
}

const formatShooterType = (value, fallback = 'N/A') => {
  const normalized = normalizeShooterTypeValue(value)
  if (!normalized) return fallback
  return normalized === 'Static' ? 'Static Shooter' : 'Turret'
}

const isTurretShooter = (value) => normalizeShooterTypeValue(value) === 'Turret'

export {
  formatShooterType,
  getShooterTypeFromAttributes,
  getShooterTypeFromRow,
  getShooterTypeValue,
  isTurretShooter,
  normalizeShooterTypeValue,
}