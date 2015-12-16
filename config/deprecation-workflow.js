window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchMessage: "Ember.create is deprecated in favor of Object.create" },
    { handler: "silence", matchMessage: "Ember.keys is deprecated in favor of Object.keys" },
    // This is coming from Simpel Auth
    { handler: "silence", matchMessage: "`lookup` was called on a Registry. The `initializer` API no longer receives a container, and you should use an `instanceInitializer` to look up objects from the container." },
    { handler: "throw", matchMessage: "You tried to look up 'store:main', but this has been deprecated in favor of 'service:store'. [deprecation id: ds.store.deprecated-lookup]" },
    { handler: "throw", matchMessage: "You modified ShouldDisplay(projview) twice in a single render. This was unreliable in Ember 1.x and will be removed in Ember 2.0"},
    { handler: "throw", matchMessage: "A property of <atlmaps@view:-outlet::ember481> was modified inside the didInsertElement hook. You should never change properties on components, services or models during didInsertElement because it causes significant performance degradation."}
  ]
};
