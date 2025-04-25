export enum Role {
  STUDENT = 'STUDENT',
  ACADEMIC = 'ACADEMIC',
  HEAD_LECTURER = 'HEAD_LECTURER',
  SUPERVISOR = 'SUPERVISOR',
  LECTURER = 'LECTURER',
  ADMIN = 'ADMIN',
}

export type RoleType = {
  roles: Role[];
};
