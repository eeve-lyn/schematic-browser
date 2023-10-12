let {
    schems,
    schemsObj,
    errorRepos
} = require("schem-browser/fetch");

let {
    setFilter,
    getFilter,
    filter
} = require("schem-browser/filter");

function showInfo(schem) {
    let dialog = new BaseDialog("[[" + Core.bundle.get("schematic") + "] " +schem.name());
    dialog.addCloseButton();

    dialog.cont.add(Core.bundle.format("schematic.info", schem.width, schem.height, schem.tiles.size)).color(Color.lightGray).row();
    dialog.cont.add(new SchematicsDialog.SchematicImage(schem)).maxSize(800).row();

    let arr = schem.requirements().toSeq();
    dialog.cont.table(cons(r => {
        let i = 0;
        arr.each(s => {
            r.image(s.item.uiIcon).left().size(Vars.iconMed);
            r.label(() => {
                return "[lightgray]" + s.amount + "";
            }).padLeft(2).left().padRight(4);
            i++
            if (i % 4 == 0) {
                r.row();
            }
        });
    }));
    dialog.cont.row();

    let consume = schem.powerConsumption() * 60;
    let produce = schem.powerProduction() * 60;
    if (!Mathf.zero(consume) || !Mathf.zero(produce)) {
        dialog.cont.table(cons(t => {

            if (!Mathf.zero(produce)) {
                t.image(Icon.powerSmall).color(Pal.powerLight).padRight(3);
                t.add("+" + Strings.autoFixed(produce, 2)).color(Pal.powerLight).left();

                if (!Mathf.zero(consume)) {
                    t.add().width(15);
                }
            }

            if (!Mathf.zero(consume)) {
                t.image(Icon.powerSmall).color(Pal.remove).padRight(3);
                t.add("-" + Strings.autoFixed(consume, 2)).color(Pal.remove).left();
            }
        }));
    }
    dialog.show();
}

function filtersDialog() {
    let dialog = new BaseDialog("Filters");
    dialog.cont.table(Tex.button, cons(t => {
        t.pane((p) => {
            p.table(cons((tt) => {
                tt.label(() => {
                    return "Description:"
                }).pad(10);

                let field = tt.field(getFilter("desc"), (s) => {
                    setFilter("desc", s)
                }).growX().pad(10).get().setMessageText("...");
            })).growX().left();
            p.row();
        }).growX().fillY().top();
    })).grow().pad(70);
    dialog.addCloseButton();
    return dialog;
}

function schemImage(t, schem) {
    t.table(cons(table => {
        table.stack(new SchematicsDialog.SchematicImage(schem).setScaling(Scaling.fit), new Table(cons(n => {
            n.top();
            n.table(Styles.black3, c => {
                let label = c.add(schem.name()).style(Styles.outlineLabel).color(Color.white).top().growX().maxWidth(200 - 8).get();
                label.setEllipsis(true);
                label.setAlignment(Align.center);
            }).growX().margin(1).pad(4).maxWidth(Scl.scl(200 - 8)).padBottom(0);
        }))).size(200);
        table.row();
        table.table(Tex.button, cons(s => {
            s.defaults().height(50).width(55).pad(5);
            s.button(Icon.download, Styles.emptyi, () => {
                Vars.ui.showInfoFade("@schematic.saved");
                Vars.schematics.add(schem);
            });
            s.button(Icon.info, Styles.emptyi, () => {
                showInfo(schem);
            });
            s.button(Icon.copy, Styles.emptyi, () => {
                Vars.ui.showInfoFade("@copied");
                Core.app.setClipboardText(Vars.schematics.writeBase64(schem));
            });

        })).width(200).height(55).fillX().padTop(5);
    })).pad(10);
}

module.exports = () => {
    let schematics = schemsObj();
    let errorRepo = errorRepos();
    let filterDialog = filtersDialog();
    let dialog = new BaseDialog("Schematic Browser");
    dialog.addCloseButton();
    dialog.cont.table(cons(t => {
        let table = new Table();
        let rebuild = (p) => {
            p.clear();
            let i = 0;
            let cols = Math.max(Math.floor(Core.graphics.getWidth() / Scl.scl(230)), 1);
            Object.keys(schematics).forEach((repo) => {
                //if (errorRepo.includes(repo)) return;
                p.add(repo).center().color(Pal.accent);
        	p.row();
                p.image().growX().padTop(10).height(3).color(Pal.accent).center();
                p.row();
                p.table(cons(t => {
                    schematics[repo].forEach(schem => {
                        if (!filter(schem)) return;

                        schemImage(t, schem);
                        i++;
                        if (i % cols == 0) t.row();
                    });
                    if (i == 0) t.add(new Label("@none.found")).center();
                })).grow().padBottom(10).padTop(10);
                i = 0;
                p.row();
            });
        };
        filterDialog.hidden(() => {
            rebuild(table);
        });
        t.top();
        t.table(cons(s => {
            s.left();
            s.image(Icon.zoom);
            s.field(getFilter("text"), res => {
                setFilter("text",
                    res);
                rebuild(table);
            }).growX().padRight(10).get().setMessageText("@schematic.search");

            s.button(Icon.filter, () => {
                filterDialog.show();
            }).right();
        })).fillX().padBottom(4);
        t.row();

        rebuild(table);
        t.pane(table);

    })).grow();

    dialog.hidden(() => {
        Vars.ui.schematics.show();
    });
    return dialog
};
