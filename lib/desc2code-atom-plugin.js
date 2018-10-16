'use babel';

import Desc2codeAtomPluginView from './desc2code-atom-plugin-view';
import { CompositeDisposable } from 'atom';
const request = require('request')

export default {

  desc2codeAtomPluginView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.desc2codeAtomPluginView = new Desc2codeAtomPluginView(state.desc2codeAtomPluginViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.desc2codeAtomPluginView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'desc2code-atom-plugin:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.desc2codeAtomPluginView.destroy();
  },

  serialize() {
    return {
      desc2codeAtomPluginViewState: this.desc2codeAtomPluginView.serialize()
    };
  },

  toggle() {
    let editor
    editor = atom.workspace.getActiveTextEditor()
    request.post('http://localhost:8080/tocode', {
      json: {
        query: editor.getSelectedText(),
        language: editor.getGrammar().name,
        context: editor.getText()
      }
    }, (error, res, body) => {
      if (error) {
        console.error(error)
	 atom.notifications.addWarning('Could not connect to server')
	 return
      }
      atom.notifications.addSuccess('Found results!')
      console.log(body)
      editor.insertText(body["code"])
    })
  }

};
