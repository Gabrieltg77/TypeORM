import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Team } from "./Teams";

@Entity({name:"match"})
export class Match {
    // define a chave primária como auto incremento
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, type: 'date', default: () => "CURRENT_TIMESTAMP"})
    date: Date;

    @ManyToOne((type) => Team, {onDelete: 'CASCADE'})

    @JoinColumn({
        name: "host",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_host_id"
    })
    host: Team;

        // cascade define que ao excluir o usuário os gastos serão excluídos
        @ManyToOne((type) => Team, { onDelete: 'CASCADE' })
        // JoinColum é usado para definir o lado da relação que contém a "join column" com a FK
        @JoinColumn({
            name: "idvisitor",
            referencedColumnName: "id", // id da entidade Team
            foreignKeyConstraintName: "fk_visitor_id" // pode ser qualquer nome usado para você identificar a FK
        })
        visitor: Team;
}
