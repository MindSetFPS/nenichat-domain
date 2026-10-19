import { IMessage } from './IMessage';
import { IContact } from '../../Contacts/domain/IContact';

export interface IMessageWithSender extends IMessage {
  sender?: IContact;
}
