import { Router, Request, Response } from "express";
import Team from "../controllers/TeamController";
import Match from "../controllers/MatchController";
const routes = Router()

routes.get("/team/:search?", Team.listAll);
routes.post("/team", Team.create);
routes.put("/team", Team.update);
routes.delete("/team", Team.deleteTeam);

routes.post("/match", Match.create);
routes.get("/match/:id?", Match.listAll);
routes.put("/match", Match.update);
routes.delete("/match", Match.deleteMatch);

routes.use((req: Request, res: Response) => res.json({ error: "Requisição desconhecida" }));

export default routes;
