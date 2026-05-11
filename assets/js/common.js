$(document).ready(function() {
    var selectedPublicationFilters = [];

    $('a.abstract').click(function() {
        $(this).parent().parent().find(".abstract.hidden").toggleClass('open');
    });
    $('a.bibtex').click(function() {
        $(this).parent().parent().find(".bibtex.hidden").toggleClass('open');
    });

    function updatePublicationFilterState() {
        $('.publication-filter-chip, .keyphrase-chip').removeClass('active');
        if (selectedPublicationFilters.length === 0) {
            $('.publication-filter-chip[data-filter="all"]').addClass('active');
            return;
        }

        selectedPublicationFilters.forEach(function(filter) {
            $('.publication-filter-chip[data-filter="' + filter + '"]').addClass('active');
            $('.keyphrase-chip[data-filter="' + filter + '"]').addClass('active');
        });
    }

    function applyPublicationFilters() {
        updatePublicationFilterState();

        if (selectedPublicationFilters.length === 0) {
            $('.bibliography li').show();
            $('.year, h2.bibliography').show();
            return;
        }

        $('.bibliography li').each(function() {
            var entry = $(this).find('.publication-entry').first();
            var keyphrases = (entry.data('keyphrases') || '').toString().split(/[,\s]+/).filter(Boolean);
            var matches = selectedPublicationFilters.every(function(filter) {
                return keyphrases.indexOf(filter) !== -1;
            });
            $(this).toggle(matches);
        });

        $('.year').each(function() {
            var hasVisibleEntries = $(this).nextUntil('.year').filter('ol.bibliography').find('li:visible').length > 0;
            $(this).toggle(hasVisibleEntries);
        });

        $('h2.bibliography').each(function() {
            var nextBibliography = $(this).nextAll('ol.bibliography').first();
            $(this).toggle(nextBibliography.find('li:visible').length > 0);
        });
    }

    $(document).on('click', '.publication-filter-chip, .keyphrase-chip', function() {
        var filter = $(this).data('filter');

        if (filter === 'all') {
            selectedPublicationFilters = [];
        } else if ($(this).hasClass('active')) {
            selectedPublicationFilters = selectedPublicationFilters.filter(function(selectedFilter) {
                return selectedFilter !== filter;
            });
        } else {
            selectedPublicationFilters.push(filter);
        }

        applyPublicationFilters();
    });

    $(document).on('click', '[data-filter-toggle]', function() {
        var extraTopics = $(this).siblings('[data-filter-extra]');
        extraTopics.toggleClass('open');
        $(this).text(extraTopics.hasClass('open') ? 'Fewer topics' : 'More topics');
    });
});
