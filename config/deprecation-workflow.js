window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchMessage: "Ember.keys is deprecated in favor of Object.keys" },
    { handler: "silence", matchMessage: "The `initialize` method for Application initializer 'add-modals-container' should take only one argument - `App`, an instance of an `Application`." },
    { handler: "silence", matchMessage: "The `initialize` method for Application initializer 'flash-messages' should take only one argument - `App`, an instance of an `Application`." },
    { handler: "silence", matchMessage: "Using the injected `container` is deprecated. Please use the `getOwner` helper instead to access the owner of this object." },
    { handler: "silence", matchMessage: "this.resource() is deprecated. Use this.route('name', { resetNamespace: true }, function () {}) instead." },
  ]
};
