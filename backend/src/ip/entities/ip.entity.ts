import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Subnet } from '../../subnet/entities/subnet.entity';

@Entity('ips')
export class Ip {
  @PrimaryGeneratedColumn()
  ipId: number;

  @Column({ type: 'varchar', length: 45 })
  ipAddress: string;

  @Column()
  subnetId: number;

  @Column({ type: 'varchar', length: 36 })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Subnet, subnet => subnet.ips)
  @JoinColumn({ name: 'subnetId' })
  subnet: Subnet;
}
