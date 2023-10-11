let make = require("schem-browser/dialog");
let { loadRepos, setupCategory } = require("schem-browser/settings");
let { fetch } = require("schem-browser/fetch");

loadRepos();
fetch();
Events.on(ClientLoadEvent, () => {
    setupCategory();
    
    let dialog = make();

    Vars.ui.schematics.buttons.button("Schematic Browser", Icon.host, () => {
        dialog.show();
        Vars.ui.schematics.hide();
    });

});
