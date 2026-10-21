import { Migration } from '@mikro-orm/migrations';

export class Migration20260928000001 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table `personas` add `tipo` enum('alumno', 'docente') not null default 'alumno';",
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table `personas` drop column `tipo`;');
  }
}
