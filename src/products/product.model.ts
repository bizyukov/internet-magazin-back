import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { Category } from 'src/categories/category.model';
import { Manufacturer } from 'src/manufacturers/manufacturer.model';
import { OrderItem } from 'src/orders/order-item.model';

@Scopes(() => ({
  active: {
    where: { isActive: true },
  },
  withCategory: {
    include: [Category],
  },
  withManufacturer: {
    include: [Manufacturer],
  },
  full: {
    include: [Category, Manufacturer],
  },
}))
@Table({
  tableName: 'products',
  timestamps: true,
  paranoid: true,
})
export class Product extends Model {
  /*  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number; */

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01,
    },
  })
  price: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  oldPrice?: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  sku?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageUrl: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  })
  stockQuantity: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @HasMany(() => OrderItem)
  orderItems: OrderItem[];

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;

  @ForeignKey(() => Manufacturer)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  manufacturerId: number;

  @BelongsTo(() => Manufacturer)
  manufacturer: Manufacturer;

  /* @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date; */
}
