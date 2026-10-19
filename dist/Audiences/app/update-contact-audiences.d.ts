import { IAudienceUpdate } from "../dto/IAudienceUpdate";
/**
 * A function that updates de audiences of a contact.
 * @param contactId The id of the contact.
 * @param audienceUpdates The ids of the audiences to update.
 */
export declare function updateContactAudiences(contactId: string, audienceUpdates: IAudienceUpdate[]): Promise<any>;
