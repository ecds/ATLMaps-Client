import Ember from 'ember';

export default Ember.Component.extend({
	actions: {

        toggleOptions: function(project) {
            var target = ".project-group-item[data-project-id='"+project+"'] .project-options",
                trigger = ".project-group-item[data-project-id='"+project+"'] .action.show-options",
                project_option = ".project-group-item .project-options";
            
            var $target = Ember.$(target),
                $project_option = Ember.$(project_option),
                $trigger = Ember.$(trigger);
            
            $project_option.not(target).removeClass("open");
            
            
            Ember.$('.projects').off('click.options').on('click.options', function(evt){
              var $clicked = Ember.$(evt.target);
              if( !$clicked.hasClass('project-options') && $clicked.closest('.project-options').length===0){
                Ember.$('.action.show-options').removeClass("active");
                $project_option.removeClass("open");
                $trigger.removeClass('active');
                Ember.$(this).off('click.options');
              }
            });
            
            $target.toggleClass("open");
            $trigger.toggleClass('active');
            
        },

        deleteProject: function(project) {
            
            var response = confirm("Are you sure you want to DELETE this project?");
            
            if (response === true) {
            	Ember.$("[data-project-id='"+project+"']").remove();
                this.store.find('project', project).then(function (project) {
                    project.destroyRecord();
                });
            }
            else {
                //var target = ".project-group-item[data-project-id='"+project+"'] .project-options";
                Ember.$(".project-group-item .project-options").removeClass("open");
            }
            
        }
    }
});
