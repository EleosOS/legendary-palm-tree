import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity({ name: "newsessionprefills" })
export class NewSessionPrefill extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    prefillName!: string;

    @Column()
    guildId!: string;

    @Column()
    eventTitle!: string;

    @Column()
    sessionNumber!: number;

    @Column()
    schedulingThreadTitle!: string;
}
