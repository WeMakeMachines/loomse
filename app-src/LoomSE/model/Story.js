import { browser } from '../../services';

import { ajaxRequest } from '../tools';

import config from '../../configs/config';
import errors from '../../configs/errors';

import state from '../state';

export class Story {

    /**
     * Determines the appropriate source of the script (mobile or desktop)
     * @returns {string}
     */
    static getScriptFile() {
        return browser.hasSmallScreen() ? config.scripts.mobile : config.scripts.desktop;
    }

    constructor() {
        this.scriptFile = this.constructor.getScriptFile();
        this.shortName = '';
        this.longName = '';
        this.author = '';
        this.description = '';
        this.firstScene = '';
        this.scenes = {};
        this.language = '';
    }

    load() {

        return new Promise((resolve, reject) => {

            this.fetchScript()
                .then((values) => {
                    this.shortName = values.shortName;
                    this.longName = values.longName;
                    this.author = values.author;
                    this.description = values.description;
                    this.firstScene = values.firstScene;
                    this.scenes = values.scenes;
                    this.language = values.language;

                    this.updateState();

                    resolve();
                })
                .catch((error) => {
                    console.warn(error);
                    reject(errors.application.script);
                });
        });
    }

    fetchScript() {
        return ajaxRequest(this.scriptFile, 'JSON');
    }

    updateState() {
        state.language = this.language;
    }
}
