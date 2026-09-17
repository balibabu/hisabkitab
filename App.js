import { AuthProvider } from './src/contexts/AuthContext';
import { DataProvider } from './src/contexts/DataContext';

import AppNavigator from './src/AppNavigator';
import { AppLockProvider } from './src/contexts/AppLockContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WorkspaceProvider } from './src/contexts/WorkspaceContext';

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
                <AppLockProvider>
                    <WorkspaceProvider>
                        <DataProvider>
                            <AppNavigator />
                        </DataProvider>
                    </WorkspaceProvider>
                </AppLockProvider>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}