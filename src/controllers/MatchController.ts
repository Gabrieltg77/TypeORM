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
      .orderBy("match.date", "DESC")
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
      .orderBy("match.date", "DESC")
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
    const teamRepository: any = AppDataSource.getRepository(Team);
    const host: any = await teamRepository
    .createQueryBuilder("team")
    .select(['team.id', 'team.name'])
    .where("id = :id",  { id: `${idhost}` })
    .getOne();
    
    const visitor: any = await teamRepository
    .createQueryBuilder("team")
    .select(['team.id', 'team.name'])
    .where("id = :id",  { id: `${idvisitor}` })
    .getOne();
    const obj = new Match();
    if(host) {
      obj.host = host
      }else{
      return res.status(302).json({error: "Mandante desconhecido"});
      }
      if(visitor) {
        obj.visitor = visitor;
        }else{
        return res.status(302).json({error: "Visitante desconhecido"});
        }
    obj.date = date;
    const match: any = await AppDataSource.manager.save(Match, obj).catch((e) => {
      return { error: e.message };
    })
    console.log(visitor);
    
    return res.json(match);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id, idhost, idvisitor, date } = req.body;
    const match: any = await AppDataSource.manager.findOneBy(Match, { id }).catch((e) => {
      
      return { error: "Identificador inválido" };
    })
    const host = await AppDataSource.manager.findOneBy(Team, { id: idhost });
    
    const visitor = await AppDataSource.manager.findOneBy(Team, { id: idvisitor });
    if(host) {
    match.host = host
    }else{
    return res.status(302).json({error: "Mandante desconhecido"});
    }

    if(visitor) {
      match.visitor = visitor;
      }else{
      return res.status(302).json({error: "Visitante desconhecido"});
      }


    match.date = date;
    if (match && match.id) {
      const r = await AppDataSource.manager.save(Match, match).catch((e) => {
        
        return e;
      })
      if (r.error) {
        console.log(r.error);
        
        return res.json(r.error);
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
      .select(['Match.id'])
      .where("Match.id = :id",  { id })
      .getOne();
      console.log(match);
      
      if (!match) {
       // return res.status(404).send({ message: "id não localizado" });
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