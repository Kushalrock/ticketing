export const stripe = {
    charges: {
        create: jest.fn().mockImplementationOnce(() => Promise.resolve()),
        id: 'hvvhshvhvs',
    },
}