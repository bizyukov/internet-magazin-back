import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/user.model';
import { OrderStatus } from './interfaces/order-status.enum';
import { OrderItem } from './order-item.model';

@Table({
  tableName: 'orders',
  timestamps: true,
  paranoid: true,
})
export class Order extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  uuid: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  total: number;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    defaultValue: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    region: string;
    zipCode: string;
    country: string;
    phone: string;
  };

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  paymentMethod: {
    type: string;
    details?: Record<string, any>;
  };

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  trackingNumber: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @HasMany(() => OrderItem)
  items: OrderItem[];
}
