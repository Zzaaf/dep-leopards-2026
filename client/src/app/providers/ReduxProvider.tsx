'use client';

import { Provider } from 'react-redux';
import { store } from '@/app/store/store';
import { ToastProvider } from '@/shared/ui';

export const ReduxProvider = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
    return (
        <Provider store={store}>
            <ToastProvider>{children}</ToastProvider>
        </Provider>
    );
};
