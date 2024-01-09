import { Table, Column, Model, DataType, BeforeCreate, HasOne, HasMany } from 'sequelize-typescript';
import { Sequelize } from 'sequelize';
import * as  bcrypt from 'bcrypt';
import { PasswordReset } from './PasswordReset';
import * as crypto from 'crypto';

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


    @HasMany(()=> PasswordReset)
    passwordReset!: PasswordReset;


    @BeforeCreate
    static async hashPassword(instance: User):Promise<void> {
        if (instance.changed('password')) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(instance.password, saltRounds);
            instance.password = hashedPassword;
        }
    }

    // password reset token 

    static async generatePasswordResetToken(instance : User) {
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetExpires = new Date();

        resetExpires.setHours(resetExpires.getHours() +1 ); // expires in 1 hr
        const resetExpiresString = resetExpires.toISOString();
        await instance.$create('PasswordReset', {
            resetPasswordToken : resetToken,
            resetPasswordExpires: resetExpiresString,
        });

        console.log("Token from model : ", resetToken);
        return resetToken;
    }
}



