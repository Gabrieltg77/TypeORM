import * as express from "express";
import * as dotenv from "dotenv";
import * as cors from "cors";
import routes from "./routes";
import { Request } from "express";

dotenv.config();

// cria o servidor e coloca na variável app
const app = express();
app.use(express.json());
app.use(cors<Request>())

const PORT = process.env.PORT || 3004;

// inicializa o servidor na porta especificada
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
// define a rota para o pacote /routes
app.use(routes);