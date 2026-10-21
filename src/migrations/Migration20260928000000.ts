import { Migration } from '@mikro-orm/migrations';

export class Migration20260928000000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table \`foro_mensajes\` (\`id\` int unsigned not null auto_increment primary key, \`texto\` text not null, \`created_at\` datetime not null, \`dictado_id\` int unsigned not null, \`autor_dni\` int not null) default character set utf8mb4 engine = InnoDB;`,
    );
    this.addSql(
      `alter table \`foro_mensajes\` add index \`foro_mensajes_dictado_id_index\`(\`dictado_id\`);`,
    );
    this.addSql(
      `alter table \`foro_mensajes\` add index \`foro_mensajes_autor_dni_index\`(\`autor_dni\`);`,
    );
    this.addSql(
      `alter table \`foro_mensajes\` add constraint \`foro_mensajes_dictado_id_foreign\` foreign key (\`dictado_id\`) references \`dictados\` (\`id\`) on delete cascade;`,
    );
    this.addSql(
      `alter table \`foro_mensajes\` add constraint \`foro_mensajes_autor_dni_foreign\` foreign key (\`autor_dni\`) references \`personas\` (\`dni\`) on delete restrict;`,
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `foro_mensajes`;');
  }
}
