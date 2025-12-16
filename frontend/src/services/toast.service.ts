export const toastService = {
    success(message: string) {
        console.log('✓', message);
    },

    error(message: string) {
        console.error('✗', message);
    },

    info(message: string) {
        console.info('ℹ', message);
    },

    warning(message: string) {
        console.warn('⚠', message);
    },
};
