import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity({ name: "hue" })
export class Hue extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    currentHue!: number;
}
