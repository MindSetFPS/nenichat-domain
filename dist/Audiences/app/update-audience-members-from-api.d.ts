/**
 * a resuable client function that takes a list of contact ids and an audience id and updates the audience members
 * @param contactIds list of contact ids
 * @param audienceId audience id
 * @returns json response
 */
export default function updateAudienceMembers(contactIds: {
    [key: string]: boolean;
}, audienceId: string): Promise<any>;
