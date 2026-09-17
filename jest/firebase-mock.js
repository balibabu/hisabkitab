const noop = () => {};
const chainable = () => ({ onSnapshot: noop, get: noop, add: noop, set: noop, update: noop, delete: noop, where: chainable, orderBy: chainable, limit: chainable, doc: chainable, collection: chainable });

jest.mock('@react-native-firebase/app', () => ({
  initializeApp: noop,
  getApp: () => ({}),
  getApps: () => [],
}));

jest.mock('@react-native-firebase/auth', () => ({
  getAuth: () => ({}),
  onAuthStateChanged: () => () => noop,
  signInWithEmailAndPassword: () => Promise.resolve({ user: {} }),
  createUserWithEmailAndPassword: () => Promise.resolve({ user: {} }),
  signOut: () => Promise.resolve(),
  updatePassword: () => Promise.resolve(),
  reauthenticateWithCredential: () => Promise.resolve(),
  EmailAuthProvider: { credential: () => ({}) },
}));

jest.mock('@react-native-firebase/firestore', () => ({
  getFirestore: () => ({}),
  collection: chainable,
  doc: chainable,
  query: chainable,
  where: chainable,
  orderBy: chainable,
  getDocs: () => Promise.resolve({ docs: [], forEach: noop, empty: true }),
  getDoc: () => Promise.resolve({ exists: false, data: () => ({}) }),
  addDoc: () => Promise.resolve({}),
  setDoc: () => Promise.resolve(),
  updateDoc: () => Promise.resolve(),
  deleteDoc: () => Promise.resolve(),
  onSnapshot: () => () => noop,
  serverTimestamp: () => ({}),
  increment: noop,
  arrayUnion: noop,
  arrayRemove: noop,
  Timestamp: { now: () => ({}), fromDate: () => ({}) },
}));
