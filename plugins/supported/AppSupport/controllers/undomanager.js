/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License
 * Version 1.1 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and
 * limitations under the License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * ***** END LICENSE BLOCK ***** */

var SC = require('sproutcore/runtime').SC;

/**
 * @class
 *
 * This simple undo manager coordinates undo for the app that embeds Bespin.
 * It's similar to SproutCore's UndoManager class, but it separates undo and
 * redo and correctly flushes the redo stack when an action is performed.
 */
exports.UndoManager = SC.Object.extend({
    _redoStack: null,
    _undoStack: null,

    _undoOrRedo: function(method, stack, otherStack) {
        if (stack.length === 0) {
            return false;
        }

        var record = stack.pop();
        if (!record.target[method](record.context)) {
            this._redoStack = [];
            this._undoStack = [];
            return false;
        }

        otherStack.push(record);
        return true;
    },

    init: function() {
        this._redoStack = [];
        this._undoStack = [];
    },

    /**
     * Redoes the last undone action.
     *
     * @return{boolean} True if the action was successfully redone, false
     *     otherwise.
     */
    redo: function() {
        return this._undoOrRedo('redo', this._redoStack, this._undoStack);
    },

    /**
     * Notifies the undo manager that an action was performed. When the action
     * is to be undone, the 'undo' message will be sent to the target with the
     * given context. When the action is to be redone, the 'redo' message is
     * sent in the same way.
     */
    registerUndo: function(target, context) {
        this._redoStack = [];
        this._undoStack.push({ target: target, context: context });
    },

    /**
     * Undoes the last action.
     *
     * @return{boolean} True if the action was successfully undone, false
     *     otherwise.
     */
    undo: function() {
        return this._undoOrRedo('undo', this._undoStack, this._redoStack);
    }
});

