// Importe os módulos necessários e defina o tipo Tarefa
import { executeTransaction } from "../database/database";
import { StringBuilderUtils } from "../utils/StringBuilderUtils";

export type Tarefa = {
  titulo: string;
  desc: string;
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
    sb.append("id INTEGER PRIMARY KEY NOT NULL, ");
    sb.append("titulo TEXT NOT NULL, ");
    sb.append("desc TEXT NOT NULL, ");
    sb.append("materia TEXT NOT NULL, ");
    sb.append("prof TEXT NOT NULL, ");
    sb.append("data TEXT NOT NULL, ");
    sb.append("completo TEXT NOT NULL);");
    const sql: string = sb.toString();
    await executeTransaction(sql);
  }

  public async create(task: Tarefa): Promise<number | undefined> {
    const sql = `INSERT INTO ${this.tableName} (id, titulo, desc, materia, prof, data, completo) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const args: (string | number | null)[] = [
      task.titulo,
      task.desc,
      task.materia,
      task.prof,
      task.data,
      task.completo,
    ];

    try {
      const result = await executeTransaction(sql, args);
      if (result.rowsAffected > 0) {
        return result.insertId ?? undefined;
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
        desc: task.desc,
        materia: task.materia,
        prof: task.prof,
        data: task.data,
        completo: task.completo,
      });
    }
    return tasks;
  }

  public async updateTask(task: Tarefa): Promise<void> {
    const sql = `UPDATE ${this.tableName} SET desc = ?, materia = ?, prof = ?, data = ?, completo = ? WHERE titulo = ?`;
    const args: (string | number | null)[] = [
      task.desc,
      task.materia,
      task.prof,
      task.data,
      task.completo,
      task.titulo // Usando o título como critério de busca para atualização
    ];
    await executeTransaction(sql, args);
  }

  public async deleteTaskByTitle(title: string): Promise<void> {
    const deleteSql: string = `DELETE FROM ${this.tableName} WHERE titulo = ?`;
    await executeTransaction(deleteSql, [title]);
  }

  public async getTaskById(taskId: number): Promise<Tarefa | null> {
    const sql: string = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const resultSet = await executeTransaction(sql, [taskId]);

    if (resultSet.rows.length > 0) {
      const task = resultSet.rows.item(0);
      return {

        titulo: task.titulo,
        desc: task.desc,
        materia: task.materia,
        prof: task.prof,
        data: task.data,
        completo: task.completo,
      };
    } else {
      return null;
    }
  }

  public async getTaskByTitle(title: string): Promise<Tarefa | null> {
    const sql: string = `SELECT * FROM ${this.tableName} WHERE titulo = ?`;
    const resultSet = await executeTransaction(sql, [title]);

    if (resultSet.rows.length > 0) {
      const task = resultSet.rows.item(0);
      return {
    
        titulo: task.titulo,
        desc: task.desc,
        materia: task.materia,
        prof: task.prof,
        data: task.data,
        completo: task.completo,
      };
    } else {
      return null;
    }
  }
}