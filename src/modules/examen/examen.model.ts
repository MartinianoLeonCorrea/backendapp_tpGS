import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../../config/database';

class Examen extends Model<
  InferAttributes<Examen>,
  InferCreationAttributes<Examen>
> {
  declare id: CreationOptional<number>;
  declare fecha_examen: Date;
  declare temas: string;
  declare copias: CreationOptional<number>;
  declare dictadoId: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static associate(models: any) {
    // Relación con Dictado (uno a muchos): un Examen pertenece a un Dictado.
    Examen.belongsTo(models.Dictado, {
      foreignKey: 'dictadoId',
      as: 'dictado',
    });

    // Relación con Evaluaciones: un Examen puede tener muchas Evaluaciones
    Examen.hasMany(models.Evaluacion, {
      foreignKey: 'examenId',
      as: 'evaluaciones',
    });
  }
}

Examen.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha_examen: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    temas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    copias: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    dictadoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dictados',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'Examen',
    tableName: 'examenes',
    underscored: true,
  }
);

export default Examen;
