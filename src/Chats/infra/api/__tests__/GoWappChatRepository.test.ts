import { GoWappChatRepository } from '..';
import { Wapp } from '../../../../Wapp';

describe('GoWappChatRepository', () => {
    const repo = new GoWappChatRepository({ deviceId: 115 });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    function mockChatList(data: unknown[]) {
        jest.spyOn(Wapp.prototype, 'request').mockResolvedValue({
            code: 'SUCCESS',
            message: 'success',
            results: { data },
        });
    }

    it('parses last_message_time from the gateway payload', async () => {
        mockChatList([
            { jid: '5219999071819@s.whatsapp.net', name: 'Dani', last_message_time: '2026-09-17T21:43:04Z' },
        ]);

        const [chat] = await repo.list(0, 10);

        expect(chat.last_message_time?.toISOString()).toBe('2026-09-17T21:43:04.000Z');
    });

    it('keeps last_message_time null instead of substituting the current time', async () => {
        mockChatList([
            { jid: '5219999071819@s.whatsapp.net', name: 'Dani', last_message_time: '' },
            { jid: '5219991874468@s.whatsapp.net', name: 'Ana' },
        ]);

        const chats = await repo.list(0, 10);

        expect(chats.map((chat) => chat.last_message_time)).toEqual([null, null]);
    });

    it('returns null when last_message_time is unparseable', async () => {
        mockChatList([
            { jid: '5219999071819@s.whatsapp.net', name: 'Dani', last_message_time: 'not-a-date' },
        ]);

        const [chat] = await repo.list(0, 10);

        expect(chat.last_message_time).toBeNull();
    });
});
