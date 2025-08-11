import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Product } from '../products/product.model';

@Table({
  tableName: 'manufacturers',
  timestamps: true,
  paranoid: true,
})
export class Manufacturer extends Model {
  /* @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number; */

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  country: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  website: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  logoUrl: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @HasMany(() => Product)
  products: Product[];

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
