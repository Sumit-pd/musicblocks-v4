import { IFeatureFlags } from '@/@types';
import { IComponentDefinition } from '@/@types/components';

import { getCrumbs, run } from '@sugarlabs/musicblocks-v4-lib';

import { i18nFactory } from '@/core/i18n';

import { getButtons, setup as setupView, updateState } from './view';

// == definition ===================================================================================

export const strings: { [key: string]: string } = {
    run: 'run button - to start the program execution',
    stop: 'stop button - to stop the program execution',
    reset: 'reset button - clear program states',
};

export const definition: IComponentDefinition = {
    dependencies: {
        optional: [],
        required: [],
    },
    flags: {
        uploadFile: false,
        recording: false,
        exportDrawing: false,
        loadProject: false,
        saveProject: false,
    },
    strings,
};

// == public functions =============================================================================

/**
 * Mounts the Menu component.
 */
export function mount(flags: IFeatureFlags): Promise<void> {
    return setupView({
        flags,
        i18n: i18nFactory('menu'),
    });
}

/**
 * Initializes the Menu component.
 */
export function setup(): Promise<void> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            const buttons = getButtons();
            buttons.run.addEventListener('click', () => {
                const crumbs = getCrumbs();
                if (crumbs.length !== 0) run(getCrumbs()[0].nodeID);
                updateState('running', true);
                setTimeout(() => updateState('running', false));
            });
            buttons.stop.addEventListener('click', () => {
                updateState('running', false);
            });
            buttons.reset.addEventListener('click', () => {
                updateState('running', false);
            });

            resolve();
        });
    });
}

export function mountHook(name: 'uploadFileInLocalStorage', callback: CallableFunction): void;
export function mountHook(name: 'startRecording', callback: CallableFunction): void;
export function mountHook(name: 'stopRecording', callback: CallableFunction): void;
export function mountHook(name: 'exportDrawing', callback: CallableFunction): void;
export function mountHook(name: 'loadProject', callback: CallableFunction): void;
export function mountHook(name: 'saveProject', callback: CallableFunction): void;
export function mountHook(name: 'run', callback: CallableFunction): void;
export function mountHook(name: 'reset', callback: CallableFunction): void;

/**
 * Mounts a callback associated with a special hook name.
 * @param name name of the hook
 * @param callback callback function to associate with the hook
 */
export function mountHook(name: string, callback: CallableFunction): void {
    const buttons = getButtons();
    if (name == 'uploadFileInLocalStorage') {
        buttons.uploadFileInLocalStorage.addEventListener('change', (event) => callback(event));
    } else if (name == 'startRecording') {
        buttons.startRecording.addEventListener('click', () => callback());
    } else if (name == 'stopRecording') {
        buttons.stopRecording.addEventListener('click', () => callback());
    } else if (name == 'exportDrawing') {
        buttons.exportDrawing.addEventListener('click', () => callback());
    } else if (name == 'loadProject') {
        buttons.loadProject.addEventListener('change', (event) => callback(event));
    } else if (name == 'saveProject') {
        buttons.saveProject.addEventListener('click', () => callback());
    } else if (name === 'run') {
        buttons.run.addEventListener('click', () => callback());
    } else if (name === 'reset') {
        buttons.reset.addEventListener('click', () => callback());
    }
}
