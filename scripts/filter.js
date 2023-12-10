const filters = {
    text: "",
    desc: "",
    planet: 0,
    hideNotPlaceable: false,
    hideTooExpensive: false
};

const textFilter = (schem) => filters.text === "" || schem.name().toLowerCase().includes(filters.text.toLowerCase());
const descFilter = (schem) => filters.desc === "" || schem.description().toLowerCase().includes(filters.desc.toLowerCase());
const planetFilter = (schem) => {
    let serpulo = schem.requirements().toSeq().contains(boolf(i => Items.serpuloItems.contains(i.item) && !Items.erekirItems.contains(i.item)));
    let erekir = schem.requirements().toSeq().contains(boolf(i => Items.erekirItems.contains(i.item) && !Items.serpuloItems.contains(i.item)));
    return [1, serpulo && !erekir, !serpulo && erekir, serpulo && erekir][filters.planet] || false;
};
const placeableFilter = (schem) => (   
    !filters.hideNotPlaceable
    || schem.tiles.copy().filter(
        (tile) => (!tile.block.isPlaceable()
            || !tile.block.environmentBuildable())
            // Sandbox-only blocks (sources and voids) are frequently used
            // to indicate inputs and outputs, so ignore them.
            && tile.block.buildVisibility != BuildVisibility.sandboxOnly
        )
        .empty
);
const affordableFilter = (schem) => !filters.hideTooExpensive || Vars.player.team().items().has(schem.requirements());


module.exports = {
    filter: (schem) => textFilter(schem) && descFilter(schem) && planetFilter(schem) && placeableFilter(schem) && affordableFilter(schem),
    setFilter: (filter, value) => (filters[filter] = value),
    getFilter: (filter) => filters[filter]
};
