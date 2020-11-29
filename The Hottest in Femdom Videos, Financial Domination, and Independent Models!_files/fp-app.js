/* global instantsearch algoliasearch */

search.addWidget(
    instantsearch.widgets.sortBy({
        container: '#sort-by',
        items: [
            { label: 'Newest', value: 'prod_content' },
            { label: 'Oldest', value: 'prod_sort_oldest' },
            { label: 'Price High', value: 'prod_sort_high_price' },
            { label: 'Price Low', value: 'prod_sort_lowest_price' },
        ]
    })
);


search.addWidget(
    instantsearch.widgets.pagination({
        container: '#pagination',
/*
        cssClasses: {
            list: ['pagination',],
            item:['activate'],
            disabledItem:['disabled'],
            previousPageItem:['previous'],
            nextPageItem:['next'],
            selectedItem:['active']
        },
        */
    })
);


search.start();

search.on('render', () => {
    bindPopover();
});
