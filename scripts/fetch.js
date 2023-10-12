const { getRepos } = require("schem-browser/settings");

let schems = {
    object: {},
    array: [],
    sync: () => { schems.array = Object.values(schems.object).flat(); },
    loadedRepos: [],
    errorRepos: []
}

function epicFail(e) {
    Log.info("Repository could not be reached. " + e);
}

function handleRepo(repo, result) {
    schems.loadedRepos.push(repo);

    const fileName = repo.replace("/", "") + ".zip";
    const filePath = Vars.tmpDirectory.child(fileName);
    filePath.writeBytes(result.getResult());
    schems.object[repo] = [];
    new ZipFi(filePath).walk(f => {
        if (f.extEquals("msch")) {
            try {
                schems.object[repo].push(Schematics.read(f));
            } catch (e) {
                if (!schems.errorRepos.includes(repo)) schems.errorRepos.push(repo);
            }
        }
    });
    filePath.delete();
}

module.exports = {
    schemsObj: () => schems.object,
    schems: () => (schems.sync(), schems.array),
    loadedRepos: () => schems.loadedRepos,
    errorRepos: () => schems.errorRepos,
    fetch: () => {
        let repos = getRepos();
        repos.forEach(repo => {
            let repoUrl = Vars.ghApi + "/repos/" + repo + "/zipball/main";
            let handleLocation = (location) => {
                let handleResult = (result) => handleRepo(repo, result);
                location.getHeader("Location") != null
                  ? Http.get(location.getHeader("Location"), handleResult, epicFail)
                  : handleResult(location);
            };
            Http.get(repoUrl, handleLocation, epicFail);
        });
    }
}
