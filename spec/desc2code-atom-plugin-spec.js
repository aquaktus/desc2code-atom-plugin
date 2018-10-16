'use babel';

import Desc2codeAtomPlugin from '../lib/desc2code-atom-plugin';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('Desc2codeAtomPlugin', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('desc2code-atom-plugin');
  });

  describe('when the desc2code-atom-plugin:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.desc2code-atom-plugin')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'desc2code-atom-plugin:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.desc2code-atom-plugin')).toExist();

        let desc2codeAtomPluginElement = workspaceElement.querySelector('.desc2code-atom-plugin');
        expect(desc2codeAtomPluginElement).toExist();

        let desc2codeAtomPluginPanel = atom.workspace.panelForItem(desc2codeAtomPluginElement);
        expect(desc2codeAtomPluginPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'desc2code-atom-plugin:toggle');
        expect(desc2codeAtomPluginPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.desc2code-atom-plugin')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'desc2code-atom-plugin:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let desc2codeAtomPluginElement = workspaceElement.querySelector('.desc2code-atom-plugin');
        expect(desc2codeAtomPluginElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'desc2code-atom-plugin:toggle');
        expect(desc2codeAtomPluginElement).not.toBeVisible();
      });
    });
  });
});
