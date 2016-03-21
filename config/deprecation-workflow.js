window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchMessage: "Ember.keys is deprecated in favor of Object.keys" },
    { handler: "silence", matchMessage: "The `initialize` method for Application initializer 'add-modals-container' should take only one argument - `App`, an instance of an `Application`." },
    // Caused by lazy video loader add-on. Hint: the add-on's initialize file calls it flash-messages
    { handler: "silence", matchMessage: "The `initialize` method for Application initializer 'flash-messages' should take only one argument - `App`, an instance of an `Application`." },
    // We need to update Simple Auth
    { handler: "silence", matchMessage: "Using the injected `container` is deprecated. Please use the `getOwner` helper instead to access the owner of this object." },
    { handler: "silence", matchMessage: "this.resource() is deprecated. Use this.route('name', { resetNamespace: true }, function () {}) instead." }
  ]
};
