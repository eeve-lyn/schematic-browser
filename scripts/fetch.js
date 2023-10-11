let schems = {
    object: {},
    array: [],
    sync: () => {
        let target = schems["object"]
        let targetArr = schems["array"]
        Object.keys(target).forEach(repo => {
            schems["array"] = schems["array"].concat(target[repo]);
        });
    },
    loadedRepos: [],
    errorRepos: []
}

let {
    getRepos
} = require("schem-browser/settings");

function epicFail(e) {
    Log.info("Repository could not be reached. " + e);
}

function handleRepo(repo, result) {
    schems.loadedRepos.push(repo);
    let file = Vars.tmpDirectory.child(repo.replace("/", "") + ".zip");
    file.writeBytes(result.getResult());
    
    let zip = new ZipFi(file);
    
    schems.object[repo] = [];
    zip.walk(cons(f => {
        if (f.extEquals("msch")) {
            try {
                let schem = Schematics.read(f);
                schems.object[repo].push(schem);
            } catch (e) {
                if (!schems.errorRepos.includes(repo)) schems.errorRepos.push(repo);
            }
        }
    }));
    file.delete();
}

module.exports = {
    schemsObj: () => {
        return schems.object;
    },
    schems: () => {
        schems.sync();
        return schems.array;
    },
    loadedRepos: () => {
        return schems.loadedRepos;
    },
    errorRepos: () => {
        return schems.errorRepos;
    },
    fetch: () => {
        let repos = getRepos();
        repos.forEach(repo => {
            Log.info("Trying repo: " + repo + " @ " + Vars.ghApi + "/repos/" + repo + "/zipball/main");
            Http.get(Vars.ghApi + "/repos/" + repo + "/zipball/main", loc => {

                if (loc.getHeader("Location") != null) {
                    Http.get(loc.getHeader("Location"), result => {
                        handleRepo(repo, result)
                    }, epicFail);
                } else {
                    handleRepo(repo, loc);

                }

            },
                epicFail);
        });
    }
}
