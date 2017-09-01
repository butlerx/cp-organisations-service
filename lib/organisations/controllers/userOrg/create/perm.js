module.exports = {
  create: {
    role: 'basic-user',
    customValidator: [
      {
        role: 'cd-organisations',
        cmd: 'isMemberOf',
      },
    ],
  },
};
