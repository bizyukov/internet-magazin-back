import * as bcrypt from 'bcrypt';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Cart } from 'src/cart/cart.model';
import { Order } from 'src/orders/order.model';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true, // Мягкое удаление
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    withPassword: {
      attributes: { include: ['password'] },
    },
  },
})
export class User extends Model {
  /* @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number; */

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    set(value: string) {
      const salt = bcrypt.genSaltSync(10);
      this.setDataValue('password', bcrypt.hashSync(value, salt));
    },
  })
  password: string;

  @Column({
    type: DataType.ENUM('user', 'admin', 'manager', 'content'),
    defaultValue: 'user',
  })
  role: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastLogin: Date;

  @HasMany(() => Order)
  orders: Order[];

  @HasMany(() => Cart)
  carts: Cart[];

  comparePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
