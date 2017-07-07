window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
    workflow: [
        { handler: 'silence', matchId: 'ember-metal.model_factory_injections' },
        { handler: 'silence', matchId: 'ember-router.router' },
        { handler: 'silence', matchId: 'ember-metal.ember-k' },
        { handler: 'silence', matchId: 'ember-views.lifecycle-hook-arguments' }
    ]
};
