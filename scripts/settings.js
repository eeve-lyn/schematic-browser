let repos = {
    setting: "schem-browser.repos",
    content: [],
    load: () => {
        let repoString = Core.settings.get(repos.setting, "");
        if (repoString == "") return;

        repos.content = repoString.split(";")
    },
    save: () => {
        if (repos.content == []) return;
        Core.settings.put(repos.setting, repos.content.join(";"));
    },
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
        Vars.ui.settings.addCategory("Schematic Browser", Icon.host, cons((t) => {
            let textbuffer = "";

            let paneTable = t.table(cons(() => {})).center().get();
            t.row();
            let rebuildPane = (t) => {
                t.clear();
                t.background(Styles.black6);
                t.pane(pane => {
                    repos.content.forEach(repo => {
                        pane.label(() => {
                            if (errorRepo.includes(repo)) return "[#ee9090]" + repo;
                            if (loadedRepo.includes(repo)) return "[#90ee90]" + repo;
                            else return repo;
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

                let field = tt.field("", (s) => {
                    textbuffer = s;
                }).width(250).pad(5).get();

                let addButton = tt.button(Icon.add, () => {
                    field.text = ""
                    repos.add(textbuffer);
                    rebuildPane(paneTable);
                }).pad(10).disabled(() => textbuffer == "");
                field.setMessageText("author/repository");
            })).center();

        }));
    }
}