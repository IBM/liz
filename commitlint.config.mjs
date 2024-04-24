/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

const Configuration = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'signed-off-by': [2, 'always', 'Signed-off-by:'],
    },
}

export default Configuration
