var page = new tabris.Page({
    topLevel: true,
    title: "myapp"
});
new tabris.TextView({
    layoutData: {centerX: 0, centerY: 0},
    text: "My First App"
}).appendTo(page);
page.open();