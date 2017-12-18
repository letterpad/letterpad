export const parseErrors = errObj => {
    const result = [];
    if (errObj && errObj.errors) {
        errObj.errors.map(({ message, path }) => {
            result.push({ message, path });
        });
    }
    return result;
};
