export * from './webview';

import {
    open as openWindow,
    sendAction as sendWindowAction
} from './window';

import {
    toggle as togglePanel,
    open as openPanel,
    close as closePanel,
    isOpen as isPanelOpen,
    sendAction as sendPanelAction,
    closeActivePanels,
    openCurrentPanels
} from './panel';

export {
    openWindow,
    sendWindowAction,

    togglePanel,
    openPanel,
    closePanel,
    isPanelOpen,
    sendPanelAction,
    closeActivePanels,
    openCurrentPanels
};
