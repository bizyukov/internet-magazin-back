export enum OrderStatus {
  PENDING = 'pending', // Ожидает обработки
  PROCESSING = 'processing', // В обработке
  CONFIRMED = 'confirmed', // Подтвержден
  SHIPPED = 'shipped', // Отправлен
  IN_TRANSIT = 'in_transit', // В пути
  DELIVERED = 'delivered', // Доставлен
  CANCELLED = 'cancelled', // Отменен
  RETURNED = 'returned', // Возвращен
  REFUNDED = 'refunded', // Возврат средств
  ON_HOLD = 'on_hold', // На удержании
}
