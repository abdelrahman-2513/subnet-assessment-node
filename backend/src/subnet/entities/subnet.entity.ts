import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Ip } from '../../ip/entities/ip.entity';

@Entity('subnets')
export class Subnet {
  @PrimaryGeneratedColumn()
  subnetId: number;

  @Column({ type: 'varchar', length: 255 })
  subnetName: string;

  @Column({ type: 'varchar', length: 18 })
  subnetAddress: string;

  @Column({ type: 'varchar', length: 36 })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Ip, ip => ip.subnet)
  ips: Ip[];
}
