import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/user.model';

@Table({ tableName: 'user_payment_methods' })
export class PaymentMethod extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  type: string; // 'card', 'paypal', etc.

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  details: Record<string, any>; // { cardNumber, expiry, etc. }

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isDefault: boolean;
}
