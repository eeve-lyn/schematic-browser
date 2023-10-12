const dialogConfig = {
    schematicInfoText: Core.bundle.format("schematic.info", schem.width, schem.height, schem.tiles.size),
    schematicImageMaxSize: 800,
    imageRowItems: 4,
    padding: {
        left: 2,
        right: 4,
    },
};

module.exports = dialogConfig;
