let context:SketchContext = null;
let document:MSDocument = null;
let selection = null;

let pluginFolderPath:string = null;
const frameworkFolderPath = '/Contents/Resources/frameworks/';

function getPluginFolderPath() {
    // Get absolute folder path of plugin
    const split = context.scriptPath.split('/');
    split.splice(-3, 3);
    return split.join('/');
}

export function initWithContext(ctx:SketchContext) {
    // This function needs to be called in the beginning of every entry point!
    // Set all env variables according to current context
    context = ctx;
    document = ctx.document
        || MSDocument.currentDocument();
    selection = document ? document.selectedLayers() : null;
    pluginFolderPath = getPluginFolderPath();

    // Here you could load custom cocoa frameworks if you need to
    // loadFramework('FrameworkName', 'ClassName');
    // => would be loaded into ClassName in global namespace!
}

export function loadFramework(frameworkName:string, frameworkClass:string) {
    // Only load framework if class not already available
    if (Mocha && NSClassFromString(frameworkClass) == null) {
        const frameworkDir = `${pluginFolderPath}${frameworkFolderPath}`;
        const mocha = Mocha.sharedRuntime();
        return mocha.loadFrameworkWithName_inDirectory(frameworkName, frameworkDir);
    }
    return false;
}

export {
    context,
    document,
    selection,
    pluginFolderPath
};
