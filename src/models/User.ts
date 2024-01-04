import { Table, Column, Model, DataType, BeforeCreate, BeforeCreateOptions} from 'sequelize-typescript';
import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
@Table({
    tableName: 'users',
    timestamps: true,
})

export class User extends Model<User> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      })
      userId!: number;
    
    @Column({
        type: DataType.STRING,
        unique: true,
        validate: {
            isAlphanumeric: true,
            len: [3, 25],
        },
    })
    username!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    })
    email!: string;


    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password !: string;

    @Column({
        type: DataType.STRING,
        unique: true,
    })
    googleId?: string;

    static async hashPassword(instance: User, options: BeforeCreateOptions):Promise<void> {
        if (instance.changed('password')) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(instance.password, saltRounds);
            instance.password = hashedPassword;
        }
    }
}

User.addHook('beforeCreate' ,async (user:User, options : BeforeCreateOptions) => {
    await User.hashPassword(user, options);
})

