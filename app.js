requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../app',
        utility: 'utility',
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/3.0.0/jquery.min',
        jqueryui: 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min',
        modernizr: 'http://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min',
        simpleAccordion: 'simple-accordion'
    }
});

requirejs(['app/main']);
