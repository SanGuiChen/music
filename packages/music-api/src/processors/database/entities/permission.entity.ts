import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('string')
  title: string;

  @Column({
    type: 'string',
    unique: true,
  })
  key: string;

  @Column()
  extra?: string;
}
