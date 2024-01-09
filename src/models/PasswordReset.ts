import { Model , Table, Column , DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';

@Table({
    tableName: 'passwordresets',
    timestamps: true,
})

export class PasswordReset extends Model<PasswordReset> {
    @Column(DataType.STRING)
    resetPasswordToken!: string;

    @Column (DataType.STRING)
    resetPasswordExpires !: Date ;

    @ForeignKey(()=> User)
    @Column(DataType.INTEGER)
    userId !:number

    @BelongsTo( () => User)
    user !: User
}

