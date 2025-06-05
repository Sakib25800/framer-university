export default {
    '*.{ts,tsx,md,json,yml}': async (files) => {
        const filesArg = files.join(' ');
        return [
            `pnpm format:files ${filesArg}`,
            `git add ${filesArg}`,
        ];
    },
};
