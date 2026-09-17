module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-firebase|react-native-vector-icons)/)',
  ],
  setupFiles: ['./jest/firebase-mock.js'],
};
