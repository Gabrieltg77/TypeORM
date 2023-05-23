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
      .where("name LIKE :search",  { search: `%${search}%` })
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
      return res.json({ error: "Usuário não localizado" });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name } = req.body;
    //verifica se foram fornecidos os parâmetros
    const obj = new Team();
    obj.name = name;
    // o hook BeforeInsert não é disparado com AppDataSource.manager.save(User,JSON),
    // mas é disparado com AppDataSource.manager.save(User,objeto do tipo User)
    // https://github.com/typeorm/typeorm/issues/5493
    const team: any = await AppDataSource.manager.save(Team, obj).catch((e) => {
      // testa se o e-mail é repetido
      if (e.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: teams.name') {
        return {error: 'O nome já existe.'}
    } 
      return { error: e.message };
    })
    if (team.id) {
      // cria um token codificando o objeto {idteam,mail}
      // retorna o token para o cliente
      return res.json({
        id: team.id,
        mail: team.mail,
      });
    }
    return res.json(team);
  }

  // o usuário pode atualizar somente os seus dados
  public async update(req: Request, res: Response): Promise<Response> {
    const { mail, password } = req.body;
    // obtém o id do usuário que foi salvo na autorização na middleware
    const { id } = res.locals;
    const team: any = await AppDataSource.manager.findOneBy(Team, { id }).catch((e) => {
      return { error: "Identificador inválido" };
    })
    if (team && team.id) {
      if (mail !== "") {
        team.mail = mail;
      }
      if (password !== "") {
        team.password = password;
      }
      const r = await AppDataSource.manager.save(Team, team).catch((e) => {
        // testa se o e-mail é repetido
        if (/(mail)[\s\S]+(already exists)/.test(e.detail)) {
          return ({ error: 'e-mail já existe' });
        }
        return e;
      })
      if (!r.error) {
        return res.json({ id: team.id, mail: team.mail });
      }
      return res.json(r);
    }
    else if (team && team.error) {
      return res.json(mail)
    }
    else {
      return res.json({ error: "Usuário não localizado" });
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
      .where(id)
      .getOne();
      console.log(team);
      
      if (!team) {
        return res.status(404).send({ message: "id não localizado" });
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