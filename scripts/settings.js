let repos = {
    setting: "schem-browser.repos",
    content: [],
    load: () => {
        let repoString = Core.settings.get(repos.setting, "");
        repos.content = repoString ? repoString.split(";") : [];
        Log.info(repos.setting)
    },
    save: () => { Core.settings.put(repos.setting, repos.content.join(";"));},
    add: (repo) => {
        if (repos.content.indexOf(repo) != -1) return;
        
        repos.content.push(repo);
        repos.save();
        repos.load();
    },
    remove: (repo) => {
        if (repos.content.indexOf(repo) == -1) return;
        repos.content.splice(repos.content.indexOf(repo), 1);
        repos.save();
        repos.load();
    }
}

module.exports = {
    loadRepos: () => {
        repos.load();
    },
    getRepos: () => {
        return repos.content;
    },
    setupCategory: () => {
        let { loadedRepos, errorRepos } = require("schem-browser/fetch");
        let loadedRepo = loadedRepos();
        let errorRepo = errorRepos();
        let textbuffer = "";
        Vars.ui.settings.addCategory("Schematic Browser", Icon.host, cons((t) => {

            let paneTable = t.table(cons(() => {})).center().get();
            t.row();
            let rebuildPane = (t) => {
                t.clear();
                t.background(Styles.black6);
                t.pane(pane => {
                    repos.content.forEach(repo => {
                        const repoColor = errorRepo.includes(repo) ? "#ee9090" : (loadedRepo.includes(repo) ? "#90ee90" : null);
                        pane.label(() => {
                            return repoColor ? `[${repoColor}]${repo}` : repo;
                        });
                        pane.button(Icon.cancel, () => {
                            repos.remove(repo);
                            rebuildPane(t);
                        }).pad(10);
                        pane.row();
                    });
                }).width(350).height(500);
            }
            rebuildPane(paneTable);

            t.table(cons((tt) => {
                tt.image(Icon.github);
            
                const field = tt.field("", (s) => {
                    textbuffer = s;
                }).width(250).pad(5).get();
            
                const addButton = tt.button(Icon.add, () => {
                    if (textbuffer) {
                        field.text = "";
                        repos.add(textbuffer);
                        rebuildPane(paneTable);
                    }
                }).pad(10).disabled(() => !textbuffer);  
                field.setMessageText("author/repository");
            })).center();
        }));
    }
}