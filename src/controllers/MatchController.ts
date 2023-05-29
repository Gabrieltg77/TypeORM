import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Match } from '../entities/Match';
import { Team } from "../entities/Teams";

class MatchController {
  public async listAll(req: Request, res: Response): Promise<Response> {
    const limit = req.body.limit || 100;
    const offset = req.body.offset || 0;
    const {
      id
    } = req.params;
    let match;
    id ? 
    match = await AppDataSource
      .getRepository(Match)
      .createQueryBuilder("match")
      .innerJoinAndSelect(
        "match.visitor",
        "visitor"
      )
      .innerJoinAndSelect(
        "match.host",
        "host"
      )
      .select(["match.id", "match.date", "match.visitor","match.host", "host.id", "host.name", "visitor.id", "visitor.name"])
      .where("host.id = :id or visitor.id = :id",  { id: `${id}` })
      .orderBy("match.date", "ASC")
      .skip(offset)
      .take(limit)
      .getMany():
    match = await AppDataSource
      .getRepository(Match)
      .createQueryBuilder("match")
      .innerJoinAndSelect(
        "match.visitor",
        "visitor"
      )
      .innerJoinAndSelect(
        "match.host",
        "host"
      )
      .select(["match.id", "match.date", "match.visitor","match.host", "host.id", "host.name", "visitor.id", "visitor.name"])
      .orderBy("match.date", "ASC")
      .skip(offset)
      .take(limit)
      .getMany();
      

      console.log(Match);
      

    if (match) {
        return res.json(match);
    }
    else {
      return res.json({ error: "Time não localizado" });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { idhost, idvisitor, date } = req.body;
    //verifica se foram fornecidos os parâmetros
    const teamRepository: any = AppDataSource.getRepository(Team);
    const host: any = await teamRepository
    .createQueryBuilder("team")
    .select(['team.id'])
    .where(idhost)
    .getOne();
    const visitor: any = await teamRepository
    .createQueryBuilder("team")
    .select(['team.id'])
    .where(idvisitor)
    .getOne();
    const obj = new Match();
    obj.host = host;
    obj.date = date;
    obj.visitor = visitor;
    // o hook BeforeInsert não é disparado com AppDataSource.manager.save(User,JSON),
    // mas é disparado com AppDataSource.manager.save(User,objeto do tipo User)
    // https://github.com/typeorm/typeorm/issues/5493
    const match: any = await AppDataSource.manager.save(Match, obj).catch((e) => {
      return { error: e.message };
    })
    return res.json(match);
  }

  // o usuário pode atualizar somente os seus dados
  public async update(req: Request, res: Response): Promise<Response> {
    const { id, idhost, idvisitor, date } = req.body;
    const match: any = await AppDataSource.manager.findOneBy(Match, { id }).catch((e) => {
      return { error: "Identificador inválido" };
    })
    const host = await AppDataSource.manager.findOneBy(Team, { id: idhost }).catch((e) => {
      return  {error: "Mandante desconhecido"} ;
    });
    const visitor = await AppDataSource.manager.findOneBy(Team, { id: idvisitor }).catch((e) => {
      return  {error: "Visitante desconhecido"} ;
    });
    match.host = host;
    match.visitor = visitor;
    match.date = date;
    if (match && match.id) {
      const r = await AppDataSource.manager.save(Match, match).catch((e) => {
        return e;
      })
      if (!r.error) {
        return res.json({ id: match.id});
      }
      return res.json(r);
    }
    else {
      return res.json({ error: "Time não localizado" });
    }
  }
  public async deleteMatch(req: Request, res: Response): Promise<Response> {
    const {
      id
    } = req.body;
    
    try {
      const MatchRepository: any = await AppDataSource.getRepository(Match);
      const match: any = await MatchRepository
      .createQueryBuilder("Match")
      .select(['match.id'])
      .where(id)
      .getOne();
      console.log(match);
      
      if (!match) {
        return res.status(404).send({ message: "id não localizado" });
      }

      const result = await MatchRepository.delete(id);
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "An error occurred while deleting the Match" });
    }
}

}

export default new MatchController();