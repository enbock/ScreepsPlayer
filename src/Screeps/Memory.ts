import Role from './Role';

export default interface Memory {
  role: Role,
  canFight: boolean,
  roomId: string,
  isWalking: boolean,
  action: string,
  targetId: string
}
