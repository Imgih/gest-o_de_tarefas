import { executeTransaction } from "../database/database";
import { StringBuilderUtils } from "../utils/StringBuilderUtils";

export type Tarefa = {
  titulo: string;
  descricao: string;
  materia: string;
  prof: string;
  data: string;
  completo: string;
};

export default class TaskRepository {
  private tableName: string = "tarefas";

  constructor() {
    this.up();
  }

  private async up(): Promise<void> {
    const sb: StringBuilderUtils = new StringBuilderUtils();
    sb.append(`CREATE TABLE IF NOT EXISTS ${this.tableName} (`);
    sb.append(`titulo TEXT PRIMARY KEY NOT NULL, `);
    sb.append(`descricao TEXT NOT NULL, `);
    sb.append(`materia TEXT NOT NULL, `);
    sb.append(`prof TEXT NOT NULL, `);
    sb.append(`data TEXT NOT NULL, `);
    sb.append(`completo TEXT NOT NULL);`);
    const sql: string = sb.toString();
    await executeTransaction(sql);
  }

  public async create(task: Tarefa): Promise<string | undefined> {
    const sql = `INSERT INTO ${this.tableName} (titulo, descricao, materia, prof, data, completo) VALUES (?, ?, ?, ?, ?, ?)`;
    const args: string[] = [
      task.titulo,
      task.descricao,
      task.materia,
      task.prof,
      task.data,
      task.completo,
    ];

    try {
      const result = await executeTransaction(sql, args);
      if (result.rowsAffected > 0) {
        return task.titulo;
      } else {
        console.error('Nenhuma linha foi inserida.');
        return undefined;
      }
    } catch (error) {
      console.error('Erro ao inserir tarefa:', error);
      return undefined;
    }
  }

  public async listTasks(): Promise<Tarefa[]> {
    const tasks: Tarefa[] = [];
    const sql: string = `SELECT * FROM ${this.tableName}`;
    const resultSet = await executeTransaction(sql);

    for (let i = 0; i < resultSet.rows.length; i++) {
      const task = resultSet.rows.item(i);
      tasks.push({
        titulo: task.titulo,
        descricao: task.descricao,
        materia: task.materia,
        prof: task.prof,
        data: task.data,
        completo: task.completo,
      });
    }
    return tasks;
  }

  public async updateTask(task: Tarefa): Promise<void> {
    const sql = `UPDATE ${this.tableName} SET descricao = ?, materia = ?, prof = ?, data = ?, completo = ? WHERE titulo = ?`;
    const args: string[] = [
      task.descricao,
      task.materia,
      task.prof,
      task.data,
      task.completo,
      task.titulo 
    ];
    try {
      await executeTransaction(sql, args);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  }

  public async deleteTaskByTitle(titulo: string): Promise<void> {
    const deleteSql: string = `DELETE FROM ${this.tableName} WHERE titulo = ?`;
    try {
      await executeTransaction(deleteSql, [titulo]);
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      throw error;
    }
  }

  public async getTaskByTitle(titulo: string): Promise<Tarefa | null> {
    const sql: string = `SELECT * FROM ${this.tableName} WHERE titulo = ?`;
    try {
      const resultSet = await executeTransaction(sql, [titulo]);
      if (resultSet.rows.length > 0) {
        const task = resultSet.rows.item(0);
        return {
          titulo: task.titulo,
          descricao: task.descricao,
          materia: task.materia,
          prof: task.prof,
          data: task.data,
          completo: task.completo,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar tarefa por título:', error);
      throw error;
    }
  }
}
