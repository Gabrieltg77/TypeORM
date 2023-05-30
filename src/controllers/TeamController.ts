import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Team } from '../entities/Teams';

class TeamController {
  public async listAll(req: Request, res: Response): Promise<Response> {
    const {
      search
    } = req.params;
    let team;
    search ? 
    team = await AppDataSource
      .getRepository(Team)
      .createQueryBuilder("team")
      .select()
      .where("name LIKE :search",  { search: `${search}%` })
      .getMany(): 
    team = await AppDataSource
      .getRepository(Team)
      .createQueryBuilder("team")
      .select()
      .getMany();
      console.log(team);
      

    if (team && team[0]) {
        return res.json(team);
    }
    else {
      return res.json({ error: "Time não localizado" });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name } = req.body;
    const obj = new Team();
    obj.name = name;
    const team: any = await AppDataSource.manager.save(Team, obj).catch((e) => {
      if (e.message === 'duplicate key value violates unique constraint \"UQ_48c0c32e6247a2de155baeaf980\"') {
        return {error: 'O nome já existe.'}
    } 
      return { error: e.message };
    })
    if (team.id) {
      return res.json({
        id: team.id,
        name: team.name,
      });
    }
    //return res.json(team);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id, name } = req.body;
    const team: any = await AppDataSource.manager.findOneBy(Team, { id }).catch((e) => {
      return { error: "Identificador inválido" };
    })
    if (team && team.id) {
      team.name = name;
      const r = await AppDataSource.manager.save(Team, team).catch((e) => {
        if (e.message === 'duplicate key value violates unique constraint \"UQ_48c0c32e6247a2de155baeaf980\"') {
          return {error: 'O nome já existe.'}
      } 
        return e.message;
      })
      return res.json(r);
    }
    else {
      return res.json({ error: "Time não localizado" });
    }
  }
  public async deleteTeam(req: Request, res: Response): Promise<Response> {
    const {
      id
    } = req.body;
    
    try {
      const teamRepository: any = await AppDataSource.getRepository(Team);
      const team: any = await teamRepository
      .createQueryBuilder("team")
      .select(['team.id'])
      .where("id = :id",  { id })
      .getOne();
      
      if (!team) {
       // return res.status(404).send({ message: "id não localizado" });
      }

      const result = await teamRepository.delete(id);
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "An error occurred while deleting the team" });
    }
}

}

export default new TeamController();