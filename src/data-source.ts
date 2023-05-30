import { DataSource } from "typeorm";

//https://orkhan.gitbook.io/typeorm/docs/data-source-options

/*versão para SQLite
const AppDataSource = new DataSource({
    database: 'bdaula.db',
    type: "sqlite", // se for SQLite, então use sqlite
    // true indica que o schema do BD será criado a cada vez que a aplicação inicializar
    // deixe false ao usar migrations
    synchronize: false, 
    logging: true, // true indica que as consultas e erros serão exibidas no terminal
    entities: ["src/entities/*.ts"], // entidades que serão convertidas em tabelas
    migrations: ["src/migrations/*.ts"], // local onde estarão os arquivos de migração
    subscribers: [],
    maxQueryExecutionTime: 2000 // 2 seg.
}); */


//versão para PostgreSQL
const AppDataSource = new DataSource({
    database: 'icctdqgh', 
    type: "postgres", 
    host: 'silly.db.elephantsql.com', 
    port: 5432,
    username: 'icctdqgh',
    password:'Dgfje4BSRzhm-LTEVCzscGmgMrWUHSTQ',
    synchronize: false, 
    logging: false, 
    entities: ["src/entities/*.ts"], 
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
    maxQueryExecutionTime: 4000 // 2 seg.
});

// https://orkhan.gitbook.io/typeorm/docs/data-source
AppDataSource
    .initialize()
    .then(() => {
        console.log("Data Source inicializado!")
    })
    .catch((e) => {
        console.error("Erro na inicialização do Data Source:", e)
    });

export default AppDataSource;