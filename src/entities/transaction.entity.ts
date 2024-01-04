import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('', { schema: '' })
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column()
  amount: string;

  @Column({ default: true })
  timestamp: boolean;
}
