import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/user.model';

@Table({ tableName: 'user_addresses' })
export class Address extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  fullName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  street: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  region: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  zipCode: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  country: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isDefault: boolean;
}
