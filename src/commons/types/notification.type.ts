import { Socket } from 'socket.io';
import {
  JwtAcademicClaim,
  JwtLecturerClaim,
  JwtPayload,
  JwtStudentClaim,
} from './jwt.type';

export interface SocketWithUser extends Socket {
  user: JwtAcademicClaim & JwtLecturerClaim & JwtStudentClaim;
}
